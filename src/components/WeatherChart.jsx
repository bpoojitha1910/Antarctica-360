import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot
} from 'recharts';
import { Sparkles } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

const periods = ['24H', '7D', '30D'];

const lineConfig = [
  { key: 'temperature', label: 'Temperature', color: '#3B82F6', unit: '°C' },
  { key: 'windSpeed', label: 'Wind Speed', color: '#F97316', unit: ' knots' },
  { key: 'pressure', label: 'Pressure', color: '#22C55E', unit: ' mbar' },
  { key: 'humidity', label: 'Humidity', color: '#8B5CF6', unit: '%' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip bg-white rounded-xl px-3 py-2 shadow-lg border border-navy-900/5">
      <p className="text-xs font-semibold text-navy-900 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[11px]">
          <span className="w-2 h-2 rounded-full" style={{ background: p.stroke }} />
          <span className="text-navy-900/60">{lineConfig.find(l => l.key === p.dataKey)?.label}:</span>
          <span className="font-semibold text-navy-900">{p.value}{lineConfig.find(l => l.key === p.dataKey)?.unit}</span>
        </div>
      ))}
    </div>
  );
}

export default function WeatherChart() {
  const { data } = useDashboard();
  const weatherTrendData = data.weatherTrendData;
  const [activePeriod, setActivePeriod] = useState('24H');

  // Find anomaly point index (around 06:00 which has extreme values)
  const anomalyIndex = weatherTrendData.findIndex(d => d.time === '04:00');

  return (
    <div className="glass-card p-5 animate-fade-in-up h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <h3 className="text-sm font-bold text-navy-900">Weather Trends</h3>
          <span className="text-[11px] text-navy-900/40 font-medium">(Last 24 Hours)</span>
        </div>
        <div className="flex bg-navy-900/5 rounded-full p-0.5">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                activePeriod === p
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-navy-900/50 hover:text-navy-900/70'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weatherTrendData} margin={{ top: 20, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              interval={2}
            />
            <YAxis
              yAxisId="weather"
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="pressure"
              orientation="right"
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              width={38}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {lineConfig.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                yAxisId={line.key === 'pressure' ? 'pressure' : 'weather'}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              />
            ))}

            {/* Anomaly marker */}
            {anomalyIndex >= 0 && (
              <ReferenceDot
                x={weatherTrendData[anomalyIndex].time}
                y={weatherTrendData[anomalyIndex].temperature}
                r={0}
                label={{
                  value: '● Anomaly detected',
                  position: 'top',
                  fill: '#EF4444',
                  fontSize: 10,
                  fontWeight: 600,
                  offset: 12,
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-navy-900/5 flex-wrap">
        {lineConfig.map((line) => (
          <div key={line.key} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: line.color }} />
            <span className="text-[11px] text-navy-900/60 font-medium">{line.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
