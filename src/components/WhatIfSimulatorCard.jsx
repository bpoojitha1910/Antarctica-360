import React, { useState } from 'react';
import { Rocket, Play, Thermometer, Wind, Gauge, Droplets } from 'lucide-react';
import { useDashboard } from '../DashboardContext';
import { api } from '../services_api';

export default function WhatIfSimulatorCard() {
  const { data } = useDashboard();
  const whatIfDefaults = data.whatIfDefaults;
  const [values, setValues] = useState(whatIfDefaults);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const sliders = [
    { icon: Thermometer, label: 'Temperature', key: 'temperature', unit: '°C', min: -50, max: 20, color: '#3B82F6' },
    { icon: Wind, label: 'Wind Speed', key: 'windSpeed', unit: 'knots', min: 0, max: 100, color: '#3B82F6' },
    { icon: Gauge, label: 'Air Pressure', key: 'airPressure', unit: 'mbar', min: 940, max: 1040, color: '#3B82F6' },
    { icon: Droplets, label: 'Humidity', key: 'humidity', unit: '%', min: 0, max: 100, color: '#3B82F6' },
  ];

  return (
    <div className="glass-card p-5 animate-fade-in-up h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Rocket size={16} className="text-accent" />
        <h3 className="text-sm font-bold text-navy-900">What-If Simulator</h3>
      </div>

      <div className="flex-1 space-y-3.5">
        {sliders.map(({ icon: Icon, label, key, unit, min, max, color }) => {
          const value = values[key];
          const percentage = ((value - min) / (max - min)) * 100;
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-navy-900/60 font-medium">{label}</span>
                <span className="text-xs font-bold text-navy-900">{value} {unit}</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step="0.1"
                value={value}
                onChange={(event) => {
                  setValues((previous) => ({ ...previous, [key]: Number(event.target.value) }));
                  setResult(null);
                }}
                className="w-full accent-blue-500"
                aria-label={label}
              />
              <div className="relative h-2 bg-navy-900/5 rounded-full pointer-events-none -mt-2">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all"
                  style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${color}, #6366F1)` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 rounded-full shadow-sm"
                  style={{ left: `calc(${percentage}% - 7px)`, borderColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        disabled={running}
        onClick={async () => {
          setRunning(true);
          try {
            setResult(await api.simulate({ scenario: 'Custom Weather Conditions', ...values, duration: '3 Hours' }));
          } finally {
            setRunning(false);
          }
        }}
        className="btn-gradient w-full mt-4 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Play size={13} fill="white" />
        {running ? 'Calculating...' : 'Run Simulation'}
      </button>
      {result && (
        <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2 text-[10px] text-navy-900/70">
          <strong>{result.riskStatus} ({result.riskScore}/100)</strong>
          <p className="mt-1">{result.recommendations[0]}</p>
          <p>{result.impact.outdoorOperations} outdoor operations · {result.impact.communication} communications</p>
        </div>
      )}
      <p className="text-[10px] text-navy-900/30 mt-2 text-center italic">Simulation / Modelled</p>
    </div>
  );
}
