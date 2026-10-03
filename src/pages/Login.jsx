import { useState } from "react";
import { Activity, ArrowRight, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { signInAsDoctor, signInAsPatient } from "../Data/auth";
import { getStoredPatients } from "../Data/clinicalStore";

export default function Login() {
  const navigate = useNavigate();
  const patients = getStoredPatients();
  const [role, setRole] = useState("doctor");
  const [patientName, setPatientName] = useState(patients[0]?.name || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (role === "doctor") signInAsDoctor();
    else signInAsPatient(patientName);
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-white bg-white p-7 shadow-2xl shadow-slate-300/40 sm:p-9">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20"><Activity size={23} /></div>
          <div><p className="text-lg font-bold text-slate-900">MedGraph-RAG</p><p className="text-xs text-slate-500">Clinical AI Workspace</p></div>
        </div>
        <div className="mt-10"><p className="text-sm font-semibold text-teal-700">Secure workspace access</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Choose your account</h1><p className="mt-2 text-sm leading-6 text-slate-500">Enter the workspace as a doctor or patient to see a role-specific dashboard.</p></div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
            {["doctor", "patient"].map((accountRole) => (
              <button key={accountRole} type="button" onClick={() => setRole(accountRole)} className={`rounded-xl px-3 py-3 text-sm font-semibold capitalize transition ${role === accountRole ? "bg-white text-teal-700 shadow-sm" : "text-slate-500"}`}>{accountRole}</button>
            ))}
          </div>

          {role === "doctor" ? (
            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4"><div className="flex items-center gap-3"><UserRound size={18} className="text-teal-700" /><div><p className="text-sm font-semibold text-slate-900">Dr. Shashank</p><p className="mt-1 text-xs text-slate-500">Healthcare Provider</p></div></div></div>
          ) : (
            <label className="block text-sm font-semibold text-slate-700">Patient profile<select value={patientName} onChange={(event) => setPatientName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100">{patients.map((patient) => <option key={patient.name}>{patient.name}</option>)}</select></label>
          )}

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700">Continue to workspace <ArrowRight size={17} /></button>
        </form>
      </section>
    </main>
  );
}