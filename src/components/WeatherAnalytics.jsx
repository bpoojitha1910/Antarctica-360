import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Thermometer, Gauge, Wind, Droplets, AlertTriangle, 
  Calendar, Download, Activity, ArrowUpRight
} from 'lucide-react';
import { useDashboard } from '../DashboardContext';
import { api } from '../services_api';

export default function WeatherAnalytics() {
  const { data } = useDashboard();
  const [activeRange, setActiveRange] = useState('24 Hours');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [customAnalytics, setCustomAnalytics] = useState(null);
  const [customError, setCustomError] = useState('');
  const [exporting, setExporting] = useState(false);
  const current = data?.currentWeather || {};
  const selectedAnalytics = activeRange === 'Custom Range'
    ? customAnalytics || {}
    : data?.weatherAnalytics?.[activeRange] || {};
  const trend = selectedAnalytics.trend || data?.weatherTrendData || [];
  const weatherData = trend.map((point) => ({
    time: point.time,
    temp: point.temperature,
    avgTemp: point.temperature,
    pressure: point.pressure,
    wind: point.windSpeed,
    humidity: point.humidity,
    windDir: current.windDirection,
  }));
  const values = (key) => weatherData.map((point) => point[key]).filter(Number.isFinite);
  const average = (key) => {
    const items = values(key);
    return items.length ? (items.reduce((sum, value) => sum + value, 0) / items.length).toFixed(1) : '--';
  };
  const min = (key) => values(key).length ? Math.min(...values(key)).toFixed(1) : '--';
  const max = (key) => values(key).length ? Math.max(...values(key)).toFixed(1) : '--';
  const timelineEvents = selectedAnalytics.anomalies?.length
    ? selectedAnalytics.anomalies.slice(-6).map((event) => ({
        time: event.time,
        label: event.reason,
        color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      }))
    : data?.headerInfo ? [
        { time: data.headerInfo.time, label: 'Latest Observation', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
      ] : [];

  useEffect(() => {
    const period = data?.weatherAnalytics?.['30 Days'];
    if (period && !customStart && !customEnd) {
      setCustomStart(period.periodStart?.slice(0, 10) || '');
      setCustomEnd(period.periodEnd?.slice(0, 10) || '');
    }
  }, [data, customEnd, customStart]);

  useEffect(() => {
    if (activeRange !== 'Custom Range' || !customStart || !customEnd) return;
    if (customStart > customEnd) {
      setCustomError('Start date must be before end date.');
      return;
    }
    setCustomError('');
    api.weatherRange(customStart, customEnd)
      .then((result) => setCustomAnalytics(result.analytics))
      .catch((error) => {
        setCustomAnalytics(null);
        setCustomError(error.message);
      });
  }, [activeRange, customStart, customEnd]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await api.exportWeatherPdf(
        activeRange === 'Custom Range' ? customStart : undefined,
        activeRange === 'Custom Range' ? customEnd : undefined,
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bharati-weather-data.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-6 relative overflow-hidden font-sans">
      {/* Aurora Ambient Glow Gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-r from-emerald-500/10 via-cyan-500/15 to-purple-600/15 blur-3xl pointer-events-none" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Weather Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical weather telemetry and atmospheric insights from Bharati Research Station
          </p>
        </div>

        {/* Top Controls & Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#0d1527] border border-slate-800 rounded-lg p-1 text-xs">
            {['24 Hours', '7 Days', '30 Days', 'Custom Range'].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                  activeRange === range 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {activeRange === 'Custom Range' && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-cyan-500/20 bg-[#0d1527] p-2 text-[11px]">
              <label className="text-slate-400">
                From
                <input
                  type="date"
                  value={customStart}
                  onChange={(event) => setCustomStart(event.target.value)}
                  className="ml-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200"
                />
              </label>
              <label className="text-slate-400">
                To
                <input
                  type="date"
                  value={customEnd}
                  onChange={(event) => setCustomEnd(event.target.value)}
                  className="ml-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200"
                />
              </label>
              {customError && <span className="text-rose-400">{customError}</span>}
            </div>
          )}

          <div className="flex items-center gap-2 bg-[#0d1527] border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{data?.headerInfo?.date} {data?.headerInfo?.time}</span>
          </div>

          <button onClick={handleExport} disabled={exporting} className="flex items-center gap-1.5 bg-[#0d1527] hover:bg-slate-800 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-200 transition-all disabled:opacity-50">
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{exporting ? 'Creating PDF...' : 'Export Data'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 relative z-10">
        <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>Avg Temperature</span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{average('temp')} °C</div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
            <span>Min <span className="text-slate-200">{min('temp')}°C</span></span>
            <span className="text-slate-700">|</span>
            <span>Max <span className="text-slate-200">{max('temp')}°C</span></span>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>Avg Pressure</span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{average('pressure')} mbar</div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
            <span>Min <span className="text-slate-200">{min('pressure')}</span></span>
            <span className="text-slate-700">|</span>
            <span>Max <span className="text-slate-200">{max('pressure')}</span></span>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Wind className="w-4 h-4 text-amber-400" />
            <span>Max Wind Speed</span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{max('wind')} knots</div>
          <div className="mt-2 text-[11px] text-slate-400">
            Avg <span className="text-slate-200">{average('wind')} knots</span>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>Avg Humidity</span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{average('humidity')} %</div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
            <span>Min <span className="text-slate-200">{min('humidity')}%</span></span>
            <span className="text-slate-700">|</span>
            <span>Max <span className="text-slate-200">{max('humidity')}%</span></span>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Total Anomalies</span>
          </div>
          <div className="text-xl font-bold text-rose-400 tracking-tight">{selectedAnalytics.anomalyCount ?? 0}</div>
          <div className="mt-2 text-[11px] text-slate-400">In selected range</div>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>High Risk Periods</span>
          </div>
          <div className="text-xl font-bold text-amber-400 tracking-tight">{current.weatherRisk >= 40 ? 1 : 0}</div>
          <div className="mt-2 text-[11px] text-slate-400">
            Forecast: {selectedAnalytics.forecast?.temperature ?? '--'} °C in 3h
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 relative z-10">
        
        {/* Temperature Chart */}
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Temperature (°C)</h3>
            <span className="text-[10px] text-slate-400 font-mono">{average('temp')}°C Avg</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }} />
                <Line type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="avgTemp" stroke="#64748b" strokeWidth={1} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Air Pressure Chart */}
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Air Pressure (mbar)</h3>
            <span className="text-[10px] text-emerald-400 font-mono">Stable</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }} />
                <Line type="monotone" dataKey="pressure" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wind Speed Chart */}
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Wind Speed (knots)</h3>
            <span className="text-[10px] text-amber-400 font-mono">{max('wind')} Peak</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }} />
                <Area type="monotone" dataKey="wind" stroke="#fb923c" fill="#fb923c" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Relative Humidity Chart */}
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Relative Humidity (%)</h3>
            <span className="text-[10px] text-purple-400 font-mono">{current.humidity ?? '--'}% Current</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }} />
                <Line type="monotone" dataKey="humidity" stroke="#a78bfa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wind Direction Chart */}
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Wind Direction (Deg)</h3>
            <span className="text-[10px] text-blue-400 font-mono">{current.windDirection ?? '--'}° {current.windDirectionLabel || ''}</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[0, 360]} stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }} />
                <Line type="step" dataKey="windDir" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather Status Overview Widget */}
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Condition Summary
          </h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center bg-[#070b14]/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Temperature</span>
              <span className="text-white font-semibold">{current.temperature ?? '--'} °C</span>
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px]">Cold</span>
            </div>
            <div className="flex justify-between items-center bg-[#070b14]/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Air Pressure</span>
              <span className="text-white font-semibold">{current.airPressure ?? '--'} mbar</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">Normal</span>
            </div>
            <div className="flex justify-between items-center bg-[#070b14]/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Wind Speed</span>
              <span className="text-white font-semibold">{current.windSpeed ?? '--'} knots</span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px]">Moderate</span>
            </div>
          </div>

          <div className="mt-3 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-lg flex items-center justify-between text-xs">
            <div>
              <div className={`font-bold uppercase tracking-wider text-[11px] ${current.weatherRisk >= 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {current.riskLabel || 'Risk status'}
              </div>
                <div className="text-slate-400 text-[10px]">
                  Based on {selectedAnalytics.count ?? 0} real observations
                </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2.5 text-[10px] text-slate-300">
            <span className="text-cyan-300 font-semibold">3-hour forecast:</span>{' '}
            {selectedAnalytics.forecast?.temperature ?? '--'} °C,{' '}
            {selectedAnalytics.forecast?.windSpeed ?? '--'} knots wind,{' '}
            {selectedAnalytics.forecast?.humidity ?? '--'}% humidity
          </div>
        </div>

      </div>

      {/* Events Timeline Section */}
      <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-4 relative z-10">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
          Weather Events Timeline
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className={`p-2.5 rounded-lg border ${evt.color} backdrop-blur-sm text-center transition-all hover:scale-[1.02]`}>
              <div className="font-semibold text-xs">{evt.label}</div>
              <div className="text-[10px] opacity-75 mt-0.5">{evt.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}