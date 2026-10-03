import { Link } from "react-router-dom";
import { Activity, ArrowUpRight, Brain, FileText, HeartPulse, Network } from "lucide-react";

import { getCurrentUser } from "../Data/auth";

export default function PatientDashboard() {
  const patient = getCurrentUser().patient;
  const conditions = patient.conditions?.length ? patient.conditions : [patient.condition];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-700 p-6 text-white shadow-xl shadow-cyan-900/10 sm:p-8">
        <p className="text-sm font-medium text-cyan-100">Personal health workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Hello, {patient.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-50/90">Review your recorded health information, explore the relationships in your knowledge graph, and access reports shared with you.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/reports" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-teal-700 shadow-lg transition hover:-translate-y-0.5">View my reports <ArrowUpRight size={17} /></Link>
          <Link to="/knowledge-graph" state={{ patient }} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">Explore knowledge graph <Network size={17} /></Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <PatientStat icon={HeartPulse} label="Primary condition" value={patient.condition} />
        <PatientStat icon={Activity} label="Recorded symptoms" value={patient.issues?.length || 0} detail="symptoms" />
        <PatientStat icon={FileText} label="Care status" value={patient.status} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><Brain size={20} /></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Knowledge graph</p><h2 className="mt-1 text-lg font-semibold text-slate-900">Your clinical picture</h2></div></div>
          <p className="mt-5 text-sm leading-6 text-slate-500">Your recorded symptoms, conditions, medications, and supporting evidence are connected in one view.</p>
          <div className="mt-5 flex flex-wrap gap-2">{[...conditions, ...(patient.medications || [])].map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">{item}</span>)}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Need help?</p><h2 className="mt-2 text-lg font-semibold text-slate-900">Ask the clinical assistant</h2><p className="mt-3 text-sm leading-6 text-slate-500">The assistant can answer questions using only the health information recorded in your profile.</p><div className="mt-5 flex items-center gap-2 text-sm font-semibold text-teal-700"><Activity size={16} /> Open the assistant in the corner</div></div>
      </section>
    </div>
  );
}

function PatientStat({ icon: Icon, label, value, detail }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600"><Icon size={19} /></div><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-900">{value} {detail && <span className="text-sm font-medium text-slate-400">{detail}</span>}</p></div>;
}