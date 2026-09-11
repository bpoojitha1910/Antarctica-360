import React, { useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowRight, CheckCircle2, ClipboardList, Clock3, FileText,
  Info, MessageSquare, RefreshCw, Settings, ShieldCheck, Users, Wind
} from 'lucide-react';
import { useDashboard } from '../DashboardContext';

const checklistItems = [
  ['Operations Overview', 'Key activities, ongoing operations, daily summary', 'Completed'],
  ['Weather & Environment', 'Current conditions, forecast, hazards', 'Completed'],
  ['Systems Status', 'Power, communication, water, medical, research', 'Completed'],
  ['Incidents & Alerts', 'Recent incidents, unresolved issues, risk alerts', 'Completed'],
  ['Action Items', 'Pending tasks, follow-ups, priorities', 'In Progress'],
  ['Additional Notes', 'Anything else to be noted', 'Pending'],
];

function Status({ children }) {
  const completed = children === 'Completed';
  const progress = children === 'In Progress';
  return <span className={`rounded-full px-2 py-1 text-[8px] font-semibold ${completed ? 'bg-emerald-500/20 text-emerald-300' : progress ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-500/20 text-slate-300'}`}>{completed ? '✓ ' : progress ? '◌ ' : '○ '}{children}</span>;
}

export default function ShiftHandover() {
  const { data } = useDashboard();
  const [checked, setChecked] = useState(() => checklistItems.map((item) => item[2] === 'Completed'));
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const current = data?.currentWeather || {};
  const completedCount = checked.filter(Boolean).length;
  const progress = Math.round((completedCount / checklistItems.length) * 100);
  const updates = useMemo(() => [
    ['14:32', 'Weather condition updated – wind speed increased to 28 km/h.', 'Weather', 'text-cyan-300'],
    ['14:05', 'Communication link with Research Lab restored.', 'Systems', 'text-cyan-300'],
    ['12:20', 'Routine equipment check completed (Power Plant).', 'Operations', 'text-emerald-300'],
    ['10:15', 'Minor ice accumulation on runway. Cleared.', 'Operations', 'text-emerald-300'],
    ['08:50', 'Wildlife sighting near Station (Penguin colony).', 'Environment', 'text-violet-300'],
  ], []);

  return (
    <div className="min-h-full overflow-x-hidden">
      <div className="mx-auto max-w-[1360px] px-4 pb-8 md:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div><h1 className="text-2xl font-bold text-white">Shift Handover</h1><p className="text-xs text-slate-400">Transfer shift information, update status and ensure continuity of operations</p></div>
          <div className="flex items-center gap-2"><span className="rounded-full bg-emerald-500/15 px-3 py-2 text-[10px] text-emerald-300">● Live Replay</span><span className="hidden text-[10px] text-slate-400 md:block">{data?.headerInfo?.date} {data?.headerInfo?.time}</span><button type="button" className="rounded-lg border border-cyan-400/20 p-2 text-slate-300"><RefreshCw size={13} /></button></div>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <main className="space-y-4 xl:col-span-8">
            <section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-xs font-semibold"><ClipboardList size={15} className="text-cyan-300" />Current Shift</h2><div className="grid grid-cols-2 gap-2 md:grid-cols-4"><div className="rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><p className="text-[10px] font-semibold">☀️ Day Shift</p><p className="mt-1 text-[9px] text-slate-400">06:00 – 18:00 (UTC)</p><Status>ACTIVE</Status></div><div className="rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><p className="text-[9px] text-slate-400">Current Team</p><p className="mt-2 text-[10px] font-semibold">Team Alpha</p><p className="text-[9px] text-slate-500">(3 members)</p></div><div className="rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><p className="text-[9px] text-slate-400">Shift Start</p><p className="mt-2 text-[10px] font-semibold">10 Jan 2026</p><p className="text-[9px] text-slate-500">06:00 UTC</p></div><div className="rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><p className="text-[9px] text-slate-400">Time Remaining</p><p className="mt-2 text-[10px] font-semibold">3h 7m</p><div className="mt-2 h-1.5 rounded-full bg-slate-700"><div className="h-full w-2/3 rounded-full bg-cyan-400" /></div></div></div></section>

            <section className="glass-card-static p-3"><h2 className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold"><FileText size={15} className="text-cyan-300" />Handover Checklist</h2><div className="space-y-2">{checklistItems.map(([title, description, initial], index) => { const isDone = checked[index]; const state = isDone ? 'Completed' : initial === 'In Progress' && completedCount < checklistItems.length ? 'In Progress' : 'Pending'; return <button type="button" key={title} onClick={() => setChecked((items) => items.map((item, itemIndex) => itemIndex === index ? !item : item))} className="flex w-full items-center gap-3 rounded-lg border border-cyan-400/20 bg-[#082653] p-3 text-left hover:bg-[#0b3268]"><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDone ? 'bg-emerald-500/15 text-emerald-300' : 'bg-cyan-500/10 text-cyan-300'}`}>{isDone ? <CheckCircle2 size={16} /> : <Info size={16} />}</span><span className="min-w-0 flex-1"><strong className="block text-[10px] text-white">{title}</strong><small className="text-[9px] text-slate-500">{description}</small></span><Status>{state}</Status></button>; })}</div></section>

            <section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-xs font-semibold"><MessageSquare size={15} className="text-cyan-300" />Quick Handover Notes</h2><textarea value={notes} onChange={(event) => { setNotes(event.target.value); setSaved(false); }} maxLength={1000} placeholder="Add any important notes for the next shift..." className="h-20 w-full resize-none rounded-lg border border-cyan-400/20 bg-[#082653] p-3 text-[10px] text-white outline-none placeholder:text-slate-500" /><div className="mt-2 flex items-center justify-between"><span className="text-[8px] text-slate-500">{notes.length}/1000</span><button type="button" onClick={() => setSaved(true)} className="btn-gradient rounded-lg px-4 py-2 text-[10px] font-semibold">▣ {saved ? 'Saved' : 'Save Note'}</button></div></section>
          </main>

          <aside className="space-y-4 xl:col-span-4">
            <section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-xs font-semibold"><ShieldCheck size={15} className="text-cyan-300" />Handover Progress</h2><div className="flex items-center gap-4"><div className="flex h-24 w-24 items-center justify-center rounded-full" style={{ background: `conic-gradient(#22d3ee ${progress * 3.6}deg, #17345b 0deg)` }}><div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-[#082653]"><strong className="text-lg">{progress}%</strong><span className="text-[8px] text-slate-400">Completed</span></div></div><div className="space-y-2 text-[9px]"><p className="text-emerald-300">● Operations Overview</p><p className="text-emerald-300">● Weather &amp; Environment</p><p className="text-emerald-300">● Systems Status</p><p className="text-emerald-300">● Incidents &amp; Alerts</p><p className="text-slate-400">○ Pending: Action Items</p></div></div></section>
            <section className="glass-card-static p-4"><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-xs font-semibold"><Clock3 size={15} className="text-cyan-300" />Recent Updates</h2><button type="button" className="text-[9px] text-cyan-300">View All</button></div>{updates.map(([time, text, tag, color]) => <div key={time} className="flex gap-2 border-l border-cyan-400/30 py-1.5 pl-3 text-[9px]"><span className="w-8 text-slate-500">{time}</span><span className="flex-1 text-slate-300">{text}</span><span className={`rounded-full bg-white/5 px-2 py-0.5 ${color}`}>{tag}</span></div>)}</section>
            <section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-xs font-semibold"><FileText size={15} className="text-cyan-300" />Outgoing Shift Summary <span className="ml-auto text-[9px] text-cyan-300">Edit</span></h2><ul className="space-y-1 text-[9px] text-slate-300"><li>• All systems nominal except minor power fluctuation (resolved).</li><li>• Weather conditions stable, wind {current.windSpeed || 28} km/h, visibility good.</li><li>• No new incidents.</li><li>• Research Lab operations normal.</li><li>• 1 pending action item: follow up on communication antenna maintenance.</li></ul></section>
            <section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-xs font-semibold"><Users size={15} className="text-cyan-300" />Next Shift Details</h2><div className="grid grid-cols-3 gap-2 text-[9px] text-slate-300"><div><span className="text-slate-500">Team</span><p className="mt-1">Team Bravo</p><small>(3 members)</small></div><div><span className="text-slate-500">Shift Start</span><p className="mt-1">10 Jan 2026</p><small>18:00 UTC</small></div><div><span className="text-slate-500">Key Focus</span><p className="mt-1">Maintenance &amp;</p><small>System Checks</small></div></div><button type="button" className="btn-gradient mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-semibold">Complete Handover <ArrowRight size={13} /></button></section>
          </aside>
        </div>
      </div>
    </div>
  );
}
