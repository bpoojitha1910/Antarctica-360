import React from 'react';
import { useDashboardData } from './useDashboardData';

export default function DashboardTest() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return <div className="p-4 text-cyan-400">Loading Antarctica 360 data...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-500 text-red-200 rounded">
        <strong>Connection Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 text-white rounded-lg border border-slate-700 max-w-md">
      <h2 className="text-xl font-bold text-cyan-400">
        {data?.headerInfo?.title}
      </h2>
      <p className="text-xs text-slate-400 mb-4">{data?.headerInfo?.subtitle}</p>

      <div className="space-y-2">
        <div className="p-3 bg-slate-800 rounded flex justify-between">
          <span className="text-slate-400">Station:</span>
          <span className="font-semibold">{data?.stationInfo?.name}</span>
        </div>
        <div className="p-3 bg-slate-800 rounded flex justify-between">
          <span className="text-slate-400">Temperature:</span>
          <span className="font-semibold text-blue-400">
            {data?.currentWeather?.temperature}°C
          </span>
        </div>
        <div className="p-3 bg-slate-800 rounded flex justify-between">
          <span className="text-slate-400">Risk Level:</span>
          <span className="font-semibold text-amber-400">
            {data?.currentWeather?.riskLabel}
          </span>
        </div>
      </div>
    </div>
  );
}