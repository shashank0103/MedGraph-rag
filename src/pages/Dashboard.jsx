import {
  Activity,
  ArrowUpRight,
  Brain,
  ChevronRight,
  Clock3,
  FileText,
  Network,
  Stethoscope,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  dashboardStats,
  patientRows,
  reportRows,
  consultationSteps,
} from "../Data/workspace";
import { getCurrentUser } from "../Data/auth";
import PatientDashboard from "./PatientDashboard";

export default function Dashboard() {
  if (getCurrentUser().role === "patient") {
    return <PatientDashboard />;
  }

  return (
    <div className="space-y-6 lg:space-y-8">

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {dashboardStats.map((stat) => {
          const Icon = stat.icon;

          const iconStyle =
            stat.tone === "sky"
              ? "bg-sky-50 text-sky-600"
              : stat.tone === "amber"
              ? "bg-amber-50 text-amber-600"
              : stat.tone === "emerald"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-teal-50 text-teal-600";

          return (
            <div
              key={stat.title}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >

              <div className="flex items-center justify-between">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconStyle}`}
                >
                  <Icon size={20} />
                </div>

                <span className="text-sm font-semibold text-emerald-600">
                  {stat.change}
                </span>

              </div>

              <p className="mt-5 text-sm text-slate-500">
                {stat.title}
              </p>

              <h3 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </h3>

            </div>
          );
        })}

      </section>


      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">

        {/* =================================================
            CLINICAL AI ASSISTANT
        ================================================= */}

        <div className="rounded-3xl bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-700 p-6 text-white shadow-xl shadow-cyan-900/10">

          <div className="flex flex-col gap-6">

            {/* HEADER */}

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-cyan-100">
                  Clinical AI Assistant
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Clinical workspace
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Stethoscope size={21} />
              </div>

            </div>


            {/* DESCRIPTION */}

            <div>

              <p className="max-w-xl text-sm leading-6 text-cyan-50/90 sm:text-base">
                Analyze patient symptoms, retrieve relevant evidence, explore
                clinical relationships, and support the next step in a
                consultation.
              </p>

            </div>


            {/* QUICK ACTION */}

            <div className="flex flex-col gap-3 sm:flex-row">

              <Link
                to="/consultation"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-teal-700 shadow-lg transition hover:-translate-y-0.5"
              >
                New Consultation
                <ArrowUpRight size={17} />
              </Link>

              <Link
                to="/patients"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                View Patients
                <Users size={17} />
              </Link>

            </div>


            {/* WORKSPACE SUMMARY */}

            <div className="grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">

                <div className="flex items-center gap-2">

                  <Activity size={16} />

                  <span className="text-xs font-medium text-cyan-100">
                    Consultations
                  </span>

                </div>

                <p className="mt-2 text-xl font-semibold">
                  48
                </p>

              </div>


              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">

                <div className="flex items-center gap-2">

                  <Network size={16} />

                  <span className="text-xs font-medium text-cyan-100">
                    KG updates
                  </span>

                </div>

                <p className="mt-2 text-xl font-semibold">
                  27
                </p>

              </div>


              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">

                <div className="flex items-center gap-2">

                  <FileText size={16} />

                  <span className="text-xs font-medium text-cyan-100">
                    Reports
                  </span>

                </div>

                <p className="mt-2 text-xl font-semibold">
                  36
                </p>

              </div>

            </div>


            {/* PIPELINE */}

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">

              <div className="flex items-center justify-between">

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                  MedGraph-RAG pipeline
                </p>

                <Brain size={16} />

              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                  Patient input
                </span>

                <ChevronRight size={14} />

                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                  Features
                </span>

                <ChevronRight size={14} />

                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                  Knowledge Graph
                </span>

                <ChevronRight size={14} />

                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                  EHR
                </span>

                <ChevronRight size={14} />

                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                  AI reasoning
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            LIVE WORKFLOW
        ================================================= */}

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Current workflow
              </p>

              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Clinical Analysis
              </h3>

            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Active
            </span>

          </div>


          <div className="mt-5 space-y-3">

            {consultationSteps.map((step, index) => (

              <div
                key={step}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 transition hover:bg-slate-100"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-700 shadow-sm">
                  0{index + 1}
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-sm font-semibold text-slate-800">
                    {step}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Clinical reasoning stage
                  </p>

                </div>

                <ChevronRight
                  size={17}
                  className="shrink-0 text-slate-400"
                />

              </div>

            ))}

          </div>


          <Link
            to="/consultation"
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
          >
            Open Consultation
            <ArrowUpRight size={16} />
          </Link>

        </div>

      </section>


      {/* =====================================================
          RECENT CONSULTATIONS + CLINICAL ACTIVITY
      ===================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">


        {/* RECENT CONSULTATIONS */}

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Patient activity
              </p>

              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Recent Consultations
              </h3>

            </div>

            <Link
              to="/patients"
              className="text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              View all
            </Link>

          </div>


          <div className="mt-5 space-y-3">

            {patientRows.slice(0, 4).map((patient) => (

              <div
                key={patient.name}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">

                    <Users
                      size={17}
                      className="text-teal-600"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-900">
                      {patient.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {patient.condition}
                    </p>

                  </div>

                </div>


                <div className="flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Age {patient.age}
                  </span>

                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    {patient.status}
                  </span>

                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {patient.priority}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* CLINICAL ACTIVITY */}

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Workspace activity
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Clinical Activity
            </h3>

          </div>


          <div className="mt-5 space-y-5">

            <div className="flex gap-3">

              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-500" />

              <div>

                <p className="text-sm font-semibold text-slate-800">
                  Consultation completed
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Lumbar radiculopathy review
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  20 minutes ago
                </p>

              </div>

            </div>


            <div className="flex gap-3">

              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-500" />

              <div>

                <p className="text-sm font-semibold text-slate-800">
                  Knowledge graph updated
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  New clinical relationships indexed
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  1 hour ago
                </p>

              </div>

            </div>


            <div className="flex gap-3">

              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />

              <div>

                <p className="text-sm font-semibold text-slate-800">
                  Report generated
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Hypertension follow-up
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  2 hours ago
                </p>

              </div>

            </div>


            <div className="flex gap-3">

              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />

              <div>

                <p className="text-sm font-semibold text-slate-800">
                  Follow-up pending
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Migraine assessment
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Today
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          REPORT QUEUE
      ===================================================== */}

      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Documentation
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Report Queue
            </h3>

          </div>

          <Link
            to="/reports"
            className="text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            View reports
          </Link>

        </div>


        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">

          {reportRows.map((report) => (

            <div
              key={report.title}
              className="rounded-2xl bg-slate-50 p-4"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">

                  <FileText
                    size={16}
                    className="text-slate-600"
                  />

                </div>

                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
                  {report.status}
                </span>

              </div>

              <p className="mt-4 text-sm font-semibold text-slate-900">
                {report.title}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {report.owner}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-slate-400">

                <Clock3 size={12} />

                {report.updated}

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}