import React from 'react';
import { Diamond } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

const statusColors = {
  Normal: { bg: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-cyan-400/20', bgFill: 'bg-[#082b4a]' },
  Watch: { bg: 'bg-amber-400', text: 'text-amber-400', border: 'border-amber-400/40', bgFill: 'bg-[#172a43]' },
  Critical: { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-400/40', bgFill: 'bg-[#241d35]' },
};

export default function DigitalTwinCard() {
  const { data } = useDashboard();
  const digitalTwinData = data.digitalTwinData;

  return (
    <div className="glass-card p-3 animate-fade-in-up h-full flex flex-col shadow-[0_0_24px_rgba(14,165,233,0.42),0_0_7px_rgba(56,189,248,0.32),inset_0_0_18px_rgba(14,165,233,0.14)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Diamond size={14} className="text-accent" />
          <h3 className="text-sm font-bold text-white">Digital Twin</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-live absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[#061326] rounded-xl p-2.5 min-h-[150px] border border-cyan-400/35 shadow-[inset_0_0_24px_rgba(14,165,233,0.2),0_0_14px_rgba(14,165,233,0.14)]">
        <svg className="absolute bottom-0 left-0 w-full h-8 opacity-70" viewBox="0 0 200 30" preserveAspectRatio="none">
          <path d="M0 22 Q30 10 62 20 Q98 5 126 18 Q164 8 200 17 L200 30 L0 30 Z" fill="#0b3c5b" />
        </svg>

        <div className="relative w-full h-full grid grid-cols-2 gap-2 min-h-[120px]">
          {digitalTwinData.buildings.map((building) => {
            const colors = statusColors[building.status];
            return (
              <div
                key={building.name}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl border ${colors.border} ${colors.bgFill} shadow-[inset_0_0_14px_rgba(14,165,233,0.14),0_0_8px_rgba(14,165,233,0.1)] transition-all hover:bg-[#10415f]`}
              >
                <div className="mb-1">
                  <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                    <rect x="4" y="6" width="16" height="14" rx="1.5" fill={building.status === 'Watch' ? '#7c5515' : '#0b5275'} stroke={building.status === 'Watch' ? '#f59e0b' : '#38bdf8'} strokeWidth="0.8" />
                    <rect x="8" y="2" width="8" height="6" rx="1" fill={building.status === 'Watch' ? '#9a6a19' : '#126487'} stroke={building.status === 'Watch' ? '#f59e0b' : '#38bdf8'} strokeWidth="0.8" />
                    <rect x="10" y="10" width="4" height="5" rx="0.5" fill={building.status === 'Watch' ? '#fbbf24' : '#7dd3fc'} opacity="0.75" />
                  </svg>
                </div>
                <span className="text-[9px] font-semibold text-slate-100 text-center leading-tight">{building.name}</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} />
                  <span className={`text-[8px] font-medium ${colors.text}`}>{building.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
