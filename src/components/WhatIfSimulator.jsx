import React, { useState } from "react";

import {
  Rocket,
  Play,
  Thermometer,
  Wind,
  Gauge,
  Droplets,
  Snowflake,
  Zap,
  Radio,
  ThermometerSnowflake,
  HeartPulse,
  RotateCcw,
  BrainCircuit,
  Battery,
  Activity,
  Lightbulb,
  Clock,
  Network,
  Download,
  ChevronDown,
} from "lucide-react";

import { api } from "../services_api";
import BharatiDigitalTwin from "./BharatiDigitalTwin";
import { useDashboard } from "../DashboardContext";

/* =========================================================
   DEFAULT VALUES
========================================================= */

const whatIfDefaults = {
  temperature: -25,
  windSpeed: 45,
  airPressure: 965,
  humidity: 82,
};

/* =========================================================
   SCENARIOS
========================================================= */

const scenarios = [
  {
    name: "Severe Blizzard",
    shortName: "Blizzard",
    subtitle: "High Winds, Low Temp",
    icon: Snowflake,
  },
  {
    name: "Power Outage",
    shortName: "Power Failure",
    subtitle: "Total Power Loss",
    icon: Zap,
  },
  {
    name: "Communication Failure",
    shortName: "Comm Failure",
    subtitle: "Satellite Link Down",
    icon: Radio,
  },
  {
    name: "Extreme Cold",
    shortName: "Extreme Cold",
    subtitle: "Temp Dropping Fast",
    icon: ThermometerSnowflake,
  },
  {
    name: "Medical Emergency",
    shortName: "Medical Emergency",
    subtitle: "Critical Situation",
    icon: HeartPulse,
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function WhatIfSimulator() {
  const { data } = useDashboard();
  const defaults = data?.whatIfDefaults || whatIfDefaults;
  const [selectedScenario, setSelectedScenario] =
    useState("Severe Blizzard");

  const [values, setValues] = useState({
    temperature: defaults.temperature,
    windSpeed: defaults.windSpeed,
    airPressure: defaults.airPressure,
    humidity: defaults.humidity,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const [activeDuration, setActiveDuration] =
    useState("12 Hours");

  const [simulationResult, setSimulationResult] =
    useState(null);

  /* =========================================================
     RISK CALCULATION
  ========================================================= */

  const calculateRisk = () => {
    let risk = 20;

    if (values.temperature < -30) risk += 20;
    else if (values.temperature < -20) risk += 10;

    if (values.windSpeed > 70) risk += 30;
    else if (values.windSpeed > 50) risk += 20;

    if (values.airPressure < 970) risk += 15;

    if (values.humidity > 80) risk += 10;

    return Math.min(Math.round(risk), 100);
  };

  const riskScore =
    simulationResult?.riskScore ?? calculateRisk();

  const updateValue = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  /* =========================================================
     SIMULATION
  ========================================================= */

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setSimulationResult(null);

    try {
      const result = await api.simulate({
        scenario: selectedScenario,
        ...values,
        duration: activeDuration,
      });

      setSimulationResult(result);

      let current = 0;

      const interval = setInterval(() => {
        current += 10;

        setProgress(Math.min(current, 100));

        if (current >= 100) {
          clearInterval(interval);
          setIsRunning(false);
        }
      }, 80);
    } catch (error) {
      console.error("Simulation failed:", error);

      setIsRunning(false);
    }
  };

  const resetSimulation = () => {
    setValues({
      temperature: defaults.temperature,
      windSpeed: defaults.windSpeed,
      airPressure: defaults.airPressure,
      humidity: defaults.humidity,
    });

    setSelectedScenario("Severe Blizzard");

    setProgress(0);

    setIsRunning(false);

    setActiveDuration("12 Hours");

    setSimulationResult(null);
  };

  /* =========================================================
     SLIDERS
  ========================================================= */

  const sliders = [
    {
      icon: Thermometer,
      label: "Temperature",
      key: "temperature",
      value: values.temperature,
      unit: "°C",
      min: -50,
      max: 0,
    },
    {
      icon: Wind,
      label: "Wind Speed",
      key: "windSpeed",
      value: values.windSpeed,
      unit: "knots",
      min: 0,
      max: 100,
    },
    {
      icon: Gauge,
      label: "Air Pressure",
      key: "airPressure",
      value: values.airPressure,
      unit: "mbar",
      min: 940,
      max: 1010,
    },
    {
      icon: Droplets,
      label: "Humidity",
      key: "humidity",
      value: values.humidity,
      unit: "%",
      min: 0,
      max: 100,
    },
  ];

  /* =========================================================
     RISK STATUS
  ========================================================= */

  const riskStatus =
    riskScore >= 70
      ? "High Risk"
      : riskScore >= 40
      ? "Moderate Risk"
      : "Low Risk";

  const riskColor =
    riskScore >= 70
      ? "#fb923c"
      : riskScore >= 40
      ? "#facc15"
      : "#34d399";

  return (
    <div className="min-h-screen bg-[#06152d] text-white p-5 lg:p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-5">

        <div>

          <div className="flex items-center gap-2">

            <Rocket
              size={24}
              className="text-blue-400"
            />

            <h1 className="text-2xl lg:text-3xl font-bold">
              What-If Simulator
            </h1>

            <span className="w-5 h-5 rounded-full border border-blue-400/50 text-blue-300 text-xs flex items-center justify-center">
              ?
            </span>

          </div>

          <p className="text-sm text-slate-400 mt-1">
            Test scenarios, predict impact, and make data-driven decisions
            for a safer Antarctic mission.
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-blue-400/20 bg-[#0a1d38] text-sm text-slate-300">

            Saved Scenarios

            <ChevronDown size={15} />

          </button>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 transition disabled:opacity-60"
          >

            <Play size={15} fill="white" />

            {isRunning
              ? "Simulating..."
              : "Run Simulation"}

          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-blue-400/20 bg-[#0a1d38] text-sm hover:bg-[#0d2444]"
          >

            <RotateCcw size={15} />

            Reset

          </button>

        </div>

      </div>

      {/* =====================================================
          SCENARIOS
      ===================================================== */}

      <div className="bg-[#091d38] border border-blue-400/15 rounded-xl p-4 mb-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Select Scenario
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">

          {scenarios.map((scenario) => {

            const Icon = scenario.icon;

            const active =
              selectedScenario === scenario.name;

            return (

              <button
                key={scenario.name}
                onClick={() =>
                  setSelectedScenario(scenario.name)
                }
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200
                  ${
                    active
                      ? "border-blue-400 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                      : "border-blue-400/10 bg-[#071a33] hover:border-blue-400/40 hover:bg-blue-500/5"
                  }
                `}
              >

                <Icon
                  size={20}
                  className={
                    active
                      ? "text-cyan-400"
                      : "text-slate-400"
                  }
                />

                <div>

                  <p className="text-xs font-semibold">
                    {scenario.shortName}
                  </p>

                  <p className="text-[9px] text-slate-500 mt-1">
                    {scenario.subtitle}
                  </p>

                </div>

              </button>

            );
          })}

          <button className="border border-dashed border-blue-400/30 rounded-lg p-3 flex items-center justify-center gap-2 text-xs text-slate-400 hover:bg-blue-400/5 transition">

            <span className="text-lg">
              ＋
            </span>

            Custom Scenario

          </button>

        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_300px] gap-4">

        {/* LEFT CONTROLS */}

        <div className="space-y-4">

          {/* WEATHER CONTROLS */}

          <div className="bg-[#091d38] border border-blue-400/15 rounded-xl p-4">

            <h3 className="text-xs font-bold tracking-wide text-blue-200 mb-4">
              SCENARIO CONTROLS
            </h3>

            <p className="text-xs font-semibold text-slate-400 mb-4">
              Weather Conditions
            </p>

            <div className="space-y-5">

              {sliders.map(
                ({
                  icon: Icon,
                  label,
                  key,
                  value,
                  unit,
                  min,
                  max,
                }) => (

                  <div key={label}>

                    <div className="flex items-center justify-between mb-2">

                      <div className="flex items-center gap-2">

                        <Icon
                          size={13}
                          className="text-blue-400"
                        />

                        <span className="text-xs text-slate-400">
                          {label}
                        </span>

                      </div>

                      <span className="text-xs font-bold">
                        {value} {unit}
                      </span>

                    </div>

                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={value}
                      onChange={(e) =>
                        updateValue(
                          key,
                          e.target.value
                        )
                      }
                      className="w-full accent-blue-500"
                    />

                    <div className="flex justify-between text-[9px] text-slate-600 mt-1">

                      <span>{min}</span>

                      <span>{max}</span>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

          {/* STATION SYSTEMS */}

          <div className="bg-[#091d38] border border-blue-400/15 rounded-xl p-4">

            <p className="text-xs font-semibold text-slate-400 mb-3">
              Station Systems
            </p>

            <SystemRow
              icon={Zap}
              label="Power Generation"
              value="60%"
            />

            <SystemRow
              icon={Battery}
              label="Battery Level"
              value="40%"
            />

            <SystemRow
              icon={Activity}
              label="Fuel Level"
              value="55%"
            />

            <div className="mt-4 space-y-2">

              <select className="w-full bg-[#071a33] border border-blue-400/15 rounded-lg p-2 text-xs text-slate-300">

                <option>
                  Communication: Degraded
                </option>

                <option>
                  Communication: Normal
                </option>

                <option>
                  Communication: Offline
                </option>

              </select>

              <select className="w-full bg-[#071a33] border border-blue-400/15 rounded-lg p-2 text-xs text-slate-300">

                <option>
                  Heating: Normal
                </option>

                <option>
                  Heating: Reduced
                </option>

                <option>
                  Heating: Critical
                </option>

              </select>

            </div>

          </div>

          {/* DURATION */}

          <div className="bg-[#091d38] border border-blue-400/15 rounded-xl p-4">

            <p className="text-xs font-semibold text-slate-400 mb-3">
              Simulation Duration
            </p>

            <div className="grid grid-cols-2 gap-2">

              {[
                "1 Hour",
                "6 Hours",
                "12 Hours",
                "24 Hours",
              ].map((duration) => (

                <button
                  key={duration}
                  onClick={() =>
                    setActiveDuration(duration)
                  }
                  className={`py-2 rounded-lg text-[10px] transition ${
                    activeDuration === duration
                      ? "bg-blue-500/20 border border-blue-400 text-blue-300"
                      : "bg-[#071a33] border border-blue-400/10 text-slate-400 hover:border-blue-400/30"
                  }`}
                >
                  {duration}
                </button>

              ))}

            </div>

          </div>

          {/* AI ASSISTANT */}

          <div className="rounded-xl p-4 border border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-blue-500/5">

            <div className="flex items-center gap-2 mb-2">

              <BrainCircuit
                size={17}
                className="text-purple-400"
              />

              <span className="text-xs font-bold">
                AI Scenario Assistant
              </span>

              <span className="text-[8px] bg-emerald-400/20 text-emerald-400 px-1.5 py-0.5 rounded">
                NEW
              </span>

            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              AI suggests high-impact scenarios based on weather trends
              and historical station risks.
            </p>

            <button className="mt-3 w-full border border-purple-400/30 rounded-lg py-2 text-[10px] text-purple-300 hover:bg-purple-500/10 transition">
              Generate Insights ✨
            </button>

          </div>

        </div>

        {/* =================================================
            CENTER - DIGITAL TWIN
        ================================================= */}

        <div className="space-y-4 min-w-0">

          <div className="bg-[#091d38] border border-blue-400/15 rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-b border-blue-400/10 bg-[#0b203d]">

              <div>

                <h3 className="text-xs font-bold tracking-[0.12em] text-blue-100">
                  DIGITAL TWIN SIMULATION VIEW
                </h3>

                <div className="flex gap-4 mt-2 text-[9px] text-slate-400">

                  <span className="flex items-center gap-1">
                    <i className="w-2 h-2 rounded-full bg-emerald-400" />
                    Normal
                  </span>

                  <span className="flex items-center gap-1">
                    <i className="w-2 h-2 rounded-full bg-yellow-400" />
                    Warning
                  </span>

                  <span className="flex items-center gap-1">
                    <i className="w-2 h-2 rounded-full bg-red-500" />
                    Critical
                  </span>

                </div>

              </div>

              {/* STATUS */}

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#071a33] border border-emerald-400/15">

                <span
                  className={`w-2 h-2 rounded-full ${
                    isRunning
                      ? "bg-cyan-400 animate-pulse"
                      : "bg-emerald-400"
                  }`}
                />

                <div>

                  <p className="text-[8px] uppercase tracking-wider text-slate-500">
                    Simulation
                  </p>

                  <p className="text-[10px] font-semibold text-slate-200">

                    {isRunning
                      ? "Running Live"
                      : "Digital Twin Ready"}

                  </p>

                </div>

              </div>

            </div>

            {/* DIGITAL TWIN */}

            <div className="relative bg-[#061224] overflow-hidden">

              <BharatiDigitalTwin />

            </div>

            {/* PROGRESS */}

            <div className="p-4 border-t border-blue-400/10 bg-[#081a32]">

              <div className="flex justify-between items-center text-[10px] mb-2">

                <span className="text-slate-400">

                  Simulation Status:

                  <span
                    className={`ml-2 font-semibold ${
                      isRunning
                        ? "text-cyan-300"
                        : progress === 100
                        ? "text-emerald-400"
                        : "text-blue-300"
                    }`}
                  >

                    {isRunning
                      ? "Running..."
                      : progress === 100
                      ? "Simulation Complete"
                      : "Ready"}

                  </span>

                </span>

                <span className="font-semibold text-slate-300">
                  {progress}%
                </span>

              </div>

              <div className="h-2.5 bg-[#051225] rounded-full overflow-hidden border border-blue-400/10">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* FORECAST */}

          <div className="bg-[#091d38] border border-blue-400/15 rounded-xl p-4">

            <div className="flex items-center justify-between mb-4">

              <h3 className="text-xs font-bold text-blue-200">
                SIMULATION TIMELINE & FORECAST
              </h3>

              <span className="text-[9px] text-slate-500">
                Predictive Analysis
              </span>

            </div>

            <div className="overflow-x-auto">

              <div className="min-w-[620px] grid grid-cols-[130px_repeat(5,1fr)] gap-y-3 text-[10px]">

                <div></div>

                {[
                  "NOW",
                  "+3 HRS",
                  "+6 HRS",
                  "+12 HRS",
                  "+24 HRS",
                ].map((time) => (

                  <div
                    key={time}
                    className="text-center text-slate-500 font-bold"
                  >
                    {time}
                  </div>

                ))}

                <ForecastRow
                  label="● Temperature (°C)"
                  values={[
                    "-18",
                    "-22",
                    "-25",
                    "-28",
                    "-30",
                  ]}
                  color="text-blue-400"
                />

                <ForecastRow
                  label="● Wind Speed"
                  values={[
                    "32",
                    "48",
                    "65",
                    "70",
                    "55",
                  ]}
                  color="text-orange-400"
                />

                <ForecastRow
                  label="● Power Availability"
                  values={[
                    "60%",
                    "45%",
                    "35%",
                    "20%",
                    "10%",
                  ]}
                  color="text-emerald-400"
                />

                <ForecastRow
                  label="● Risk Level"
                  values={[
                    "22",
                    "42",
                    "68",
                    "82",
                    "90",
                  ]}
                  color="text-red-400"
                />

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT RESULTS
        ================================================= */}

        <div className="space-y-4">

          {/* RISK SCORE */}

          <div className="bg-[#091d38] border border-blue-400/15 rounded-xl p-5 overflow-hidden">

            <div className="flex justify-between items-center">

              <h3 className="text-xs font-bold text-blue-200">
                PREDICTED RISK SCORE
              </h3>

              <span
                className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                  riskScore >= 70
                    ? "bg-red-500/10 text-red-400 border border-red-400/20"
                    : riskScore >= 40
                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-400/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20"
                }`}
              >
                {riskStatus}
              </span>

            </div>

            {/* GAUGE */}

            <div className="flex justify-center mt-7 mb-5">

              <div className="relative w-[210px] h-[115px]">

                <div className="absolute inset-0 rounded-t-full border-[14px] border-b-0 border-[#112a47]" />

                <div
                  className="absolute inset-0 rounded-t-full border-[14px] border-b-0 border-transparent"
                  style={{
                    borderTopColor: riskColor,
                    borderLeftColor: riskColor,
                  }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">

                  <div className="flex items-end gap-1">

                    <span className="text-5xl font-bold tracking-tight text-white">
                      {riskScore}
                    </span>

                    <span className="text-xs text-slate-500 mb-2">
                      /100
                    </span>

                  </div>

                  <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mt-1">
                    Risk Index
                  </span>

                </div>

              </div>

            </div>

            <div className="flex justify-between text-[8px] text-slate-600 px-1 mb-4">

              <span>0 Safe</span>

              <span>50 Warning</span>

              <span>100 Critical</span>

            </div>

            <p className="text-center text-[10px] leading-relaxed text-slate-500">
              Conditions may impact station safety,
              infrastructure and outdoor operations.
            </p>

          </div>

          {/* IMPACT */}

          <div className="bg-[#091d38] border border-blue-400/15 rounded-xl p-4">

            <h3 className="text-xs font-bold text-blue-200 mb-3">
              PREDICTED IMPACT
            </h3>

            <ImpactRow
              label="Station Safety"
              value={simulationResult?.impact?.stationSafety ?? "High Risk"}
              danger
            />

            <ImpactRow
              label="Power System"
              value={simulationResult?.impact?.powerAvailability ?? "62% Available"}
              warning
            />

            <ImpactRow
              label="Battery Backup"
              value={simulationResult?.impact?.batteryBackup ?? "-4.2 Hours"}
              warning
            />

            <ImpactRow
              label="Communication"
              value={simulationResult?.impact?.communication ?? "Unstable"}
              warning
            />

            <ImpactRow
              label="Outdoor Operations"
              value={simulationResult?.impact?.outdoorOperations ?? "Suspended"}
              danger
            />

            <ImpactRow
              label="Research Activities"
              value={simulationResult?.impact?.researchActivities ?? "Limited"}
              warning
            />

          </div>

          {/* RISK FACTORS */}

          <div className="bg-[#091d38] border border-blue-400/15 rounded-xl p-4">

            <h3 className="text-xs font-bold text-blue-200 mb-3">
              MAIN RISK FACTORS
            </h3>

            <div className="space-y-2 text-[10px] text-slate-400">

              {(simulationResult?.riskFactors ?? [
                "Wind speed exceeds safe limit",
                "Temperature dropping rapidly",
                "Communication signal unstable",
                "Battery backup may not last long",
                "High snowfall reducing visibility",
              ]).map((factor) => (
                <p key={factor}>
                  🔴 {factor}
                </p>
              ))}

            </div>

          </div>

          {/* AI RECOMMENDATIONS */}

          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-400/20 rounded-xl p-4">

            <div className="flex gap-2 items-center mb-3">

              <BrainCircuit
                size={20}
                className="text-emerald-400"
              />

              <h3 className="text-xs font-bold text-emerald-300">
                AI RECOMMENDATIONS
              </h3>

            </div>

            <div className="space-y-2 text-[10px] text-slate-400">

              {(simulationResult?.recommendations ?? [
                "Increase battery backup allocation",
                "Restrict external operations",
                "Monitor communication link continuously",
              ]).map((recommendation) => (
                <p key={recommendation}>
                  • {recommendation}
                </p>
              ))}

              <p>
                • Maintain emergency response readiness
              </p>

              <p>
                • Postpone outdoor operations
              </p>

              <p>
                • Switch to emergency communication
              </p>

              <p>
                • Activate emergency heating protocols
              </p>

            </div>

            <button className="w-full mt-4 py-2 rounded-lg bg-[#0a203b] text-xs border border-emerald-400/20 hover:bg-emerald-500/10 transition">
              View Action Plan →
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          UNIQUE FEATURES
      ===================================================== */}

      <div className="mt-5">

        <h3 className="text-center text-xs font-bold tracking-widest text-blue-200 mb-4">
          UNIQUE FEATURES THAT MAKE US STAND OUT
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">

          <FeatureCard
            icon={BrainCircuit}
            title="AI Scenario Generator"
            text="Creates realistic scenarios using historical and live data."
          />

          <FeatureCard
            icon={Activity}
            title="Impact Heatmap"
            text="Shows which station zones will be affected first."
          />

          <FeatureCard
            icon={Lightbulb}
            title="Resource Optimizer"
            text="Suggests the best allocation of station resources."
          />

          <FeatureCard
            icon={Clock}
            title="Early Warning"
            text="Predicts risks before they become critical."
          />

          <FeatureCard
            icon={Network}
            title="System Dependency"
            text="Shows cascading failures between station systems."
          />

          <FeatureCard
            icon={Download}
            title="Export Scenario"
            text="Save and share simulation results with the team."
          />

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */

function SystemRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-blue-400/5">

      <div className="flex items-center gap-2">

        <Icon
          size={12}
          className="text-cyan-400"
        />

        <span className="text-[10px] text-slate-400">
          {label}
        </span>

      </div>

      <span className="text-[10px] font-bold">
        {value}
      </span>

    </div>
  );
}


function ForecastRow({
  label,
  values,
  color,
}) {
  return (
    <>
      <div className={`${color} font-medium`}>
        {label}
      </div>

      {values.map((value, index) => (

        <div
          key={index}
          className={`text-center ${
            index >= 2
              ? "text-red-400 font-semibold"
              : "text-slate-300"
          }`}
        >
          {value}
        </div>

      ))}
    </>
  );
}


function ImpactRow({
  label,
  value,
  danger,
  warning,
}) {
  return (
    <div className="flex justify-between py-2 border-b border-blue-400/10">

      <span className="text-[10px] text-slate-400">
        {label}
      </span>

      <span
        className={`text-[10px] font-semibold ${
          danger
            ? "text-red-400"
            : warning
            ? "text-orange-400"
            : "text-emerald-400"
        }`}
      >
        {value}
      </span>

    </div>
  );
}


function FeatureCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="bg-[#091d38] border border-blue-400/15 rounded-xl p-4 flex gap-3 hover:border-blue-400/40 transition">

      <Icon
        size={23}
        className="text-blue-400 flex-shrink-0"
      />

      <div>

        <h4 className="text-[11px] font-semibold mb-1">
          {title}
        </h4>

        <p className="text-[9px] leading-relaxed text-slate-500">
          {text}
        </p>

      </div>

    </div>
  );
}