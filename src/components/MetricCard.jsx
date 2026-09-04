import React from 'react';
import { Thermometer, Gauge, Wind, Droplets, Compass, ArrowDown, ArrowUp } from 'lucide-react';

const iconMap = {
  temperature: Thermometer,
  pressure: Gauge,
  wind: Wind,
  humidity: Droplets,
  direction: Compass,
};

// Simple sparkline component
function Sparkline({ data, color = '#3B82F6', height = 32, width = '100%' }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = height;
  const w = 100;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `M0,${h} L${data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' L')} L${w},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sparkline-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sparkline-grad-${color.replace('#', '')})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MetricCard({ type, label, value, unit, change, changePeriod, sparkData, sparkColor }) {
  const Icon = iconMap[type];
  const isNegativeChange = change < 0;
  const ChangeIcon = isNegativeChange ? ArrowDown : ArrowUp;
  const changeColor = type === 'wind' || type === 'humidity' ? 'text-orange-500' : 'text-blue-500';

  return (
    <div className="glass-card p-4 flex flex-col justify-between animate-fade-in-up min-h-[140px]">
      <div className="flex items-center gap-2 mb-2">
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-icy-100 flex items-center justify-center">
            <Icon size={14} className="text-navy-700" />
          </div>
        )}
        <span className="text-navy-900/60 text-xs font-medium">{label}</span>
      </div>

      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold text-navy-900">{value}</span>
        {unit && <span className="text-sm text-navy-900/50 font-medium">{unit}</span>}
      </div>

      {sparkData && (
        <div className="mb-2 -mx-1">
          <Sparkline data={sparkData} color={sparkColor || '#3B82F6'} height={28} />
        </div>
      )}

      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${changeColor}`}>
          <ChangeIcon size={12} />
          <span>{Math.abs(change)}{type === 'humidity' ? '%' : type === 'pressure' ? ' mbar' : type === 'wind' ? ' knots' : '°C'} ({changePeriod})</span>
        </div>
      )}
    </div>
  );
}

// Wind Direction Card
export function WindDirectionCard({ degrees, label }) {
  return (
    <div className="glass-card p-4 flex flex-col justify-between animate-fade-in-up min-h-[140px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-icy-100 flex items-center justify-center">
          <Compass size={14} className="text-navy-700" />
        </div>
        <span className="text-navy-900/60 text-xs font-medium">Wind Direction</span>
      </div>

      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-bold text-navy-900">{degrees}</span>
            <span className="text-sm text-navy-900/50 font-medium">°</span>
          </div>
          <span className="text-sm font-semibold text-navy-900/70">{label}</span>
        </div>
        
        {/* Compass visual */}
        <div className="relative w-14 h-14 ml-auto">
          <svg viewBox="0 0 60 60" className="w-full h-full">
            <circle cx="30" cy="30" r="26" fill="none" stroke="#E2E8F0" strokeWidth="1.5"/>
            <circle cx="30" cy="30" r="22" fill="none" stroke="#E2E8F0" strokeWidth="0.5"/>
            {/* Cardinal markers */}
            <text x="30" y="10" textAnchor="middle" fontSize="6" fill="#94A3B8" fontWeight="600">N</text>
            <text x="52" y="33" textAnchor="middle" fontSize="6" fill="#94A3B8" fontWeight="600">E</text>
            <text x="30" y="56" textAnchor="middle" fontSize="6" fill="#94A3B8" fontWeight="600">S</text>
            <text x="8" y="33" textAnchor="middle" fontSize="6" fill="#94A3B8" fontWeight="600">W</text>
            {/* Direction arrow */}
            <g transform={`rotate(${degrees}, 30, 30)`}>
              <line x1="30" y1="30" x2="30" y2="12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              <polygon points="30,10 27,17 33,17" fill="#3B82F6"/>
              <circle cx="30" cy="30" r="3" fill="#3B82F6"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
