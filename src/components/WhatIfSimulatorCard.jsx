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
  const [error, setError] = useState('');
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
                  setError('');
                }}
                className="what-if-slider w-full"
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
          setError('');
          try {
            setResult(await api.simulate({ scenario: 'Custom Weather Conditions', ...values, duration: '3 Hours' }));
          } catch (simulationError) {
            setError(simulationError.message);
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
        <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2.5 text-[10px] text-navy-900/70">
          <strong className="text-navy-900">Predicted outcome: {result.riskStatus} ({result.riskScore}/100)</strong>
          <p className="mt-1 text-navy-900/60">
            For {values.temperature}°C, {values.windSpeed} knots, {values.airPressure} mbar, and {values.humidity}% humidity:
          </p>
          <p className="mt-1 font-semibold">Possible outcomes</p>
          <ul className="mt-1 space-y-0.5">
            <li>• Station safety: {result.impact.stationSafety}</li>
            <li>• Power: {result.impact.powerAvailability}</li>
            <li>• Outdoor operations: {result.impact.outdoorOperations}</li>
            <li>• Communications: {result.impact.communication}</li>
            <li>• Research: {result.impact.researchActivities}</li>
          </ul>
          <p className="mt-1 font-semibold">Recommended action</p>
          <p>• {result.recommendations.join(' • ')}</p>
          <p className="mt-1 text-navy-900/50">Factors: {result.riskFactors.join(' • ')}</p>
        </div>
      )}
      {error && <p className="mt-2 text-[10px] text-rose-500">{error}</p>}
      <p className="text-[10px] text-navy-900/30 mt-2 text-center italic">Simulation / Modelled</p>
    </div>
  );
}
