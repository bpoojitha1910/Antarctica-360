import React, { useState } from "react";
import BharatiDigitalTwin from "./BharatiDigitalTwin.jsx";
import { useDashboard } from "../DashboardContext";

import {
  Thermometer,
  Gauge,
  Wind,
  Droplets,
  Compass,
  Zap,
  Radio,
  HeartPulse,
  TestTube,
  Database,
  ShieldCheck,
  Play,
  FileText,
  RefreshCw,
  User,
} from "lucide-react";

export default function DigitalTwin() {
  const { data } = useDashboard();
  const [timeRange, setTimeRange] = useState("24H");
  const weather = data?.currentWeather || {};
  const impact = data?.stationImpact || {};
  const buildings = data?.digitalTwinData?.buildings || [];
  const buildingStatus = (name) => buildings.find((building) => building.name === name)?.status || "Normal";

  return (
    <div className="flex-1 bg-[#061224] text-slate-100 p-6 overflow-y-auto min-h-screen">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Digital Twin
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Real-time virtual replica of Bharati Research Station
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0d1f3a]/80 border border-slate-700/60 rounded-full px-3 py-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="font-medium text-emerald-400">
              Live Data
            </span>

            <span className="text-slate-500">|</span>

            <span>{data?.headerInfo?.date}</span>
            <span>{data?.headerInfo?.time}</span>
          </div>

          <button className="w-8 h-8 rounded-full bg-[#0d1f3a] border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition">
            <User size={16} />
          </button>
        </div>
      </div>

      {/* ================= TOP METRICS ================= */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <MetricCard
          icon={<Thermometer size={15} />}
          title="Temperature"
          value={weather.temperature}
          unit="°C"
          change={`${weather.temperatureChange >= 0 ? '↑' : '↓'} ${Math.abs(weather.temperatureChange || 0)}°C (${weather.temperatureChangePeriod || '3h'})`}
          changeColor="text-cyan-400"
          lineColor="#4f9cff"
          path="M0 26 L20 31 L40 14 L60 29 L80 19 L100 35 L120 22 L140 39 L160 28 L180 33 L200 39"
        />

        <MetricCard
          icon={<Gauge size={15} />}
          title="Air Pressure"
          value={weather.airPressure}
          unit="mbar"
          change={`${weather.pressureChange >= 0 ? '↑' : '↓'} ${Math.abs(weather.pressureChange || 0)} mbar (${weather.pressureChangePeriod || '3h'})`}
          changeColor="text-cyan-400"
          lineColor="#4f9cff"
          path="M0 15 L25 20 L50 25 L75 30 L100 36 L125 42 L150 42 L175 48 L200 47"
        />

        <MetricCard
          icon={<Wind size={15} />}
          title="Wind Speed"
          value={weather.windSpeed}
          unit="knots"
          change={`${weather.windSpeedChange >= 0 ? '↑' : '↓'} ${Math.abs(weather.windSpeedChange || 0)} knots (${weather.windSpeedChangePeriod || '3h'})`}
          changeColor="text-amber-400"
          lineColor="#f97316"
          path="M0 38 L20 28 L40 25 L60 17 L80 22 L100 12 L120 17 L140 5 L160 14 L180 8 L200 2"
        />

        <MetricCard
          icon={<Droplets size={15} />}
          title="Humidity"
          value={weather.humidity}
          unit="%"
          change={`${weather.humidityChange >= 0 ? '↑' : '↓'} ${Math.abs(weather.humidityChange || 0)}% (${weather.humidityChangePeriod || '3h'})`}
          changeColor="text-amber-400"
          lineColor="#8b5cf6"
          path="M0 38 L20 30 L40 35 L60 20 L80 25 L100 12 L120 16 L140 4 L160 8 L180 2 L200 0"
        />

        {/* WIND DIRECTION */}

        <div className="bg-[#0b1b33] border border-slate-700/70 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Compass size={15} className="text-cyan-400" />
            <span>Wind Direction</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">
                {weather.windDirection}°
              </div>

              <div className="text-xs font-semibold text-slate-400">
                {weather.windDirectionLabel}
              </div>
            </div>

            <div className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-cyan-400">
              <Compass
                size={21}
                style={{ transform: `rotate(${weather.windDirection || 0}deg)` }}
              />
            </div>
          </div>
        </div>

        {/* WEATHER RISK */}

        <div className="bg-[#0b1b33] border border-slate-700/70 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Weather Risk</span>
            <span className="w-2 h-2 rounded-full bg-red-500" />
          </div>

          <div className="flex flex-col items-center my-1">
            <div className="text-2xl font-bold text-white">
              {weather.weatherRisk}
              <span className="text-xs text-slate-400">
                /100
              </span>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 mt-1">
              {weather.riskLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN CENTER AREA ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        {/* ================= INTERACTIVE 3D DIGITAL TWIN ================= */}

        <div className="lg:col-span-8 bg-[#0b1b33] border border-slate-700/70 rounded-2xl overflow-hidden min-h-[600px]">
          <BharatiDigitalTwin />
        </div>

        {/* ================= SIDE OVERVIEW ================= */}

        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* SYSTEM HEALTH */}

          <div className="bg-[#0b1b33] border border-slate-700/70 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white">
                System Health Overview
              </h3>

              <span className="text-[11px] text-emerald-400">
                ● Live
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <SystemCard
                icon={<Zap size={17} />}
                name="Power System"
                status={buildingStatus("Power System")}
                warning={buildingStatus("Power System") !== "Normal"}
              />

              <SystemCard
                icon={<Radio size={17} />}
                name="Comm. System"
                status={buildingStatus("Comm. System")}
              />

              <SystemCard
                icon={<HeartPulse size={17} />}
                name="Life Support"
                status={buildingStatus("Living Quarters")}
              />

              <SystemCard
                icon={<TestTube size={17} />}
                name="Research Labs"
                status={buildingStatus("Research Labs")}
              />

              <SystemCard
                icon={<Database size={17} />}
                name="Storage"
                status={buildingStatus("Storage")}
              />

              <SystemCard
                icon={<ShieldCheck size={17} />}
                name="Security"
                status={buildingStatus("Security")}
              />
            </div>
          </div>

          {/* RESOURCE UTILIZATION */}

          <div className="bg-[#0b1b33] border border-slate-700/70 rounded-2xl p-4 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-white">
                Resource Utilization
              </h3>

              <span className="text-[11px] text-emerald-400">
                ● Live
              </span>
            </div>

            <div className="space-y-4">
              <ResourceBar
                icon={<Zap size={13} className="text-amber-400" />}
                title="Power Usage"
                value={`${impact.powerDemand ?? 0}%`}
                width={`${impact.powerDemand ?? 0}%`}
                color="bg-blue-500"
              />

              <ResourceBar
                icon={<Database size={13} className="text-cyan-400" />}
                title="Fuel Level"
                value={`${Math.max(0, 100 - (impact.fuelConsumption ?? 0))}%`}
                width={`${Math.max(0, 100 - (impact.fuelConsumption ?? 0))}%`}
                color="bg-emerald-400"
              />

              <ResourceBar
                icon={<Droplets size={13} className="text-cyan-400" />}
                title="Water Supply"
                value={`${Math.max(0, 100 - (impact.heatingDemand ?? 0) / 2)}%`}
                width={`${Math.max(0, 100 - (impact.heatingDemand ?? 0) / 2)}%`}
                color="bg-indigo-500"
              />

              <ResourceBar
                icon={<Radio size={13} className="text-cyan-400" />}
                title="Internet Bandwidth"
                value={`${weather.weatherRisk ? Math.max(0, 100 - weather.weatherRisk) : 0}%`}
                width={`${weather.weatherRisk ? Math.max(0, 100 - weather.weatherRisk) : 0}%`}
                color="bg-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM GRID ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* TREND */}

        <div className="lg:col-span-6 bg-[#0b1b33] border border-slate-700/70 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-white">
              Environmental Trend{" "}
              <span className="text-slate-400 font-normal">
                (Last 24 Hours)
              </span>
            </h3>

            <div className="flex bg-[#071326] p-1 rounded-lg border border-slate-800 text-xs">
              {["24H", "7D", "30D"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    timeRange === range
                      ? "bg-slate-700 text-white"
                      : "text-slate-400"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-40 relative flex items-end pt-4 pb-2 border-b border-slate-800">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 400 120"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 60 Q 100 80 200 40 T 400 30"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />

              <path
                d="M 0 90 Q 100 50 200 70 T 400 85"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              <path
                d="M 0 100 Q 100 95 200 80 T 400 90"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />

              <path
                d="M 0 20 Q 100 40 200 15 T 400 35"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>10:00</span>
          </div>

          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-300 mt-3">
            <span>🔵 Temperature</span>
            <span>🟠 Wind Speed</span>
            <span>🟢 Pressure</span>
            <span>🟣 Humidity</span>
          </div>
        </div>

        {/* STATUS */}

        <div className="lg:col-span-3 bg-[#0b1b33] border border-slate-700/70 rounded-2xl p-4 flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-white mb-2">
            Digital Twin Status
          </h3>

          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <Database size={28} />
            </div>

            <div className="text-xs font-semibold text-emerald-400">
              All systems operational
            </div>

            <div className="text-[10px] text-slate-400 mt-0.5">
              Last synced: {data?.headerInfo?.time}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2">
            <ActionButton
              icon={<Play size={16} />}
              text="Scenario Simulation"
            />

            <ActionButton
              icon={<ShieldCheck size={16} />}
              text="System Diagnostics"
            />

            <ActionButton
              icon={<FileText size={16} />}
              text="Export Report"
            />

            <ActionButton
              icon={<RefreshCw size={16} />}
              text="Data Sync"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition">
            <Play size={14} fill="white" />
            Run Simulation
          </button>
        </div>

        {/* EVENTS */}

        <div className="lg:col-span-3 bg-[#0b1b33] border border-slate-700/70 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white">
                Recent Events
              </h3>

              <span className="text-[11px] text-emerald-400">
                ● Live
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <Event
                time="10:41 UTC"
                text="High weather risk detected"
                danger
              />

              <Event
                time="10:32 UTC"
                text="Power load increased"
              />

              <Event
                time="10:21 UTC"
                text="All systems normal"
              />

              <Event
                time="10:10 UTC"
                text="Data sync completed"
              />
            </div>
          </div>

          <button className="w-full text-center text-xs text-slate-400 hover:text-white pt-3 border-t border-slate-800 transition">
            View All Events →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function MetricCard({
  icon,
  title,
  value,
  unit,
  change,
  changeColor,
  lineColor,
  path,
}) {
  return (
    <div className="bg-[#0b1b33] border border-slate-700/70 rounded-2xl p-3.5 flex flex-col justify-between">
      <div className="flex items-center gap-2 text-slate-400 text-xs">
        <span className="text-cyan-400">
          {icon}
        </span>

        <span>{title}</span>
      </div>

      <div className="mt-2">
        <div className="text-2xl font-bold text-white">
          {value}

          <span className="text-base font-normal text-slate-400 ml-1">
            {unit}
          </span>
        </div>

        <svg
          viewBox="0 0 200 40"
          className="w-full h-7 mt-2"
          preserveAspectRatio="none"
        >
          <path
            d={path}
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
          />
        </svg>

        <div className={`text-[11px] ${changeColor}`}>
          {change}
        </div>
      </div>
    </div>
  );
}

function SystemCard({
  icon,
  name,
  status,
  warning = false,
}) {
  return (
    <div
      className={`bg-[#071326] border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1 min-h-[85px] ${
        warning
          ? "border-amber-500/30"
          : "border-slate-700"
      }`}
    >
      <div
        className={
          warning
            ? "text-amber-400"
            : "text-cyan-400"
        }
      >
        {icon}
      </div>

      <div className="text-[10px] font-medium text-slate-200">
        {name}
      </div>

      <div
        className={`text-[9px] ${
          warning
            ? "text-amber-400"
            : "text-emerald-400"
        }`}
      >
        ● {status}
      </div>
    </div>
  );
}

function ResourceBar({
  icon,
  title,
  value,
  width,
  color,
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-300 flex items-center gap-2">
          {icon}
          {title}
        </span>

        <span className="font-semibold text-white">
          {value}
        </span>
      </div>

      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full`}
          style={{ width }}
        />
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  text,
}) {
  return (
    <button className="bg-[#071326] hover:bg-slate-800 border border-slate-800 p-2 rounded-xl flex flex-col items-center text-center transition">
      <span className="text-cyan-400 mb-1">
        {icon}
      </span>

      <span className="text-[10px] font-medium text-slate-200">
        {text}
      </span>
    </button>
  );
}

function Event({
  time,
  text,
  danger = false,
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
        {time}
      </span>

      <span
        className={
          danger
            ? "text-red-400 font-medium leading-tight"
            : "text-slate-300 leading-tight"
        }
      >
        {text}
      </span>
    </div>
  );
}
