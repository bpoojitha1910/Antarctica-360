import React from 'react';
import { Sparkles, FilePlus, FileBarChart, RefreshCw, Wifi } from 'lucide-react';

const actions = [
  { icon: FilePlus, label: 'New Incident' },
  { icon: FileBarChart, label: 'Generate Report' },
  { icon: RefreshCw, label: 'Shift Handover' },
  { icon: Wifi, label: 'Low Bandwidth' },
];

export default function QuickActions() {
  return (
    <div className="glass-card p-5 animate-fade-in-up h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-accent" />
        <h3 className="text-sm font-bold text-navy-900">Quick Actions</h3>
      </div>

      {/* Action buttons grid */}
      <div className="flex-1 grid grid-cols-2 gap-2.5">
        {actions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            id={`action-${label.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#0b294d]/80 border border-cyan-400/20 
              hover:bg-cyan-500/15 hover:border-cyan-300/50 hover:shadow-[0_0_18px_rgba(34,211,238,0.15)] transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100/95 border border-cyan-200/30 flex items-center justify-center 
              group-hover:bg-cyan-100 group-hover:border-cyan-300 transition-all shadow-sm">
              <Icon size={16} className="text-navy-700 group-hover:text-cyan-700 transition-colors" />
            </div>
            <span className="text-[10px] font-semibold text-cyan-100/80 group-hover:text-white text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
