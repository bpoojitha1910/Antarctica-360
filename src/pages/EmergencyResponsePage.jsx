import React, { useMemo, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, ChevronRight, CloudSnow, Droplets, Flame, Globe2, HeartPulse,
  MapPin, Phone, Radio, Shield, Snowflake, Thermometer, UserRound, Wind, Zap
} from 'lucide-react';
import { useDashboard } from '../DashboardContext';

const systemRows = [
  ['Power Generation', 'NORMAL', 'text-emerald-300', Zap],
  ['Heating System', 'WARNING', 'text-amber-300', Flame],
  ['Water Recycling', 'NORMAL', 'text-emerald-300', Globe2],
  ['Fuel Storage', 'NORMAL', 'text-emerald-300', Shield],
  ['Communication', 'DEGRADED', 'text-amber-300', Radio],
  ['Transport', 'SUSPENDED', 'text-rose-300', Snowflake],
];

function StatusPill({ children, tone = 'green' }) {
  return <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${tone === 'red' ? 'bg-rose-500/25 text-rose-300' : tone === 'amber' ? 'bg-amber-500/25 text-amber-300' : 'bg-emerald-500/25 text-emerald-300'}`}>{children}</span>;
}

export default function EmergencyResponsePage() {
  const { data } = useDashboard();
  const current = data?.currentWeather || {};
  const station = data?.stationInfo || {};
  const [scenario, setScenario] = useState('Power Failure');
  const [completed, setCompleted] = useState(() => (data?.emergencyChecklist || []).map((item) => item.checked));
  const checklist = data?.emergencyChecklist || [];
  const completedCount = completed.filter(Boolean).length;

  const incident = useMemo(() => ({
    title: current.weatherRisk >= 70 ? 'Severe Blizzard' : 'Weather Alert',
    description: current.weatherRisk >= 70 ? 'Extreme wind speeds and reduced visibility in the region. Station operations at risk.' : 'Weather conditions are being monitored for operational impact.',
    severity: current.weatherRisk >= 70 ? 'HIGH SEVERITY' : 'MONITORING',
  }), [current.weatherRisk]);

  return <div className="min-h-full overflow-x-hidden"><div className="mx-auto max-w-[1360px] px-4 pb-8 md:px-6">
    <header className="flex flex-wrap items-center justify-between gap-4 py-5"><div><h1 className="text-2xl font-bold text-white">Emergency Response</h1><p className="text-xs text-slate-400">Remote incident management and emergency coordination</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-emerald-500/15 px-3 py-2 text-[10px] text-emerald-300">● Live Replay</span><span className="hidden text-[10px] text-slate-400 md:block">{data?.headerInfo?.date} {data?.headerInfo?.time}</span></div></header>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <main className="space-y-4 xl:col-span-8">
        <section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-xs font-semibold"><Shield size={16} className="text-emerald-300" />Station Status</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4"><div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 md:col-span-1"><CheckCircle2 size={27} className="text-emerald-300" /><div><strong className="block text-sm text-emerald-300">NORMAL</strong><span className="text-[9px] text-slate-400">All systems operational</span></div></div><div className="rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><span className="text-[9px] text-slate-300">Weather Risk</span><strong className="mt-2 block text-lg">{current.weatherRisk || 0}<small className="text-[9px] text-slate-500">/100</small></strong><StatusPill tone="red">HIGH</StatusPill></div><div className="rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><span className="text-[9px] text-slate-300">System Health</span><strong className="mt-2 block text-lg">95<small className="text-[9px] text-slate-500">/100</small></strong><StatusPill>GOOD</StatusPill></div><div className="rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><span className="text-[9px] text-slate-300">Personnel</span><strong className="mt-2 block text-lg">12<small className="text-[9px] text-slate-500">/14</small></strong><StatusPill>SAFE</StatusPill></div></div></section>

        <section className="glass-card-static p-4"><div className="mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-rose-400" /><h2 className="text-xs font-semibold">Active Incident</h2><StatusPill tone="red">{incident.severity}</StatusPill></div><div className="grid gap-3 md:grid-cols-[1.2fr_1fr]"><div className="rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><div className="flex gap-3"><div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-slate-600 to-slate-900"><CloudSnow size={40} className="text-slate-300/70" /></div><div className="text-[10px] text-slate-300"><strong className="mb-1 block text-xs text-white">{incident.title}</strong><p>{incident.description}</p><p className="mt-2"><MapPin size={11} className="mr-1 inline text-cyan-300" />{station.name || 'Bharati Research Station'}</p><button type="button" className="btn-gradient mt-2 rounded px-3 py-1.5 text-[9px] font-semibold">View Details</button></div></div></div><div className="rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><h3 className="mb-2 text-[10px] font-semibold">Affected Systems</h3>{[['Communication', 'DEGRADED', Radio], ['Power', 'NORMAL', Zap], ['Heating', 'WARNING', Flame], ['Transport', 'SUSPENDED', Snowflake], ['Water Recycling', 'NORMAL', Globe2]].map(([label, status, Icon]) => <div key={label} className="flex items-center justify-between border-b border-white/5 py-1.5 text-[9px]"><span><Icon size={12} className="mr-2 inline text-cyan-300" />{label}</span><StatusPill tone={status === 'SUSPENDED' ? 'red' : status === 'WARNING' || status === 'DEGRADED' ? 'amber' : 'green'}>{status}</StatusPill></div>)}</div></div></section>

        <div className="grid gap-4 md:grid-cols-2"><section className="glass-card-static p-4"><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-xs font-semibold"><CheckCircle2 size={15} className="text-cyan-300" />Response Checklist</h2><span className="text-[9px] text-slate-400">{completedCount} / {checklist.length} completed</span></div><div className="mb-3 h-1.5 rounded-full bg-slate-700"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${checklist.length ? completedCount / checklist.length * 100 : 0}%` }} /></div><div className="space-y-2">{checklist.map((item, index) => <button type="button" key={item.label} onClick={() => setCompleted((items) => items.map((value, i) => i === index ? !value : value))} className="flex w-full items-center gap-2 text-left text-[10px] text-slate-300">{completed[index] ? <CheckCircle2 size={14} className="text-emerald-400" /> : <span className="h-3.5 w-3.5 rounded-full border border-slate-500" />}{item.label}</button>)}</div><button type="button" className="btn-gradient mt-4 w-full rounded-lg py-2 text-[10px] font-semibold">▶ Initiate Full Response</button></section>

        <section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-xs font-semibold"><Phone size={15} className="text-cyan-300" />Emergency Contacts</h2>{['Station Commander', 'Technical Support', 'Medical Office', 'IT / Communications', 'Emergency Hotline'].map((name, index) => <div key={name} className="flex items-center justify-between border-b border-white/5 py-2 text-[9px]"><span><UserRound size={13} className="mr-2 inline text-cyan-300" />{name}</span><span className="text-slate-400">+91 98765 4321{index}</span><Phone size={12} className="text-cyan-300" /></div>)}</section></div>
      </main>

      <aside className="space-y-4 xl:col-span-4"><section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-xs font-semibold"><AlertTriangle size={15} className="text-rose-400" />Emergency Scenarios</h2><div className="grid grid-cols-3 gap-2">{[['Power Failure', Zap], ['Blizzard', Snowflake], ['Fire', Flame], ['Medical Emergency', HeartPulse], ['Communication Loss', Radio], ['Fuel Leak', Droplets]].map(([label, Icon]) => <button type="button" key={label} onClick={() => setScenario(label)} className={`rounded-lg border p-3 text-[8px] ${scenario === label ? 'border-rose-400 bg-rose-500/15 text-rose-300' : 'border-cyan-400/20 bg-[#082653] text-slate-300'}`}><Icon size={17} className="mx-auto mb-1" />{label}</button>)}</div></section><section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-xs font-semibold"><Snowflake size={15} className="text-cyan-300" />Station Map &amp; Weather</h2><div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 via-slate-500 to-slate-800"><MapPin size={30} className="text-rose-400" /></div><div className="mt-2 flex justify-between text-[9px] text-slate-300"><span><Thermometer size={11} className="mr-1 inline text-cyan-300" />{current.temperature}°C</span><span>Wind {current.windSpeed} kn</span><span>{current.windDirectionLabel} {current.windDirection}°</span></div></section><section className="glass-card-static p-4"><h2 className="mb-3 text-xs font-semibold">System Status</h2>{systemRows.map(([label, status, color, Icon]) => <div key={label} className="flex items-center justify-between border-b border-white/5 py-1.5 text-[9px]"><span><Icon size={12} className={`mr-2 inline ${color}`} />{label}</span><span className={color}>{status}</span></div>)}<div className="mt-3 border-t border-white/10 pt-3 text-[9px] text-slate-400">Last drill: 5 days ago<br />Next scheduled drill: 15 Jan 2026 <ChevronRight size={14} className="float-right text-cyan-300" /></div></section></aside>
    </div>
  </div></div>;
}
