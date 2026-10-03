import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  ChevronRight,
  Filter,
  Pill,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";

import { createPatient, getStoredPatients, savePatients } from "../Data/clinicalStore";

export default function Patients() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [patients, setPatients] = useState(getStoredPatients);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    conditions: "",
    issues: "",
    medications: "",
    priority: "Medium",
  });

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      const matchesPatient =
        patient.name.toLowerCase().includes(query) ||
        patient.condition.toLowerCase().includes(query) ||
        patient.status.toLowerCase().includes(query) ||
        patient.priority.toLowerCase().includes(query);

      const matchesIssue = patient.issues?.some((issue) =>
        issue.toLowerCase().includes(query)
      );

      return matchesPatient || matchesIssue;
    });
  }, [patients, search]);

  const updateForm = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleAddPatient = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.age || !form.conditions.trim()) return;

    const newPatient = createPatient(form);
    const nextPatients = [newPatient, ...patients];
    setPatients(nextPatients);
    savePatients(nextPatients);
    setForm({ name: "", age: "", gender: "", conditions: "", issues: "", medications: "", priority: "Medium" });
    setShowAddPatient(false);
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Patients
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage patient profiles and access clinical history.
          </p>
        </div>

        <button type="button" onClick={() => setShowAddPatient(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700">
          <Plus size={17} />
          Add Patient
        </button>

      </div>


      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            placeholder="Search patients, conditions, or symptoms"
          />

        </div>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition ${
            showFilter
              ? "border-teal-300 bg-teal-50 text-teal-700"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Filter size={16} />
          Filter
        </button>

      </div>


      {/* =====================================================
          FILTER PANEL
      ===================================================== */}

      {showFilter && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm font-semibold text-slate-900">
            Patient filters
          </p>

          <div className="mt-4 flex flex-wrap gap-2">

            <button className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
              All patients
            </button>

            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
              High priority
            </button>

            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
              Follow-up
            </button>

            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
              Active
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          PATIENT COUNT
      ===================================================== */}

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {filteredPatients.length} patients
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Clinical workspace
          </p>
        </div>

        <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">

          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          Clinical records synchronized

        </div>

      </div>


      {/* =====================================================
          PATIENT CARDS
      ===================================================== */}

      {filteredPatients.length > 0 ? (

        <div className="grid gap-5 xl:grid-cols-2">

          {filteredPatients.map((patient) => (

            <article
              key={patient.name}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >

              {/* PATIENT HEADER */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
                    <User
                      size={21}
                      className="text-teal-600"
                    />
                  </div>

                  <div>

                    <h3 className="text-lg font-semibold text-slate-900">
                      {patient.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {patient.condition}
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {patient.status}
                </span>

              </div>


              {/* BASIC INFO */}

              <div className="mt-6 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Age
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {patient.age} years
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Priority
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {patient.priority}
                  </p>

                </div>

              </div>


              {/* =================================================
                  PATIENT ISSUES / SYMPTOMS
              ================================================= */}

              <div className="mt-4 rounded-2xl border border-slate-100 p-4">

                <div className="flex items-center gap-2">

                  <Activity
                    size={16}
                    className="text-teal-600"
                  />

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Current symptoms
                  </p>

                </div>

                <div className="mt-3 flex flex-wrap gap-2">

                  {patient.issues?.map((issue) => (

                    <span
                      key={issue}
                      className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"
                    >
                      {issue}
                    </span>

                  ))}

                </div>

              </div>


              {/* CLINICAL INFO */}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">

                    <Activity
                      size={16}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Last visit
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      Today
                    </p>

                  </div>

                </div>


                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">

                    <Pill
                      size={16}
                      className="text-violet-600"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Care task
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      Follow-up
                    </p>

                  </div>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="mt-5 flex gap-3">

                <button
                  onClick={() => setSelectedPatient(patient)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                >
                  View profile
                  <ChevronRight size={16} />
                </button>

                <Link
                  to="/consultation"
                  state={{ patient }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <Activity size={16} />
                  Consultation
                </Link>

              </div>

            </article>

          ))}

        </div>

      ) : (

        /* =====================================================
           EMPTY STATE
        ===================================================== */

        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

            <Search
              size={22}
              className="text-slate-400"
            />

          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No patients found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try searching with another patient name, condition, or symptom.
          </p>

        </div>

      )}

      {showAddPatient && (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Close add patient form" onClick={() => setShowAddPatient(false)} className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" />
          <section className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">Patient registration</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Add new patient</h2>
                <p className="mt-1 text-sm text-slate-500">Create a profile that is immediately available to the graph and assistant.</p>
              </div>
              <button type="button" onClick={() => setShowAddPatient(false)} aria-label="Close patient form" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddPatient} className="mt-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Full name" value={form.name} onChange={(value) => updateForm("name", value)} placeholder="e.g. Priya Shah" required />
                <FormField label="Age" type="number" value={form.age} onChange={(value) => updateForm("age", value)} placeholder="Age" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Gender" value={form.gender} onChange={(value) => updateForm("gender", value)} placeholder="e.g. Female" />
                <label className="text-sm font-medium text-slate-700">Priority<select value={form.priority} onChange={(event) => updateForm("priority", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"><option>Low</option><option>Medium</option><option>High</option></select></label>
              </div>
              <FormField label="Condition(s)" value={form.conditions} onChange={(value) => updateForm("conditions", value)} placeholder="Separate multiple conditions with commas" required />
              <FormField label="Symptoms / issues" value={form.issues} onChange={(value) => updateForm("issues", value)} placeholder="e.g. Fatigue, dizziness" />
              <FormField label="Medications" value={form.medications} onChange={(value) => updateForm("medications", value)} placeholder="e.g. Metformin" />
              <button type="submit" className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700">Save patient profile</button>
            </form>
          </section>
        </div>
      )}


      {/* =====================================================
          PATIENT PROFILE DRAWER
      ===================================================== */}

      {selectedPatient && (

        <div className="fixed inset-0 z-50">

          {/* BACKDROP */}

          <button
            onClick={() => setSelectedPatient(null)}
            className="absolute inset-0 h-full w-full bg-slate-900/30 backdrop-blur-sm"
            aria-label="Close patient profile"
          />


          {/* DRAWER */}

          <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Patient profile
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {selectedPatient.name}
                </h2>

              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>


            {/* PROFILE HEADER */}

            <div className="mt-6 flex items-center gap-4 rounded-3xl bg-slate-50 p-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">

                <User
                  size={23}
                  className="text-teal-700"
                />

              </div>

              <div>

                <p className="font-semibold text-slate-900">
                  {selectedPatient.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Patient ID: P-1024
                </p>

              </div>

            </div>


            {/* =================================================
                PROFILE DETAILS
            ================================================= */}

            <div className="mt-6 space-y-4">


              {/* DEMOGRAPHICS */}

              <div className="rounded-2xl border border-slate-200 p-4">

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Demographics
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4">

                  <div>

                    <p className="text-xs text-slate-400">
                      Age
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedPatient.age} years
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-emerald-600">
                      {selectedPatient.status}
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CLINICAL INFORMATION
              ================================================= */}

              <div className="rounded-2xl border border-slate-200 p-4">

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Clinical information
                </p>


                {/* PRIMARY CONDITION */}

                <div className="mt-4">

                  <p className="text-xs text-slate-400">
                    Primary condition
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedPatient.condition}
                  </p>

                </div>


                {/* PATIENT ISSUES */}

                <div className="mt-5">

                  <p className="text-xs text-slate-400">
                    Current symptoms / issues
                  </p>

                  <div className="mt-3 space-y-2">

                    {selectedPatient.issues?.map((issue) => (

                      <div
                        key={issue}
                        className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
                      >

                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-50">

                          <Activity
                            size={13}
                            className="text-teal-600"
                          />

                        </span>

                        <span className="text-sm font-medium text-slate-700">
                          {issue}
                        </span>

                      </div>

                    ))}

                  </div>

                </div>


                {/* PRIORITY */}

                <div className="mt-5">

                  <p className="text-xs text-slate-400">
                    Priority
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedPatient.priority}
                  </p>

                </div>

              </div>


              {/* =================================================
                  LAST CONSULTATION
              ================================================= */}

              <div className="rounded-2xl border border-slate-200 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">

                    <CalendarDays
                      size={18}
                      className="text-teal-600"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Last consultation
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      Today
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                START CONSULTATION
            ================================================= */}

    
             <Link
              to="/consultation"
              state={{ patient: selectedPatient }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700"
            >
               <Activity size={16} />
                Start Consultation
               </Link>

          </aside>

        </div>

      )}

    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100" />
    </label>
  );
}