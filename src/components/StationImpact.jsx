import React from 'react';
import { Flame, Zap, Droplets, Wind, Activity } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function StationImpact() {
  const { data } = useDashboard();
  const stationImpact = data.stationImpact;
  const impactItems = [
    { icon: Flame, label: 'Heating Demand', value: stationImpact.heatingDemand, type: 'percent', color: '#EF4444' },
    { icon: Zap, label: 'Power Demand', value: stationImpact.powerDemand, type: 'percent', color: '#F97316' },
    { icon: Droplets, label: 'Fuel Consumption', value: stationImpact.fuelConsumption, type: 'change', color: '#3B82F6' },
    { icon: Wind, label: 'Outdoor Ops.', value: stationImpact.outdoorOps, type: 'status', color: '#EF4444' },
  ];

  return (
    <div className="glass-card p-5 animate-fade-in-up h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-navy-900" />
        <h3 className="text-sm font-bold text-navy-900">Station Impact</h3>
        <span className="text-[11px] text-navy-900/40 font-medium">(Modelled)</span>
      </div>

      {/* Impact items */}
      <div className="flex-1 space-y-3.5">
        {impactItems.map(({ icon: Icon, label, value, type, color }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-icy-50 flex items-center justify-center flex-shrink-0">
              <Icon size={13} style={{ color }} />
            </div>
            <span className="text-xs text-navy-900/70 font-medium w-[110px] flex-shrink-0">{label}</span>
            
            {type === 'percent' ? (
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-2 bg-navy-900/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-animated"
                    style={{ width: `${value}%`, background: color }}
                  />
                </div>
                <span className="text-xs font-bold text-navy-900 w-8 text-right">{value}%</span>
              </div>
            ) : type === 'change' ? (
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-2 bg-navy-900/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-animated"
                    style={{ width: `${50 + value * 1.5}%`, background: color }}
                  />
                </div>
                <span className="text-xs font-bold text-navy-900 w-8 text-right">+{value}%</span>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-2 bg-navy-900/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-animated"
                    style={{ width: '90%', background: color }}
                  />
                </div>
                <span className="text-xs font-bold text-red-500 w-14 text-right">{value}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer text */}
      <p className="text-[10px] text-navy-900/30 mt-4 italic">
        Impact is modelled from current weather conditions.
      </p>
    </div>
  );
}
