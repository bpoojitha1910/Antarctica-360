import os
import time
from io import BytesIO
from functools import lru_cache
from datetime import datetime, timezone
from typing import Any

import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import LongTable, Paragraph, SimpleDocTemplate, Spacer, TableStyle

app = FastAPI(title="Antarctica 360 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXCEL_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "Bharati_AWS_2026_prototype_variant.xlsx",
)

def degrees_to_cardinal(deg: float) -> str:
    dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    idx = int((deg + 11.25) / 22.5) % 16
    return dirs[idx]

def calculate_risk(temperature: float, wind_speed: float, pressure: float, humidity: float) -> int:
    risk = 20
    if temperature < -30:
        risk += 20
    elif temperature < -20:
        risk += 10
    if wind_speed > 70:
        risk += 30
    elif wind_speed > 50:
        risk += 20
    if pressure < 970:
        risk += 15
    if humidity > 80:
        risk += 10
    return min(round(risk), 100)

def _sample_weather(df: pd.DataFrame, max_points: int = 48) -> list[dict[str, Any]]:
    """Return chronologically ordered observations at a UI-friendly density."""
    if df.empty:
        return []
    step = max(1, len(df) // max_points)
    sampled = df.iloc[::step]
    if sampled.index[-1] != df.index[-1]:
        sampled = pd.concat([sampled, df.iloc[[-1]]])
    return [
        {
            "time": row["obstime"].strftime("%H:%M"),
            "temperature": round(float(row["tempr"]), 1),
            "windSpeed": round(float(row["ws"]), 1),
            "pressure": round(float(row["ap"]), 1),
            "humidity": round(float(row["rh"]), 1),
            "windDirection": int(row["wd"]),
        }
        for _, row in sampled.iterrows()
    ]

def _analytics_for(df: pd.DataFrame) -> dict[str, Any]:
    """Calculate descriptive statistics, threshold anomalies, and a linear forecast."""
    if df.empty:
        return {
            "count": 0,
            "averages": {},
            "minimums": {},
            "maximums": {},
            "anomalyCount": 0,
            "anomalies": [],
            "forecast": {},
        }

    metric_columns = {
        "temperature": "tempr",
        "pressure": "ap",
        "windSpeed": "ws",
        "humidity": "rh",
    }
    averages = {key: round(float(df[column].mean()), 1) for key, column in metric_columns.items()}
    minimums = {key: round(float(df[column].min()), 1) for key, column in metric_columns.items()}
    maximums = {key: round(float(df[column].max()), 1) for key, column in metric_columns.items()}

    anomaly_mask = (
        (df["ws"] >= 50)
        | (df["ap"] <= 970)
        | (df["rh"] >= 80)
        | (df["tempr"] <= -30)
    )
    anomaly_rows = df.loc[anomaly_mask].tail(12)
    anomalies = [
        {
            "time": row["obstime"].strftime("%d %b %H:%M"),
            "reason": "High wind" if row["ws"] >= 50
            else "Low pressure" if row["ap"] <= 970
            else "High humidity" if row["rh"] >= 80
            else "Extreme cold",
        }
        for _, row in anomaly_rows.iterrows()
    ]

    forecast: dict[str, float] = {}
    recent = df.tail(min(len(df), 360))
    x = range(len(recent))
    for key, column in metric_columns.items():
        if len(recent) >= 2:
            slope, intercept = np.polyfit(list(x), recent[column].astype(float), 1)
            forecast[key] = round(float(intercept + slope * (len(recent) + 180)), 1)

    first = df.iloc[0]
    last = df.iloc[-1]
    return {
        "count": int(len(df)),
        "averages": averages,
        "minimums": minimums,
        "maximums": maximums,
        "anomalyCount": int(anomaly_mask.sum()),
        "anomalies": anomalies,
        "forecast": forecast,
        "periodStart": first["obstime"].isoformat(),
        "periodEnd": last["obstime"].isoformat(),
    }

@lru_cache(maxsize=1)
def _load_excel_dataset(_file_mtime: float) -> pd.DataFrame:
    if not os.path.exists(EXCEL_PATH):
        raise FileNotFoundError(f"Excel file '{EXCEL_PATH}' missing from backend folder.")

    # Read and normalize the live dataset supplied by the station.
    df = pd.read_excel(EXCEL_PATH)
    required_columns = {"obstime", "tempr", "ap", "ws", "wd", "rh"}
    missing_columns = required_columns.difference(df.columns)
    if missing_columns:
        raise ValueError(f"Weather dataset is missing columns: {sorted(missing_columns)}")
    df["obstime"] = pd.to_datetime(df["obstime"], errors="coerce")
    for column in required_columns - {"obstime"}:
        df[column] = pd.to_numeric(df[column], errors="coerce")
    df = df.dropna(subset=list(required_columns)).sort_values("obstime").reset_index(drop=True)
    if df.empty:
        raise ValueError("Weather dataset contains no valid observations.")
    return df

@lru_cache(maxsize=4)
def _read_excel_dataset(_file_mtime: float, _live_minute: int):
    df = _load_excel_dataset(_file_mtime)
    
    # Replay one observation per real minute so the historical export can act as
    # a predictable live feed during development and demonstrations.
    live_index = _live_minute % len(df)
    latest = df.iloc[live_index]

    # Observation ~3 hours prior (180 mins) for deltas
    prev_3h = df.iloc[max(0, live_index - 180)]

    temp_now = float(latest["tempr"])
    temp_prev = float(prev_3h["tempr"])
    temp_change = round(temp_now - temp_prev, 1)

    press_now = float(latest["ap"])
    press_prev = float(prev_3h["ap"])
    press_change = round(press_now - press_prev, 1)

    wind_now = float(latest["ws"])
    wind_prev = float(prev_3h["ws"])
    wind_change = round(wind_now - wind_prev, 1)

    rh_now = float(latest["rh"])
    rh_prev = float(prev_3h["rh"])
    rh_change = round(rh_now - rh_prev, 1)

    wind_deg = float(latest["wd"])
    wind_dir_label = degrees_to_cardinal(wind_deg)

    risk_score = calculate_risk(temp_now, wind_now, press_now, rh_now)
    risk_label = "High Risk" if risk_score >= 70 else "Moderate Risk" if risk_score >= 40 else "Low Risk"

    current_weather = {
        "temperature": temp_now,
        "temperatureChange": temp_change,
        "temperatureChangePeriod": "3h",
        "airPressure": press_now,
        "pressureChange": press_change,
        "pressureChangePeriod": "3h",
        "windSpeed": wind_now,
        "windSpeedChange": wind_change,
        "windSpeedChangePeriod": "3h",
        "humidity": rh_now,
        "humidityChange": rh_change,
        "humidityChangePeriod": "3h",
        "windDirection": int(wind_deg),
        "windDirectionLabel": wind_dir_label,
        "weatherRisk": risk_score,
        "riskLabel": risk_label,
    }

    obs_datetime = pd.to_datetime(latest["obstime"])
    obs_time_str = obs_datetime.strftime("%H:%M UTC")

    station_info = {
        "name": "Bharati Station",
        "location": "Larsemann Hills, Antarctica",
        "outsideTemp": temp_now,
        "windCondition": "Light Breeze" if wind_now < 10 else "Gale Wind" if wind_now > 30 else "Moderate Wind",
    }

    header_info = {
        "title": "Command Center",
        "subtitle": f"Live Operations • Bharati AWS ({obs_time_str})",
        "date": obs_datetime.strftime("%d %b %Y"),
        "time": obs_time_str,
        "lastDataChange": obs_datetime.strftime("%d %b %Y, %H:%M UTC"),
        "station": "Bharati Research Station",
    }

    # Provide real observations for each selectable analytics period.
    def period_slice(minutes: int) -> pd.DataFrame:
        start = max(0, live_index - minutes + 1)
        return df.iloc[start:live_index + 1]

    periods = {
        "24 Hours": period_slice(24 * 60),
        "7 Days": period_slice(7 * 24 * 60),
        "30 Days": period_slice(30 * 24 * 60),
    }
    weather_trend = _sample_weather(periods["24 Hours"], max_points=24)
    analytics = {}
    for period, period_df in periods.items():
        period_analytics = _analytics_for(period_df)
        period_analytics["trend"] = _sample_weather(period_df)
        analytics[period] = period_analytics

    # Dynamically construct alert data from dataset deltas
    alert_data = {
        "type": f"{risk_label} Detected",
        "time": obs_time_str,
        "description": "Dynamic environmental shift calculated from AWS dataset",
        "reasons": [
            {"text": "Wind speed delta", "highlight": f"{'+' if wind_change >= 0 else ''}{wind_change} knots", "suffix": "in last 3 hours"},
            {"text": "Air pressure delta", "highlight": f"{'+' if press_change >= 0 else ''}{press_change} mbar", "suffix": "in last 3 hours"},
            {"text": "Temperature delta", "highlight": f"{'+' if temp_change >= 0 else ''}{temp_change}°C", "suffix": "in last 3 hours"},
            {"text": "Humidity delta", "highlight": f"{'+' if rh_change >= 0 else ''}{rh_change}%", "suffix": "in last 3 hours"},
            {"text": "Computed Risk Level", "highlight": f"{risk_score}/100", "suffix": ""},
        ],
    }

    what_if_defaults = {
        "temperature": temp_now,
        "windSpeed": wind_now,
        "airPressure": press_now,
        "humidity": rh_now,
    }

    digital_twin = {
        "buildings": [
            {"name": "Research Labs", "status": "Normal" if risk_score < 70 else "Watch", "x": 20, "y": 15},
            {"name": "Living Quarters", "status": "Normal", "x": 70, "y": 15},
            {"name": "Power System", "status": "Watch" if risk_score >= 50 else "Normal", "x": 45, "y": 50},
            {"name": "Comm. System", "status": "Normal", "x": 20, "y": 80},
            {"name": "Storage", "status": "Normal", "x": 70, "y": 80},
        ]
    }

    station_impact = {
        "heatingDemand": min(100, int(abs(temp_now) * 3)),
        "powerDemand": min(100, int(50 + wind_now * 1.2)),
        "fuelConsumption": round(15 + abs(temp_now) * 0.5, 1),
        "outdoorOps": "Restrict" if risk_score >= 50 else "Normal",
    }

    return {
        "currentWeather": current_weather,
        "stationInfo": station_info,
        "headerInfo": header_info,
        "weatherTrendData": weather_trend,
        "weatherAnalytics": analytics,
        "alertData": alert_data,
        "digitalTwinData": digital_twin,
        "stationImpact": station_impact,
        "whatIfDefaults": what_if_defaults,
        "emergencyChecklist": [
            {"label": "Verify personnel status", "checked": True},
            {"label": "Check power system", "checked": True},
            {"label": "Monitor heating demand", "checked": risk_score >= 50},
            {"label": "Restrict external operations", "checked": risk_score >= 70},
            {"label": "Record incident", "checked": False},
        ],
        "navigationItems": [
            {"icon": "Home", "label": "Command Center", "active": True},
            {"icon": "CloudSun", "label": "Weather Analytics", "active": False},
            {"icon": "TriangleAlert", "label": "Risk & Alerts", "active": False},
            {"icon": "Box", "label": "Digital Twin", "active": False},
            {"icon": "FlaskConical", "label": "What-If Simulator", "active": False},
            {"icon": "Shield", "label": "Emergency Response", "active": False},
            {"icon": "FileText", "label": "Incident Reports", "active": False},
            {"icon": "RefreshCw", "label": "Shift Handover", "active": False},
            {"icon": "Info", "label": "About", "active": False},
        ],
    }


def read_excel_dataset():
    if not os.path.exists(EXCEL_PATH):
        raise FileNotFoundError(f"Excel file '{EXCEL_PATH}' missing from backend folder.")
    # The minute bucket changes the cache key and advances the replay feed.
    live_minute = int(time.time() // 60)
    return _read_excel_dataset(os.path.getmtime(EXCEL_PATH), live_minute)

class SimulationRequest(BaseModel):
    scenario: str = "Severe Blizzard"
    temperature: float = Field(default=-25.0)
    windSpeed: float = Field(default=45.0)
    airPressure: float = Field(default=965.0)
    humidity: float = Field(default=82.0)
    duration: str = "12 Hours"
    communication: str = "Degraded"
    heating: str = "Normal"
    powerGeneration: float = 60
    batteryLevel: float = 40
    fuelLevel: float = 55

@app.get("/")
def root() -> dict[str, str]:
    return {"name": "Antarctica 360 API", "status": "online"}

@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

@app.get("/api/dashboard")
def dashboard(live_tick: int | None = None) -> dict[str, Any]:
    if live_tick is None:
        return read_excel_dataset()
    return _read_excel_dataset(os.path.getmtime(EXCEL_PATH), live_tick)

@app.get("/api/weather")
def weather(start_date: str | None = None, end_date: str | None = None) -> dict[str, Any]:
    if not start_date and not end_date:
        data = read_excel_dataset()
        return {"current": data["currentWeather"], "trend": data["weatherTrendData"]}
    if not start_date or not end_date:
        raise HTTPException(status_code=400, detail="Both start_date and end_date are required for a custom range.")
    try:
        start = pd.Timestamp(start_date).normalize()
        end = pd.Timestamp(end_date).normalize() + pd.Timedelta(days=1)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Custom range dates must use YYYY-MM-DD format.") from exc
    if start >= end:
        raise HTTPException(status_code=400, detail="Custom range start_date must be before end_date.")
    df = _load_excel_dataset(os.path.getmtime(EXCEL_PATH))
    selected = df[(df["obstime"] >= start) & (df["obstime"] < end)]
    analytics = _analytics_for(selected)
    analytics["trend"] = _sample_weather(selected)
    return {"current": read_excel_dataset()["currentWeather"], "analytics": analytics}

@app.get("/api/weather/export")
def export_weather_pdf(start_date: str | None = None, end_date: str | None = None) -> StreamingResponse:
    df = _load_excel_dataset(os.path.getmtime(EXCEL_PATH))
    if start_date or end_date:
        if not start_date or not end_date:
            raise HTTPException(status_code=400, detail="Both start_date and end_date are required.")
        try:
            start = pd.Timestamp(start_date).normalize()
            end = pd.Timestamp(end_date).normalize() + pd.Timedelta(days=1)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Dates must use YYYY-MM-DD format.") from exc
        if start >= end:
            raise HTTPException(status_code=400, detail="Start date must be before end date.")
        df = df[(df["obstime"] >= start) & (df["obstime"] < end)]

    buffer = BytesIO()
    document = SimpleDocTemplate(
        buffer,
        pagesize=landscape(letter),
        leftMargin=0.35 * inch,
        rightMargin=0.35 * inch,
        topMargin=0.35 * inch,
        bottomMargin=0.35 * inch,
    )
    styles = getSampleStyleSheet()
    story = [
        Paragraph("Bharati AWS Weather Data Report", styles["Title"]),
        Paragraph(
            f"Observations: {len(df):,} | Range: {df['obstime'].min()} to {df['obstime'].max()}",
            styles["Normal"],
        ),
        Spacer(1, 0.15 * inch),
    ]
    rows = [["obstime", "temperature (°C)", "pressure (mbar)", "wind speed", "wind direction", "humidity (%)"]]
    rows.extend(
        [
            [
                row["obstime"].strftime("%Y-%m-%d %H:%M:%S"),
                f"{row['tempr']:.1f}",
                f"{row['ap']:.1f}",
                f"{row['ws']:.1f}",
                str(int(row["wd"])),
                f"{row['rh']:.1f}",
            ]
            for _, row in df.iterrows()
        ]
    )
    table = LongTable(rows, repeatRows=1, colWidths=[1.65 * inch, 1.15 * inch, 1.15 * inch, 1.0 * inch, 1.1 * inch, 1.0 * inch])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0b294d")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cbd5e1")),
        ("FONTSIZE", (0, 0), (-1, -1), 6),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#eff6ff")]),
    ]))
    story.append(table)
    document.build(story)
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="bharati-weather-data.pdf"'},
    )

@app.get("/api/station")
def station() -> dict[str, Any]:
    return read_excel_dataset()["stationInfo"]

@app.get("/api/alerts")
def alerts() -> dict[str, Any]:
    return read_excel_dataset()["alertData"]

@app.get("/api/digital-twin")
def digital_twin() -> dict[str, Any]:
    return read_excel_dataset()["digitalTwinData"]

@app.post("/api/simulate")
def simulate(request: SimulationRequest) -> dict[str, Any]:
    risk = calculate_risk(
        request.temperature,
        request.windSpeed,
        request.airPressure,
        request.humidity,
    )
    risk_status = "High Risk" if risk >= 70 else "Moderate Risk" if risk >= 40 else "Low Risk"

    duration_hours = int(request.duration.split()[0])
    power = max(0, round(request.powerGeneration - max(0, request.windSpeed - 25) * 1.1 - max(0, -request.temperature - 10) * 0.5))
    battery_hours = max(0.0, round(request.batteryLevel / max(1, risk / 25), 1))
    power = min(power, round(request.powerGeneration))
    outdoor_ops = "Suspended" if risk >= 70 else "Restricted" if risk >= 40 else "Normal"
    communication = "Offline" if request.communication == "Offline" else "Unstable" if risk >= 60 else request.communication
    if request.heating == "Critical":
        power = max(0, power - 15)
    elif request.heating == "Reduced":
        power = max(0, power - 5)

    return {
        "scenario": request.scenario,
        "duration": request.duration,
        "riskScore": risk,
        "riskStatus": risk_status,
        "impact": {
            "stationSafety": risk_status,
            "powerAvailability": f"{power}% Available",
            "batteryBackup": f"-{battery_hours} Hours",
            "communication": communication,
            "outdoorOperations": outdoor_ops,
            "researchActivities": "Limited" if risk >= 40 else "Normal",
            "duration": f"{duration_hours} hours evaluated",
            "heating": request.heating,
            "fuelLevel": f"{request.fuelLevel:.0f}%",
        },
        "riskFactors": [
            "Wind speed exceeds safe limit" if request.windSpeed >= 50 else "Wind conditions within monitored range",
            "Temperature dropping rapidly" if request.temperature <= -25 else "Temperature remains manageable",
            "Low air pressure indicates storm development" if request.airPressure < 970 else "Air pressure remains stable",
            "High humidity may reduce visibility" if request.humidity >= 80 else "Humidity remains manageable",
        ],
        "recommendations": [
            "Increase battery backup allocation" if risk >= 60 else "Maintain current battery allocation",
            "Restrict external operations" if risk >= 60 else "Continue outdoor operations with monitoring",
            "Monitor communication link continuously" if risk >= 40 else "Maintain normal communication monitoring",
        ],
    }