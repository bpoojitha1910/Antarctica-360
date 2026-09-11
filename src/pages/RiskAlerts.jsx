import React, { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, Bell, CheckCircle2, ChevronRight, CircleAlert,
  CloudSun, Filter, Leaf, MoreVertical, RefreshCw, ShieldAlert, Wind, X
} from 'lucide-react';
import { useDashboard } from '../DashboardContext';

const severityStyles = {
  LOW: { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30', icon: 'text-emerald-400', line: 'border-emerald-400' },
  MEDIUM: { badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30', icon: 'text-amber-400', line: 'border-amber-400' },
  HIGH: { badge: 'bg-rose-500/20 text-rose-300 border-rose-400/30', icon: 'text-rose-400', line: 'border-rose-400' },
  CRITICAL: { badge: 'bg-red-500/20 text-red-300 border-red-400/30', icon: 'text-red-400', line: 'border-red-400' },
};

function RiskCard({ icon: Icon, label, value, status, color }) {
  return (
    <div className="glass-card-static p-4 min-w-0">
      <div className="flex items-center gap-2 text-[10px] text-slate-300">
        <Icon size={15} className={color} />
        <span>{label}</span>
      </div>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="mb-1 text-[10px] text-slate-400">/100</span>
      </div>
      <span className={`mt-2 inline-flex rounded px-2 py-0.5 text-[9px] font-bold ${status === 'HIGH RISK' ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-500/30 text-emerald-300'}`}>
        {status}
      </span>
    </div>
  );
}

export default function RiskAlerts() {
  const { data } = useDashboard();
  const [selectedAlert, setSelectedAlert] = useState(0);
  const [severityFilter, setSeverityFilter] = useState('All Severities');
  const current = data?.currentWeather || {};
  const alertData = data?.alertData || {};
  const analytics = data?.weatherAnalytics?.['24 Hours'];

  const riskCards = [
    { label: 'Overall Station Risk', value: current.weatherRisk || 20, status: current.riskLabel?.toUpperCase() || 'LOW RISK', icon: ShieldAlert, color: 'text-cyan-300' },
    { label: 'Weather Risk', value: current.weatherRisk || 72, status: (current.weatherRisk || 72) >= 50 ? 'HIGH RISK' : 'LOW RISK', icon: CloudSun, color: 'text-sky-300' },
    { label: 'Systems Risk', value: 15, status: 'NORMAL', icon: Activity, color: 'text-cyan-300' },
    { label: 'Environmental Risk', value: 18, status: 'LOW RISK', icon: Leaf, color: 'text-emerald-300' },
  ];

  const activeAlerts = useMemo(() => {
    const wind = Math.abs(current.windSpeedChange || 0);
    const temperature = Math.abs(current.temperatureChange || 0);
    return [
      { type: alertData.type || 'Low Risk Detected', description: alertData.description || 'Dynamic environmental shift calculated from AWS dataset', severity: 'LOW', icon: Leaf, time: alertData.time || '14:53 UTC', reasons: alertData.reasons || [] },
      { type: 'Wind Increased', description: `Wind speed increased by ${wind} knots in the last 3 hours.`, severity: wind > 20 ? 'HIGH' : 'MEDIUM', icon: Wind, time: alertData.time || '14:53 UTC', reasons: [{ text: 'Wind speed change', highlight: `${wind} knots`, suffix: 'in last 3 hours' }] },
      { type: 'Temperature Drop', description: `Temperature dropped ${temperature}°C in the last 6 hours.`, severity: temperature > 10 ? 'HIGH' : 'MEDIUM', icon: CircleAlert, time: alertData.time || '08:12 UTC', reasons: [{ text: 'Temperature change', highlight: `${temperature}°C`, suffix: 'in last 6 hours' }] },
    ];
  }, [alertData, current]);

  const history = [
    ['28 Aug 2026 10:41', 'High Wind', 'CRITICAL', 'Environment', '79/100', 'Acknowledged'],
    ['28 Aug 2026 06:32', 'Pressure Drop', 'MEDIUM', 'Weather', '46/100', 'Acknowledged'],
    ['27 Aug 2026 18:15', 'Communication Issue', 'HIGH', 'Communications', '62/100', 'Resolved'],
    ['26 Aug 2026 14:03', 'Power Fluctuation', 'MEDIUM', 'Power', '38/100', 'Resolved'],
    ['25 Aug 2026 02:47', 'Water Quality Alert', 'LOW', 'Water', '22/100', 'Acknowledged'],
    ['24 Aug 2026 21:12', 'Wind Increase', 'MEDIUM', 'Environment', '41/100', 'Resolved'],
  ].filter((row) => severityFilter === 'All Severities' || row[2] === severityFilter);

  const selected = activeAlerts[selectedAlert] || activeAlerts[0];
  const style = severityStyles[selected.severity];

  return (
    <div className="min-h-full overflow-x-hidden">
      <div className="mx-auto max-w-[1360px] px-4 pb-8 md:px-6">
        <div className="flex items-center justify-between pb-5 pt-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Risk &amp; Alerts</h1>
            <p className="text-xs text-slate-400">Monitor station risks, active alerts and system status</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[10px] text-emerald-300 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Live Replay</span>
            <button type="button" className="rounded-lg border border-cyan-400/20 p-2 text-slate-300 hover:text-white" onClick={() => window.location.reload()} aria-label="Refresh alerts"><RefreshCw size={14} /></button>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {riskCards.map((card) => <RiskCard key={card.label} {...card} />)}
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className="glass-card-static xl:col-span-8">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2"><Bell size={15} className="text-cyan-300" /><h2 className="text-sm font-semibold">Active Alerts</h2><span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[9px] text-rose-300">{activeAlerts.length} active</span></div>
              <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)} className="rounded border border-cyan-400/20 bg-[#08234a] px-2 py-1 text-[10px] text-slate-200 outline-none"><option>All Severities</option><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select>
            </div>
            <div className="space-y-2 p-3">
              {activeAlerts.map((alert, index) => {
                const alertStyle = severityStyles[alert.severity];
                const Icon = alert.icon;
                return <button type="button" key={alert.type} onClick={() => setSelectedAlert(index)} className={`flex w-full items-center gap-3 rounded-lg border-l-2 ${alertStyle.line} bg-[#082653]/70 p-3 text-left transition hover:bg-[#0b3268] ${selectedAlert === index ? 'ring-1 ring-cyan-400/50' : ''}`}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ${alertStyle.icon}`}><Icon size={16} /></span>
                  <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white">{alert.type}<span className={`rounded-full border px-2 py-0.5 text-[8px] ${alertStyle.badge}`}>{alert.severity}</span></span><span className="mt-1 block truncate text-[10px] text-slate-300">{alert.description}</span><span className="mt-1 block text-[9px] text-slate-500">{alert.time}</span></span>
                  <span className="hidden rounded border border-cyan-400/20 px-2 py-1 text-[9px] text-cyan-200 sm:block">View Details</span><MoreVertical size={14} className="text-slate-500" />
                </button>;
              })}
            </div>
          </section>

          <section className="glass-card-static p-4 xl:col-span-4">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">Alert Details</h2><button type="button" onClick={() => setSelectedAlert(0)} aria-label="Close alert details"><X size={14} className="text-slate-400" /></button></div>
            <div className="mb-4 flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ${style.icon}`}><AlertTriangle size={17} /></span><div><p className="text-xs font-semibold">{selected.type}</p><span className={`rounded-full border px-2 py-0.5 text-[8px] ${style.badge}`}>{selected.severity}</span></div><span className="ml-auto text-[9px] text-slate-500">{selected.time}</span></div>
            <p className="mb-3 text-[10px] font-semibold text-cyan-200">Why this alert?</p>
            <ul className="mb-5 space-y-2 text-[10px] text-slate-300">{(selected.reasons.length ? selected.reasons : [{ text: 'Current conditions remain within monitored thresholds.', highlight: '', suffix: '' }]).map((reason, index) => <li key={index} className="flex gap-2"><span className="text-cyan-400">•</span><span>{reason.text} <strong className="text-rose-300">{reason.highlight}</strong> {reason.suffix}</span></li>)}</ul>
            <p className="mb-2 text-[10px] font-semibold text-cyan-200">Recommended Actions</p>
            <ul className="space-y-1.5 text-[10px] text-slate-300"><li>• Monitor wind speed and direction</li><li>• Check external equipment status</li><li>• Update forecast in next 2 hours</li></ul>
            <div className="mt-5 flex gap-2"><button type="button" className="btn-gradient flex-1 rounded-lg py-2 text-[10px] font-semibold">Acknowledge</button><button type="button" className="flex-1 rounded-lg border border-cyan-400/20 py-2 text-[10px] text-slate-200">Full Report</button></div>
          </section>
        </div>

        <section className="glass-card-static overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3"><div className="flex items-center gap-2"><Activity size={15} className="text-cyan-300" /><h2 className="text-sm font-semibold">Alert History</h2></div><button type="button" className="text-[10px] text-cyan-300">View All <ChevronRight size={12} className="inline" /></button></div>
          <div className="flex flex-wrap gap-2 border-b border-white/10 p-3"><button type="button" className="rounded border border-cyan-400/20 bg-[#08234a] px-3 py-1.5 text-[10px] text-slate-200"><Filter size={11} className="mr-1 inline" />All Severities</button><button type="button" className="rounded border border-cyan-400/20 bg-[#08234a] px-3 py-1.5 text-[10px] text-slate-200">All Systems</button><button type="button" className="rounded border border-cyan-400/20 bg-[#08234a] px-3 py-1.5 text-[10px] text-slate-200">Select Date Range</button></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-[10px]"><thead className="text-slate-500"><tr>{['Time (UTC)', 'Alert Name', 'Severity', 'System', 'Risk', 'Status', ''].map((heading) => <th key={heading} className="px-4 py-2 font-medium">{heading}</th>)}</tr></thead><tbody>{history.map((row) => <tr key={`${row[0]}-${row[1]}`} className="border-t border-white/5 text-slate-300"><td className="px-4 py-2">{row[0]}</td><td className="px-4 py-2 text-white">{row[1]}</td><td className="px-4 py-2"><span className={`rounded-full border px-2 py-0.5 text-[8px] ${severityStyles[row[2]].badge}`}>{row[2]}</span></td><td className="px-4 py-2">{row[3]}</td><td className="px-4 py-2">{row[4]}</td><td className="px-4 py-2"><span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[8px] text-emerald-300">{row[5]}</span></td><td className="px-4 py-2 text-right text-cyan-400">›</td></tr>)}</tbody></table></div>
        </section>
      </div>
    </div>
  );
}
