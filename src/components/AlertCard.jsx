import React, { useMemo, useState } from 'react';
import { Bell, TriangleAlert, ArrowRight } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function AlertCard() {
  const { data } = useDashboard();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const alertData = data.alertData;
  const currentWeather = data.currentWeather;
  const analytics = data.weatherAnalytics?.['24 Hours'];

  const details = useMemo(() => {
    const changes = [
      { label: 'Wind speed', value: Math.abs(currentWeather.windSpeedChange || 0) },
      { label: 'Air pressure', value: Math.abs(currentWeather.pressureChange || 0) },
      { label: 'Temperature', value: Math.abs(currentWeather.temperatureChange || 0) },
      { label: 'Humidity', value: Math.abs(currentWeather.humidityChange || 0) },
    ];
    const mainContributor = changes.sort((a, b) => b.value - a.value)[0]?.label || 'Weather';
    const risk = currentWeather.weatherRisk || 0;
    const forecastTemperature = analytics?.forecast?.temperature;

    return {
      analysis: `${mainContributor} is the main contributor to the current risk score.`,
      impact: risk >= 70
        ? 'Immediate operational impact detected. Review station safety procedures.'
        : risk >= 40
          ? 'Moderate operational impact detected. Outdoor activity may require restrictions.'
          : 'No immediate operational impact detected.',
      prediction: forecastTemperature !== undefined
        ? `Conditions are expected to remain near ${forecastTemperature}°C based on the current trend.`
        : 'Conditions are expected to remain within safe limits based on the current trend.',
      action: risk >= 70
        ? 'Restrict external operations and monitor continuously.'
        : risk >= 40
          ? 'Continue monitoring and review operational limits.'
          : 'Continue automated monitoring.',
    };
  }, [analytics, currentWeather]);

  return (
    <div className="glass-card p-5 animate-fade-in-up h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Latest Alert</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-live absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold tracking-wide">Live</span>
        </div>
      </div>

      {/* Lighter Frosty Polar Blue Alert Box */}
      <div className="bg-gradient-to-r from-sky-900/60 via-slate-800/70 to-indigo-950/60 border border-sky-400/30 rounded-xl p-3.5 mb-3 backdrop-blur-md shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-400/40 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            <TriangleAlert size={16} className="text-rose-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-sm font-bold text-white tracking-tight">{alertData.type}</span>
              <span className="text-[10px] font-mono text-cyan-200/60">{alertData.time}</span>
            </div>
            <p className="text-xs text-slate-200/80 leading-snug">{alertData.description}</p>
          </div>
        </div>
      </div>

      {/* Why this alert */}
      <div className="flex-1">
        <p className="text-xs font-semibold text-cyan-100 mb-2.5">Why this alert?</p>
        <ul className="space-y-2">
          {alertData.reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
              <span className="text-cyan-400 mt-0.5 leading-none">•</span>
              <span className="leading-relaxed">
                {reason.text}{' '}
                {reason.highlight && (
                  <span className="font-bold text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]">
                    {reason.highlight}
                  </span>
                )}{' '}
                {reason.suffix}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action button */}
      <button
        type="button"
        onClick={() => setDetailsOpen(true)}
        className="btn-gradient w-full mt-4 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/25 transition-all"
      >
        View Details
        <ArrowRight size={14} />
      </button>

      {detailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setDetailsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-details-title"
            className="w-full max-w-md rounded-2xl border border-cyan-400/30 bg-[#071d3f] p-5 text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="alert-details-title" className="text-base font-bold">Alert Details</h2>
              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="text-xl leading-none text-slate-300 hover:text-white"
                aria-label="Close alert details"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-xs leading-relaxed">
              <p><strong className="text-cyan-300">Analysis:</strong> {details.analysis}</p>
              <p><strong className="text-cyan-300">Impact:</strong> {details.impact}</p>
              <p><strong className="text-cyan-300">Prediction:</strong> {details.prediction}</p>
              <p><strong className="text-cyan-300">Action:</strong> {details.action}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}