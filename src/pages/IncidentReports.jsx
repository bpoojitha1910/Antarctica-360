import React, { useMemo, useState } from 'react';
import {
  AlertTriangle, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3,
  FileText, Flag, Filter, MapPin, Search, Settings, ShieldAlert, Snowflake,
  UserRound, Wifi, Zap
} from 'lucide-react';
import { useDashboard } from '../DashboardContext';

const incidents = [
  ['INC-001', 'Severe Blizzard', 'Extreme winds and reduced visibility', 'HIGH', 'IN PROGRESS', '10 Jan 2026 14:32', 'Bharati Station', Snowflake],
  ['INC-002', 'Equipment Failure', 'Radar system offline', 'MEDIUM', 'OPEN', '10 Jan 2026 11:14', 'FCR Station', Wifi],
  ['INC-003', 'Medical Emergency', 'Crew member with fever', 'HIGH', 'RESOLVED', '09 Jan 2026 22:47', 'Main Habitat', ShieldAlert],
  ['INC-004', 'Communication Loss', 'Satellite link unstable', 'MEDIUM', 'IN PROGRESS', '09 Jan 2026 18:21', 'South Ridge', Wifi],
  ['INC-005', 'Fuel Leak', 'Minor leak in storage unit', 'LOW', 'RESOLVED', '09 Jan 2026 12:03', 'Fuel Storage', FileText],
  ['INC-006', 'Power Failure', 'Generator 2 offline', 'HIGH', 'OPEN', '08 Jan 2026 21:56', 'Power Plant', Zap],
  ['INC-007', 'Wildlife Sighting', 'Penguin near research lab', 'LOW', 'RESOLVED', '08 Jan 2026 16:32', 'Research Lab', ShieldAlert],
  ['INC-008', 'Weather Alert', 'Rapid temperature drop', 'MEDIUM', 'OPEN', '08 Jan 2026 09:17', 'Bharati Station', Snowflake],
];

const severityClass = {
  HIGH: 'border-rose-400/40 bg-rose-500/20 text-rose-300',
  MEDIUM: 'border-amber-400/40 bg-amber-500/20 text-amber-300',
  LOW: 'border-cyan-400/40 bg-cyan-500/20 text-cyan-300',
};

const statusClass = {
  'IN PROGRESS': 'bg-cyan-500/20 text-cyan-300',
  OPEN: 'bg-amber-500/20 text-amber-300',
  RESOLVED: 'bg-emerald-500/20 text-emerald-300',
};

function Pill({ children, className = '' }) {
  return <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${className}`}>{children}</span>;
}

export default function IncidentReports() {
  const { data } = useDashboard();
  const [selectedId, setSelectedId] = useState('INC-001');
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('All Severity');
  const [status, setStatus] = useState('All Status');
  const selected = incidents.find((incident) => incident[0] === selectedId) || incidents[0];
  const current = data?.currentWeather || {};

  const filtered = useMemo(() => incidents.filter((incident) => {
    const matchesQuery = incident.slice(0, 3).join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesSeverity = severity === 'All Severity' || incident[3] === severity;
    const matchesStatus = status === 'All Status' || incident[4] === status;
    return matchesQuery && matchesSeverity && matchesStatus;
  }), [query, severity, status]);

  return (
    <div className="min-h-full overflow-x-hidden">
      <div className="mx-auto max-w-[1360px] px-4 pb-8 md:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div><h1 className="text-2xl font-bold text-white">Incident Reports</h1><p className="text-xs text-slate-400">View, track and manage all station incidents and response actions</p></div>
          <div className="flex items-center gap-2"><span className="rounded-full bg-emerald-500/15 px-3 py-2 text-[10px] text-emerald-300">● Live Replay</span><span className="hidden text-[10px] text-slate-400 md:block">{data?.headerInfo?.date} {data?.headerInfo?.time}</span><button type="button" className="rounded-lg border border-cyan-400/20 p-2 text-slate-300"><Settings size={13} /></button></div>
        </header>

        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ['Total Incidents', '23', '↑ +3 (vs last 7 days)', AlertTriangle, 'text-rose-300'],
            ['Open', '6', '↓ -2 (vs last 7 days)', Clock3, 'text-amber-300'],
            ['In Progress', '4', '↗ +1 (vs last 7 days)', Settings, 'text-cyan-300'],
            ['Resolved', '13', '↗ +4 (vs last 7 days)', CheckCircle2, 'text-emerald-300'],
          ].map(([label, value, change, Icon, color]) => <div key={label} className="glass-card-static p-3"><div className="flex items-center gap-2 text-[10px] text-slate-300"><Icon size={16} className={color} />{label}</div><strong className="mt-2 block text-2xl">{value}</strong><span className={`text-[9px] ${color}`}>{change}</span></div>)}
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className="glass-card-static overflow-hidden xl:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 p-3"><h2 className="flex items-center gap-2 text-sm font-semibold"><FileText size={16} className="text-cyan-300" />Incident Reports</h2><div className="flex items-center gap-2"><div className="flex items-center rounded border border-cyan-400/20 bg-[#082653] px-2"><Search size={12} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search incidents..." className="w-28 bg-transparent px-2 py-1.5 text-[10px] text-white outline-none placeholder:text-slate-500" /></div><button type="button" className="rounded border border-cyan-400/20 p-1.5 text-cyan-300"><FileText size={13} /></button></div></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-[9px]"><thead className="text-slate-500"><tr>{['ID', 'Title', 'Severity', 'Status', 'Reported', 'Location', ''].map((heading) => <th key={heading} className="px-3 py-2">{heading}</th>)}</tr></thead><tbody>{filtered.map(([id, title, description, level, state, reported, location, Icon]) => <tr key={id} onClick={() => setSelectedId(id)} className={`cursor-pointer border-t border-white/5 text-slate-300 hover:bg-cyan-500/10 ${selectedId === id ? 'bg-cyan-500/10' : ''}`}><td className="px-3 py-2"><Icon size={14} className="mr-2 inline text-cyan-300" />{id}</td><td className="px-3 py-2"><strong className="block text-white">{title}</strong><span className="text-[8px] text-slate-500">{description}</span></td><td className="px-3 py-2"><Pill className={`border ${severityClass[level]}`}>{level}</Pill></td><td className="px-3 py-2"><Pill className={statusClass[state]}>{state}</Pill></td><td className="px-3 py-2">{reported}</td><td className="px-3 py-2"><MapPin size={10} className="mr-1 inline text-cyan-300" />{location}</td><td className="px-3 py-2 text-cyan-300">›</td></tr>)}</tbody></table></div>
            <div className="flex items-center justify-between border-t border-white/10 p-3 text-[9px] text-slate-400"><span>Showing 1–{filtered.length} of 23 incidents</span><span className="flex gap-1"><button type="button" className="rounded border border-cyan-400/20 p-1"><ChevronLeft size={12} /></button><button type="button" className="rounded bg-cyan-500 px-2 py-1 text-white">1</button><button type="button" className="rounded border border-cyan-400/20 px-2 py-1">2</button><button type="button" className="rounded border border-cyan-400/20 px-2 py-1">3</button><button type="button" className="rounded border border-cyan-400/20 p-1"><ChevronRight size={12} /></button></span></div>
          </section>

          <aside className="glass-card-static p-4 xl:col-span-5"><div className="mb-3 flex items-start justify-between"><div><div className="flex items-center gap-2 text-[10px] text-cyan-300">{selected[0]} <Pill className={`border ${severityClass[selected[3]]}`}>{selected[3]}</Pill><Pill className={statusClass[selected[4]]}>{selected[4]}</Pill></div><h2 className="mt-1 text-sm font-semibold">{selected[1]}</h2><p className="mt-2 text-[9px] text-slate-400"><CalendarDays size={11} className="mr-1 inline" />{selected[5]} <MapPin size={11} className="mx-1 inline" />{selected[6]}</p></div></div><div className="mb-3 flex border-b border-white/10 text-[9px]"><span className="border-b-2 border-cyan-400 px-3 py-2 text-cyan-300">Overview</span><span className="px-3 py-2 text-slate-500">Updates</span><span className="px-3 py-2 text-slate-500">Attachments</span><span className="px-3 py-2 text-slate-500">Response Plan</span></div><div><h3 className="mb-2 flex items-center gap-2 text-[10px] font-semibold"><FileText size={14} className="text-cyan-300" />Description</h3><p className="text-[10px] text-slate-300">{selected[2]}. Operations are at risk and the response team is monitoring station conditions.</p><h3 className="mb-2 mt-4 flex items-center gap-2 text-[10px] font-semibold"><AlertTriangle size={14} className="text-cyan-300" />Impact</h3><ul className="space-y-1 text-[9px] text-slate-300"><li>• Outdoor operations suspended</li><li>• Increased risk of equipment damage</li><li>• Travel within 2 km restricted</li></ul></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><div><h3 className="mb-2 text-[10px] font-semibold">Response Actions</h3>{(data?.emergencyChecklist || []).slice(0, 5).map((item) => <p key={item.label} className="my-1 text-[9px] text-slate-300">{item.checked ? <CheckCircle2 size={12} className="mr-1 inline text-emerald-400" /> : <span className="mr-1 inline-block h-3 w-3 rounded-full border border-slate-500 align-middle" />}{item.label}</p>)}</div><div className="rounded-lg border border-cyan-400/20 bg-[#082653] p-3 text-[9px] text-slate-300"><p><UserRound size={12} className="mr-2 inline text-cyan-300" />Assigned To<br /><strong className="ml-5 text-white">Operations Team</strong></p><p className="mt-3"><Flag size={12} className="mr-2 inline text-cyan-300" />Priority<br /><strong className="ml-5 text-rose-300">High</strong></p><p className="mt-3"><Clock3 size={12} className="mr-2 inline text-cyan-300" />Estimated Resolution<br /><strong className="ml-5 text-white">10 Jan 2026 20:00</strong></p></div></div><div className="mt-3 rounded-lg border border-cyan-400/20 bg-[#082653] p-3"><h3 className="mb-2 text-[10px] font-semibold">Timeline</h3><p className="text-[9px] text-slate-300">14:32 &nbsp; Incident reported by Weather Station</p><p className="mt-2 text-[9px] text-slate-300">14:40 &nbsp; Response team notified</p><p className="mt-2 text-[9px] text-cyan-300">14:55 &nbsp; Field assessment in progress</p></div></aside>
        </div>

        <section className="glass-card-static p-3"><div className="mb-3 flex items-center gap-2 text-xs font-semibold"><Filter size={14} className="text-cyan-300" />Filters</div><div className="grid gap-2 sm:grid-cols-3"><select value={severity} onChange={(event) => setSeverity(event.target.value)} className="rounded border border-cyan-400/20 bg-[#082653] px-3 py-2 text-[10px] text-slate-200"><option>All Severity</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded border border-cyan-400/20 bg-[#082653] px-3 py-2 text-[10px] text-slate-200"><option>All Status</option><option>OPEN</option><option>IN PROGRESS</option><option>RESOLVED</option></select><button type="button" className="flex items-center gap-2 rounded border border-cyan-400/20 bg-[#082653] px-3 py-2 text-left text-[10px] text-slate-300"><CalendarDays size={13} />Last 7 days (3 Jan – 10 Jan 2026)<ChevronRight size={12} className="ml-auto" /></button></div></section>
      </div>
    </div>
  );
}
