# Antarctica 360

Antarctica 360 is a React/Vite dashboard for Bharati Research Station with a Python/FastAPI backend.

## Stack

- Frontend: React 19, Vite, Tailwind CSS, Three.js / React Three Fiber, Recharts
- Backend: Python, FastAPI, Pydantic, Uvicorn
- API: REST/JSON

## Run the project

### Option A — Windows one-click development launcher

### Option B — two terminals

Terminal 1:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Terminal 2:

```powershell
npm run dev
```

Open http://localhost:5173.

## Frontend/backend connection

The frontend calls `/api/...`. Vite proxies those requests to `http://127.0.0.1:8000` during development.

Main endpoints:

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/weather`
- `GET /api/station`
- `GET /api/alerts`
- `GET /api/digital-twin`
- `POST /api/simulate`

The dashboard no longer imports its displayed data directly from `src/data/mockData.js`; it loads the data from the FastAPI backend through `DashboardContext`.

## What is real vs modelled right now

The API and frontend integration are real and working locally. Weather values are read from `backend/Bharati_AWS_2026_prototype_variant.xlsx` using the `obstime`, `tempr`, `ap`, `ws`, `wd`, and `rh` columns. The backend calculates period summaries, threshold-based anomalies, operational risk, and a simple three-hour linear trend forecast from recent observations. There is not yet a live weather provider, database, or trained ML model connected to this ZIP. The `/api/simulate` endpoint performs deterministic risk/impact calculations in Python.

The dashboard automatically refreshes every 60 seconds and also has a Refresh button for immediate updates. The fixed workbook is replayed as a live feed: each minute advances to the next historical observation, allowing the dashboard to show changing information without a live sensor connection. Replace this replay with a real provider when live station telemetry is available.
