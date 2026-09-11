import React from 'react';
import {
  Activity, BarChart3, CheckCircle2, CloudSnow, Database, FileText, FlaskConical,
  Leaf, MapPin, ShieldCheck, Sparkles, Target, Users, Wind, Zap
} from 'lucide-react';
import { useDashboard } from '../DashboardContext';

const focusAreas = [
  ['Weather & Climate Analytics', 'Forecasts, extreme weather alerts', CloudSnow, 'text-cyan-300'],
  ['Risk & Safety', 'Hazard detection, emergency response', ShieldCheck, 'text-rose-300'],
  ['Station Operations', 'Equipment health, resource tracking', SettingsIcon, 'text-blue-300'],
  ['Environmental Monitoring', 'Ice, ocean, ecosystem data', Leaf, 'text-emerald-300'],
  ['Research Support', 'Data for scientific discovery', FlaskConical, 'text-indigo-300'],
];

function SettingsIcon(props) {
  return <Activity {...props} />;
}

export default function About() {
  const { data } = useDashboard();
  const station = data?.stationInfo || {};

  return (
    <div className="min-h-full overflow-x-hidden">
      <div className="mx-auto max-w-[1360px] px-4 pb-8 md:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div><h1 className="text-2xl font-bold text-white">About</h1><p className="text-xs text-slate-400">Project, mission and our team</p></div>
          <div className="flex items-center gap-2"><span className="rounded-full bg-emerald-500/15 px-3 py-2 text-[10px] text-emerald-300">● Live Replay</span><span className="hidden text-[10px] text-slate-400 md:block">{data?.headerInfo?.date} {data?.headerInfo?.time}</span></div>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <main className="space-y-4 xl:col-span-8">
            <section className="glass-card-static overflow-hidden"><div className="grid gap-4 p-4 md:grid-cols-[1fr_1.15fr]"><div className="flex min-h-44 items-center justify-center rounded-lg border border-cyan-400/20 bg-gradient-to-br from-slate-600 via-slate-700 to-[#082653]"><CloudSnow size={65} className="text-slate-200/60" /></div><div className="flex flex-col justify-center"><h2 className="text-2xl font-bold text-white">Antarctica 360</h2><p className="mt-2 text-xs text-cyan-200">Real-time insights. Safer operations. A sustainable future.</p><p className="mt-3 text-[11px] leading-relaxed text-slate-300">Antarctica 360 is a next-generation monitoring and decision support platform for the Bharat Research Station. It brings together data from weather, environment, station operations and risk systems to help our team work safer, smarter and more efficiently in one of the most extreme places on Earth.</p></div></div><div className="grid grid-cols-2 border-t border-white/10 md:grid-cols-4">{[['Monitor', 'Weather, environment and station health', Target], ['Predict', 'Risks, trends and operational needs', Activity], ['Respond', 'Faster with real-time alerts', Zap], ['Sustain', 'Supporting long-term research & conservation', Leaf]].map(([title, text, Icon]) => <div key={title} className="border-r border-white/10 p-4 text-center last:border-0"><Icon size={24} className="mx-auto mb-2 text-cyan-300" /><strong className="block text-[11px]">{title}</strong><span className="text-[9px] text-slate-400">{text}</span></div>)}</div></section>

            <div className="grid gap-4 md:grid-cols-2"><section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Target size={17} className="text-cyan-300" />Our Mission</h2><p className="text-[11px] leading-relaxed text-slate-300">To enable safe, efficient and sustainable research in Antarctica through data-driven insights, advanced analytics and intelligent monitoring systems.</p><div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-[10px] text-slate-300">{['Ensure safety of personnel and equipment', 'Maintain uninterrupted station operations', 'Support scientific research and environmental monitoring', 'Minimize environmental impact'].map((item) => <p key={item}><CheckCircle2 size={13} className="mr-2 inline text-cyan-300" />{item}</p>)}</div></section><section className="glass-card-static p-4"><h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Users size={17} className="text-cyan-300" />About Us</h2><p className="text-[11px] leading-relaxed text-slate-300">We are a team of researchers, engineers and analysts working on the Antarctica 360 project at Bharat Research Station. We combine expertise in climate science, data analytics, remote sensing and operations to build intelligent systems for a safer and more sustainable Antarctic mission.</p><div className="mt-4 grid grid-cols-3 border-t border-white/10 pt-3 text-center"><div><Users size={15} className="mx-auto text-cyan-300" /><strong className="mt-1 block">12+</strong><span className="text-[8px] text-slate-500">Research Team</span></div><div><Database size={15} className="mx-auto text-cyan-300" /><strong className="mt-1 block">5+</strong><span className="text-[8px] text-slate-500">Years of Research</span></div><div><Sparkles size={15} className="mx-auto text-cyan-300" /><strong className="mt-1 block">8+</strong><span className="text-[8px] text-slate-500">Active Projects</span></div></div></section></div>
          </main>

          <aside className="space-y-4 xl:col-span-4"><section className="glass-card-static p-4"><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><FileText size={17} className="text-cyan-300" />Project Overview</h2><div className="grid grid-cols-[1fr_1.5fr] gap-y-3 text-[10px]"><span className="text-slate-400">Project Name</span><span>Antarctica 360</span><span className="text-slate-400">Domain</span><span>Environmental Monitoring &amp; Station Operations</span><span className="text-slate-400">Location</span><span>Bharat Research Station,<br />Larsemann Hills, Antarctica</span><span className="text-slate-400">Start Date</span><span>Jan 2026</span><span className="text-slate-400">Status</span><span className="w-fit rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">Active</span></div></section><section className="glass-card-static p-4"><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Sparkles size={17} className="text-cyan-300" />Our Focus Areas</h2><div className="space-y-3">{focusAreas.map(([title, description, Icon, color]) => <div key={title} className="flex items-center gap-3"><span className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ${color}`}><Icon size={17} /></span><div><strong className="block text-[10px]">{title}</strong><span className="text-[9px] text-slate-500">{description}</span></div></div>)}</div></section><section className="glass-card-static p-5 text-center"><p className="text-sm italic text-slate-300">“From the coldest corners of the planet,<br />to a smarter tomorrow.”</p><p className="mt-4 text-[10px] text-cyan-300">— Antarctica 360 Team</p></section></aside>
        </div>
      </div>
    </div>
  );
}
