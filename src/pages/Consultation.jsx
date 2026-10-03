import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  Check,
  ChevronDown,
  FileText,
  Info,
  Search,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

const defaultPatient = {
  id: "P-1024",
  name: "Suresh Kumar",
  age: 52,
  gender: "Male",
  conditions: ["Diabetes", "Hypertension"],
  medications: ["Metformin", "Amlodipine"],
  allergies: ["No known allergies"],
};

const defaultSymptoms = [
  "Lower back pain",
  "Radiating leg pain",
  "Numbness",
];

const diagnoses = [
  {
    name: "Sciatica",
    relevance: "High relevance",
    score: "87%",
    description:
      "The reported symptoms are consistent with a nerve-related pain pattern affecting the lower back and leg.",
    features: [
      "Lower back pain",
      "Radiating leg pain",
      "Lower-limb numbness",
    ],
  },
  {
    name: "Lumbar Canal Stenosis",
    relevance: "Moderate relevance",
    score: "72%",
    description:
      "The symptoms may also be associated with narrowing of the lumbar spinal canal.",
    features: [
      "Lower back pain",
      "Leg symptoms",
      "Activity-related discomfort",
    ],
  },
];

const pipelineSteps = [
  "Clinical information",
  "Feature extraction",
  "Knowledge graph matching",
  "EHR retrieval",
  "AI reasoning",
  "Clinical assessment",
];

const followUpQuestions = [
  {
    id: 1,
    question: "Does the pain worsen while walking?",
  },
  {
    id: 2,
    question: "Does the pain improve when sitting?",
  },
  {
    id: 3,
    question: "Does the patient experience weakness in the legs?",
  },
];

export default function Consultation() {
  const location = useLocation();
  const selectedPatient = location.state?.patient;

  const patient = {
    ...defaultPatient,
    ...(selectedPatient || {}),
  };

  const [description, setDescription] = useState(
    "Patient has been experiencing lower back pain radiating to the right leg for approximately three weeks, accompanied by numbness."
  );

  const [symptoms, setSymptoms] = useState(
    selectedPatient?.issues || defaultSymptoms
  );
  const [severity, setSeverity] = useState(7);
  const [duration, setDuration] = useState("3 weeks");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  const [answers, setAnswers] = useState({});
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [showEvidence, setShowEvidence] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleAnalyze = () => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setActiveStep(0);
    setAnswers({});
    setSelectedDiagnosis(null);

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep += 1;

      if (currentStep < pipelineSteps.length) {
        setActiveStep(currentStep);
      } else {
        clearInterval(interval);

        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          setActiveStep(pipelineSteps.length);
        }, 500);
      }
    }, 650);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const addSymptom = () => {
    const newSymptom = window.prompt("Enter a symptom:");

    if (newSymptom && newSymptom.trim()) {
      setSymptoms((previous) => [...previous, newSymptom.trim()]);
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSymptoms((previous) =>
      previous.filter((symptom) => symptom !== symptomToRemove)
    );
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              Consultation
            </h1>

            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isAnalyzing
                  ? "bg-amber-50 text-amber-700"
                  : analysisComplete
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isAnalyzing
                    ? "bg-amber-500 animate-pulse"
                    : analysisComplete
                      ? "bg-emerald-500"
                      : "bg-slate-400"
                }`}
              />

              {isAnalyzing
                ? "Analyzing"
                : analysisComplete
                  ? "Analysis complete"
                  : "Ready"}
            </div>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Analyze patient information using KG-enhanced clinical reasoning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <FileText size={16} />
            Save consultation
          </button>
        </div>
      </div>

      {/* =====================================================
          PATIENT SELECTOR
      ====================================================== */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <Activity size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Selected patient
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {patient.name}
              </h2>

              <p className="text-sm text-slate-500">
                {patient.age} years • {patient.gender} • {patient.id}
              </p>
            </div>

          </div>

          <button
            type="button"
            className="inline-flex items-center justify-between gap-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Change patient
            <ChevronDown size={16} />
          </button>

        </div>
      </section>

      {/* =====================================================
          MAIN INPUT AREA
      ====================================================== */}
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">

        {/* LEFT */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Clinical Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the patient's symptoms, history, or relevant clinical
              information.
            </p>
          </div>

          {/* Description */}
          <div className="mt-6">

            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800">
                Patient description
              </label>

              <span className="text-xs text-slate-400">
                Natural language supported
              </span>
            </div>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
              placeholder="Describe the patient's symptoms and medical history..."
            />

          </div>

          {/* Symptoms */}
          <div className="mt-6">

            <div className="mb-3 flex items-center justify-between">

              <label className="text-sm font-semibold text-slate-800">
                Symptoms
              </label>

              <button
                type="button"
                onClick={addSymptom}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                + Add symptom
              </button>

            </div>

            <div className="flex flex-wrap gap-2">

              {symptoms.map((symptom) => (
                <div
                  key={symptom}
                  className="inline-flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700"
                >
                  {symptom}

                  <button
                    type="button"
                    onClick={() => removeSymptom(symptom)}
                    className="rounded-full p-0.5 hover:bg-teal-100"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}

            </div>
          </div>

          {/* Severity + Duration */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            {/* Severity */}
            <div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800">
                  Pain severity
                </label>

                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {severity}/10
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                value={severity}
                onChange={(event) =>
                  setSeverity(Number(event.target.value))
                }
                className="mt-5 w-full accent-teal-600"
              />

              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>No pain</span>
                <span>Severe</span>
              </div>

            </div>

            {/* Duration */}
            <div>

              <label className="text-sm font-semibold text-slate-800">
                Duration
              </label>

              <div className="relative mt-3">

                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                >
                  <option>1 day</option>
                  <option>3 days</option>
                  <option>1 week</option>
                  <option>2 weeks</option>
                  <option>3 weeks</option>
                  <option>1 month</option>
                  <option>More than 1 month</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>

            </div>

          </div>

          {/* File Upload */}
          <div className="mt-6">

            <label
              htmlFor="ehr-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center transition hover:border-teal-300 hover:bg-teal-50/40"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                <Upload size={18} />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-700">
                Upload EHR or medical report
              </p>

              <p className="mt-1 text-xs text-slate-400">
                PDF, TXT or CSV
              </p>

              <input
                id="ehr-upload"
                type="file"
                accept=".pdf,.txt,.csv"
                className="hidden"
                onChange={handleFileUpload}
              />

            </label>

            {uploadedFile && (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">

                <div className="flex items-center gap-3">

                  <FileText size={18} className="text-teal-600" />

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {uploadedFile.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  <X size={16} />
                </button>

              </div>
            )}

          </div>

          {/* Analyze */}
          <div className="mt-6 flex justify-end">

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <Sparkles size={17} />

              {isAnalyzing
                ? "Analyzing patient..."
                : "Analyze patient"}
            </button>

          </div>

        </section>

        {/* RIGHT - PATIENT SUMMARY */}
        <aside className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Activity size={18} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Patient Summary
              </h2>

              <p className="text-xs text-slate-400">
                Current clinical context
              </p>
            </div>

          </div>

          <div className="mt-6 space-y-5">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Existing conditions
              </p>

              <div className="mt-2 flex flex-wrap gap-2">

                {patient.conditions.map((condition) => (
                  <span
                    key={condition}
                    className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {condition}
                  </span>
                ))}

              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Current medications
              </p>

              <div className="mt-2 space-y-2">

                {patient.medications.map((medication) => (
                  <div
                    key={medication}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                    {medication}
                  </div>
                ))}

              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Allergies
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">

                <Check size={15} className="text-emerald-500" />

                {patient.allergies[0]}

              </div>
            </div>

          </div>

          <div className="mt-7 rounded-2xl border border-amber-100 bg-amber-50 p-4">

            <div className="flex gap-3">

              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Clinical decision support
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  AI-generated information should be reviewed by a qualified
                  healthcare professional.
                </p>
              </div>

            </div>

          </div>

        </aside>

      </div>

      {/* =====================================================
          ANALYSIS PIPELINE
      ====================================================== */}
      {(isAnalyzing || analysisComplete) && (
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Analysis Pipeline
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                MedGraph-RAG clinical reasoning workflow
              </p>
            </div>

            {analysisComplete && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <Check size={14} />
                Complete
              </span>
            )}

          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">

            {pipelineSteps.map((step, index) => {

              const completed = activeStep > index;
              const current = activeStep === index;

              return (
                <div
                  key={step}
                  className={`rounded-2xl border p-4 transition ${
                    completed
                      ? "border-emerald-100 bg-emerald-50/60"
                      : current
                        ? "border-teal-200 bg-teal-50/60"
                        : "border-slate-200 bg-slate-50"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                        completed
                          ? "bg-emerald-500 text-white"
                          : current
                            ? "bg-teal-600 text-white"
                            : "bg-white text-slate-400"
                      }`}
                    >
                      {completed ? (
                        <Check size={17} />
                      ) : (
                        `0${index + 1}`
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {step}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {completed
                          ? "Completed"
                          : current
                            ? "Processing..."
                            : "Waiting"}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </section>
      )}

      {/* =====================================================
          AI ANALYSIS
      ====================================================== */}
      {analysisComplete && (
        <>
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  AI Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Potential conditions identified from the available clinical
                  information.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
                <Sparkles size={14} />
                KG-enhanced reasoning
              </div>

            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">

              {diagnoses.map((diagnosis, index) => (
                <div
                  key={diagnosis.name}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-teal-200 hover:shadow-md"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Possible diagnosis 0{index + 1}
                      </span>

                      <h3 className="mt-2 text-xl font-semibold text-slate-900">
                        {diagnosis.name}
                      </h3>
                    </div>

                    <div className="text-right">

                      <span className="rounded-lg bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-700">
                        {diagnosis.relevance}
                      </span>

                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {diagnosis.score}
                      </p>

                    </div>

                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {diagnosis.description}
                  </p>

                  <div className="mt-5">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Supporting features
                    </p>

                    <div className="mt-3 space-y-2">

                      {diagnosis.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <Check
                            size={15}
                            className="text-emerald-500"
                          />

                          {feature}
                        </div>
                      ))}

                    </div>

                  </div>

                  <div className="mt-5 flex gap-2">

                    <Link
                      to="/knowledge-graph"
                      state={{
                        patient,
                        diagnosis,
                        symptoms,
                      }}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View evidence
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDiagnosis(diagnosis);
                        setShowEvidence(true);
                      }}
                      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Why?
                    </button>

                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* =====================================================
              FOLLOW-UP QUESTIONS
          ====================================================== */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Search size={18} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Follow-up Questions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Additional information may help differentiate between the
                  possible conditions.
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-3">

              {followUpQuestions.map((item) => {

                const answer = answers[item.id];

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 transition ${
                      answer
                        ? "border-emerald-100 bg-emerald-50/40"
                        : "border-slate-200 bg-slate-50/50"
                    }`}
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600 shadow-sm">
                          {item.id}
                        </div>

                        <p className="text-sm font-medium text-slate-700">
                          {item.question}
                        </p>

                      </div>

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() => handleAnswer(item.id, "Yes")}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            answer === "Yes"
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          Yes
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAnswer(item.id, "No")}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            answer === "No"
                              ? "bg-slate-700 text-white"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          No
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

            {Object.keys(answers).length > 0 && (
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-teal-50 px-4 py-3">

                <div className="flex items-center gap-2 text-sm text-teal-700">
                  <Check size={16} />
                  Follow-up information recorded.
                </div>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  Update assessment
                </button>

              </div>
            )}

          </section>

          {/* =====================================================
              CLINICAL GUIDANCE
          ====================================================== */}
          <section className="grid gap-6 lg:grid-cols-2">

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Activity size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Treatment Guidance
                  </h2>

                  <p className="text-xs text-slate-400">
                    Context-aware clinical information
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-3">

                {[
                  "Consider appropriate clinical evaluation.",
                  "Review the patient's current symptoms and functional limitations.",
                  "Consider physical therapy or activity modification where clinically appropriate.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-slate-50 p-3"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-teal-600"
                    />

                    <p className="text-sm leading-5 text-slate-600">
                      {item}
                    </p>
                  </div>
                ))}

              </div>

            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Info size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Evidence Summary
                  </h2>

                  <p className="text-xs text-slate-400">
                    Retrieved clinical context
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-3">

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Similar EHR records
                    </span>

                    <span className="font-semibold text-slate-900">
                      3
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Knowledge Graph matches
                    </span>

                    <span className="font-semibold text-slate-900">
                      12
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Clinical features
                    </span>

                    <span className="font-semibold text-slate-900">
                      {symptoms.length}
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </section>
        </>
      )}

      {/* =====================================================
          EVIDENCE SIDE DRAWER
      ====================================================== */}
      {showEvidence && selectedDiagnosis && (
        <div className="fixed inset-0 z-50">

          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close evidence"
            onClick={() => setShowEvidence(false)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  AI reasoning
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {selectedDiagnosis.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedDiagnosis.relevance}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEvidence(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Reasoning flow */}
            <div className="mt-8">

              <p className="text-sm font-semibold text-slate-900">
                Why was this suggested?
              </p>

              <div className="mt-4 space-y-3">

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                    Patient features
                  </p>

                  <div className="mt-3 space-y-2">

                    {symptoms.map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <Check size={15} className="text-teal-600" />
                        {symptom}
                      </div>
                    ))}

                  </div>
                </div>

                <div className="flex justify-center text-slate-300">
                  ↓
                </div>

                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-600">
                    Knowledge Graph
                  </p>

                  <p className="mt-2 text-sm leading-6 text-teal-800">
                    Patient features were matched against related clinical
                    features and disease relationships.
                  </p>

                </div>

                <div className="flex justify-center text-slate-300">
                  ↓
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600">
                    Retrieved evidence
                  </p>

                  <div className="mt-3 space-y-2">

                    {[
                      "EHR record #1042 — high similarity",
                      "EHR record #0831 — relevant symptom pattern",
                      "EHR record #2918 — supporting clinical context",
                    ].map((record) => (
                      <div
                        key={record}
                        className="rounded-xl bg-white p-3 text-sm text-slate-600"
                      >
                        {record}
                      </div>
                    ))}

                  </div>

                </div>

              </div>

            </div>

            {/* Difference */}
            <div className="mt-8">

              <p className="text-sm font-semibold text-slate-900">
                Supporting features
              </p>

              <div className="mt-3 space-y-2">

                {selectedDiagnosis.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Check size={14} />
                    </div>

                    <span className="text-sm text-slate-700">
                      {feature}
                    </span>
                  </div>
                ))}

              </div>

            </div>

            <div className="mt-8 rounded-2xl bg-amber-50 p-4">

              <div className="flex gap-3">

                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <p className="text-xs leading-5 text-amber-700">
                  This visualization represents AI-assisted reasoning for the
                  project demonstration. It should not be interpreted as a
                  definitive medical diagnosis.
                </p>

              </div>

            </div>

          </aside>

        </div>
      )}

    </div>
  );
}