import React from 'react';
import Header from '../components/Header';
import MetricCard, { WindDirectionCard } from '../components/MetricCard';
import RiskGauge from '../components/RiskGauge';
import WeatherChart from '../components/WeatherChart';
import { useDashboard } from '../DashboardContext';

export default function CommandCenter({ onOpenRiskManagement }) {
  const { data } = useDashboard();
  const weather = data?.currentWeather || {};
  const trend = data?.weatherTrendData || [];
  const spark = (key) => trend.map((point) => point[key]);
  const systems = [
    ['Power', 'NORMAL', 'text-emerald-300'], ['Heating', weather.weatherRisk >= 50 ? 'WATCH' : 'NORMAL', 'text-amber-300'],
    ['Water', 'NORMAL', 'text-emerald-300'], ['Fuel', 'NORMAL', 'text-emerald-300'], ['Communication', 'DEGRADED', 'text-amber-300'],
    ['Outdoor Ops', weather.weatherRisk >= 50 ? 'RESTRICTED' : 'NORMAL', 'text-rose-300'],
  ];
  const buildings = data?.digitalTwinData?.buildings || [];

  return <div className="flex-1 overflow-x-hidden overflow-y-auto"><div className="mx-auto max-w-[1360px] px-4 pb-8 md:px-6"><Header />
    <div className="stagger-children mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <MetricCard type="temperature" label="Temperature" value={weather.temperature} unit="°C" change={weather.temperatureChange} changePeriod={weather.temperatureChangePeriod} sparkData={spark('temperature')} sparkColor="#3B82F6" />
      <MetricCard type="pressure" label="Air Pressure" value={weather.airPressure} unit="mbar" change={weather.pressureChange} changePeriod={weather.pressureChangePeriod} sparkData={spark('pressure')} sparkColor="#3B82F6" />
      <MetricCard type="wind" label="Wind Speed" value={weather.windSpeed} unit="knots" change={weather.windSpeedChange} changePeriod={weather.windSpeedChangePeriod} sparkData={spark('windSpeed')} sparkColor="#F97316" />
      <MetricCard type="humidity" label="Humidity" value={weather.humidity} unit="%" change={weather.humidityChange} changePeriod={weather.humidityChangePeriod} sparkData={spark('humidity')} sparkColor="#8B5CF6" />
      <WindDirectionCard degrees={weather.windDirection} label={weather.windDirectionLabel} />
      <RiskGauge value={weather.weatherRisk} label={weather.riskLabel} />
    </div>
    <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
      <div className="lg:col-span-5"><WeatherChart /></div>
      <section className="glass-card-static p-4 lg:col-span-3"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold">Latest Alert</h2><span className="text-[10px] text-rose-300">LIVE</span></div><strong className="block text-xs text-rose-200">{data?.alertData?.type || 'Weather risk detected'}</strong><p className="mt-2 text-[10px] text-slate-400">{data?.alertData?.description || 'Environmental conditions require monitoring.'}</p><p className="mt-3 text-[10px] text-slate-300">Wind {weather.windSpeedChange >= 0 ? '+' : ''}{weather.windSpeedChange || 0} knots · affected: Outdoor Operations</p><button type="button" onClick={onOpenRiskManagement} className="mt-4 w-full rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-[10px] font-semibold text-cyan-200">View Details →</button></section>
      <section className="glass-card-static p-4 lg:col-span-2"><h2 className="mb-3 text-sm font-bold">Digital Twin</h2><div className="space-y-2">{buildings.slice(0, 3).map((building) => <div key={building.name} className="rounded-lg border border-cyan-400/15 bg-[#082653] p-2"><span className="block text-[9px] text-slate-300">{building.name}</span><strong className={building.status === 'Watch' ? 'text-[9px] text-amber-300' : 'text-[9px] text-emerald-300'}>{building.status}</strong></div>)}</div><p className="mt-3 text-[9px] text-cyan-200">Infrastructure preview</p></section>
      <section className="glass-card-static p-4 lg:col-span-2"><h2 className="mb-3 text-sm font-bold">What-If</h2><p className="text-[10px] text-slate-400">Severe Blizzard · 12 hours</p><strong className="mt-3 block text-lg text-amber-300">Predicted {Math.max(0, weather.weatherRisk || 0)}/100</strong><p className="mt-2 text-[9px] text-slate-300">Projected impact: power load, battery and outdoor operations.</p><p className="mt-3 text-[9px] text-cyan-200">Simulation preview</p></section>
    </div>
    <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7"><div className="glass-card-static p-3"><span className="block text-[10px] text-slate-400">Station Status</span><strong className="mt-2 block text-xs text-emerald-300">OPERATIONAL</strong></div>{systems.map(([label, status, color]) => <div key={label} className="glass-card-static p-3"><span className="block text-[10px] text-slate-400">{label}</span><strong className={`mt-2 block text-xs ${color}`}>{status}</strong></div>)}</div>
    <div className="glass-card-static mb-6 flex flex-wrap items-center gap-3 p-3 text-[10px]"><strong className="text-cyan-200">Critical actions</strong><span className="text-slate-300">• Verify personnel status</span><span className="text-slate-300">• Monitor heating demand</span><span className="text-slate-300">• Restrict outdoor operations when risk is high</span></div>
  </div></div>;
}
