import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, Download, FileText, ShieldAlert, Wind, Zap } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

const incidents = [
  ['INC-001', 'Severe Blizzard', 'HIGH', 'IN PROGRESS', 'Outdoor Operations'],
  ['INC-002', 'Equipment Failure', 'MEDIUM', 'OPEN', 'Power'],
  ['INC-003', 'Medical Emergency', 'HIGH', 'RESOLVED', 'Personnel'],
  ['INC-004', 'Communication Loss', 'MEDIUM', 'IN PROGRESS', 'Communication'],
];

export default function RiskManagement() {
  const { data } = useDashboard();
  const [selected, setSelected] = useState(0);
  const [checked, setChecked] = useState([]);
  const current = data?.currentWeather || {};
  const checklist = data?.emergencyChecklist || [];
  const risk = current.weatherRisk || 0;
  const selectedIncident = incidents[selected];
  const alertReasons = data?.alertData?.reasons || [];

  const activeRisks = useMemo(() => [
    { title: 'High Weather Risk', time: data?.headerInfo?.time || '10:41 UTC', detail: 'Wind increasing rapidly', affected: 'Outdoor Operations', icon: Wind, color: 'rose' },
    { title: 'Power System Watch', time: '10:35 UTC', detail: 'High load detected', affected: 'Power / Heating', icon: Zap, color: 'amber' },
    { title: 'Communication Stable', time: '09:50 UTC', detail: 'No action required', affected: 'Communication', icon: CheckCircle2, color: 'emerald' },
  ], [data?.headerInfo?.time]);

  return <div className="min-h-full overflow-x-hidden"><div className="mx-auto max-w-[1360px] px-4 pb-8 md:px-6">
    <header className="flex flex-wrap items-center justify-between gap-4 py-5"><div><h1 className="text-2xl font-bold text-white">Risk Management</h1><p className="text-xs text-slate-400">Respond to active risks, coordinate emergencies and manage incidents</p></div><button type="button" className="btn-gradient flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-semibold"><Download size={13} />Export Report</button></header>
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <section className="glass-card-static p-4 xl:col-span-7"><h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><ShieldAlert size={16} className="text-rose-300" />Active Risks</h2><div className="space-y-2">{activeRisks.map(({ title, time, detail, affected, icon: Icon, color }) => <div key={title} className="flex items-center gap-3 rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><Icon size={18} className={`text-${color}-300`} /><div className="flex-1"><strong className="block text-xs">{title}</strong><span className="text-[9px] text-slate-400">{time} · {detail}</span><span className="mt-1 block text-[9px] text-slate-500">Affected: {affected}</span></div><span className={`rounded-full bg-${color}-500/20 px-2 py-1 text-[8px] text-${color}-300`}>{color === 'rose' ? 'HIGH' : color === 'amber' ? 'WATCH' : 'NORMAL'}</span></div>)}</div></section>
      <section className="glass-card-static p-4 xl:col-span-5"><h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><AlertTriangle size={16} className="text-rose-300" />Alert Details</h2><div className="mb-3 flex items-center justify-between"><div><strong className="block text-sm">HIGH WEATHER RISK</strong><span className="text-[9px] text-slate-400">Severity: HIGH · Detected: {data?.headerInfo?.time || '10:41 UTC'}</span></div><span className="text-2xl font-bold text-rose-300">{risk}<small className="text-[10px] text-slate-400">/100</small></span></div><p className="mb-2 text-[10px] font-semibold text-cyan-200">Trigger: <span className="font-normal text-slate-300">Rapid environmental deterioration</span></p><ul className="space-y-1 text-[9px] text-slate-300">{alertReasons.slice(0, 4).map((reason) => <li key={reason.text}>• {reason.text}: <strong className="text-rose-300">{reason.highlight}</strong> {reason.suffix}</li>)}</ul><p className="mt-4 text-[10px] font-semibold text-cyan-200">Recommended Action</p><p className="mt-1 text-[9px] text-slate-300">Restrict outdoor activity · Monitor heating demand · Verify personnel status</p></section>
      <section className="glass-card-static p-4 xl:col-span-5"><h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><ClipboardList size={16} className="text-cyan-300" />Emergency Checklist</h2><div className="space-y-2">{checklist.map((item, index) => { const isChecked = checked.includes(index) || item.checked; return <button type="button" key={item.label} onClick={() => setChecked((items) => isChecked ? items.filter((value) => value !== index) : [...items, index])} className="flex w-full items-center gap-2 text-left text-[10px] text-slate-300">{isChecked ? <CheckCircle2 size={14} className="text-emerald-400" /> : <span className="h-3.5 w-3.5 rounded-full border border-slate-500" />}{item.label}</button>; })}</div></section>
      <section className="glass-card-static overflow-hidden p-4 xl:col-span-7"><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-semibold"><FileText size={16} className="text-cyan-300" />Incident Management</h2><button type="button" className="rounded-lg border border-cyan-400/20 px-3 py-1.5 text-[9px] text-cyan-300">+ New Incident</button></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-[9px]"><thead className="text-slate-500"><tr><th className="p-2">ID</th><th className="p-2">Incident</th><th className="p-2">Severity</th><th className="p-2">Status</th><th className="p-2">Affected System</th></tr></thead><tbody>{incidents.map((incident, index) => <tr key={incident[0]} onClick={() => setSelected(index)} className={`cursor-pointer border-t border-white/5 text-slate-300 ${selected === index ? 'bg-cyan-500/10' : ''}`}><td className="p-2">{incident[0]}</td><td className="p-2 text-white">{incident[1]}</td><td className="p-2"><span className="rounded-full bg-rose-500/20 px-2 py-1 text-rose-300">{incident[2]}</span></td><td className="p-2">{incident[3]}</td><td className="p-2">{incident[4]}</td></tr>)}</tbody></table></div><p className="mt-3 text-[9px] text-slate-400">Selected: {selectedIncident[0]} · {selectedIncident[1]} · updates and response plan available.</p></section>
    </div>
  </div></div>;
}
