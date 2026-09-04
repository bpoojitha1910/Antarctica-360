import React, { useState, useEffect } from 'react';

export default function RiskGauge({ value = 72, maxValue = 100, label = 'High Risk' }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(value), 200);
    return () => clearTimeout(timer);
  }, [value]);

  // Semicircle geometry (180 degrees from 180 to 0)
  // Radius: 45, Circumference of semicircle: Math.PI * 45 ≈ 141.37
  const radius = 45;
  const arcLength = Math.PI * radius;
  const percentage = Math.min(Math.max((animated / maxValue), 0), 1);
  const strokeDashoffset = arcLength * (1 - percentage);

  const getColor = (val) => {
    if (val <= 30) return '#22C55E';
    if (val <= 50) return '#EAB308';
    if (val <= 70) return '#F97316';
    return '#EF4444';
  };

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between items-center animate-fade-in-up h-full w-full min-h-[160px]">
      {/* Card Header */}
      <div className="w-full flex items-center justify-between">
        <span className="text-white text-xs font-bold tracking-wide">Weather Risk</span>
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse-live" />
      </div>

      {/* Perfectly Centered Gauge */}
      <div className="relative w-[130px] h-[78px] flex items-center justify-center my-auto">
        <svg viewBox="0 0 130 75" className="w-full h-full overflow-visible">
          {/* Background Track */}
          <path
            d="M 20 65 A 45 45 0 0 1 110 65"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Color Gradient Definition */}
          <defs>
            <linearGradient id="risk-semicircle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="35%" stopColor="#EAB308" />
              <stop offset="70%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Active Progress Arc */}
          <path
            d="M 20 65 A 45 45 0 0 1 110 65"
            fill="none"
            stroke="url(#risk-semicircle-grad)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Numbers: Exactly Centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
          <div className="flex items-baseline justify-center leading-none">
            <span className="text-2xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {animated}
            </span>
            <span className="text-[11px] font-semibold text-cyan-200/70 ml-0.5">/100</span>
          </div>
        </div>
      </div>

      {/* Risk Badge */}
      <div className="w-full flex justify-center mt-1">
        <span
          className="inline-flex px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border border-current shadow-sm"
          style={{
            backgroundColor: `${getColor(animated)}20`,
            color: getColor(animated),
            borderColor: `${getColor(animated)}50`
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}