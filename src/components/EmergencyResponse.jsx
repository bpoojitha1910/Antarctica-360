import React from 'react';
import { Shield, CheckSquare, Square } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function EmergencyResponse() {
  const { data } = useDashboard();
  const emergencyChecklist = data.emergencyChecklist;
  const completedCount = emergencyChecklist.filter(item => item.checked).length;
  const totalCount = emergencyChecklist.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="glass-card p-5 animate-fade-in-up h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Shield size={16} className="text-accent" />
        <h3 className="text-sm font-bold text-navy-900">Emergency Response</h3>
      </div>

      {/* Checklist */}
      <div className="flex-1 space-y-2.5">
        {emergencyChecklist.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            {item.checked ? (
              <CheckSquare size={16} className="text-accent flex-shrink-0" />
            ) : (
              <Square size={16} className="text-navy-900/20 flex-shrink-0" />
            )}
            <span className={`text-xs font-medium ${item.checked ? 'text-navy-900/70' : 'text-navy-900/40'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mt-4 pt-3 border-t border-navy-900/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-navy-900/50 font-medium">
            {completedCount} / {totalCount} completed
          </span>
        </div>
        <div className="h-2 bg-navy-900/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full progress-animated"
            style={{
              width: `${progressPercentage}%`,
              background: 'linear-gradient(90deg, #3B82F6, #6366F1)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
