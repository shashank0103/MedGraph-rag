import { patientRows } from "./workspace";

const PATIENTS_STORAGE_KEY = "medgraph-patients";

export function getStoredPatients() {
  try {
    const storedPatients = window.localStorage.getItem(PATIENTS_STORAGE_KEY);
    const parsedPatients = storedPatients ? JSON.parse(storedPatients) : null;

    return Array.isArray(parsedPatients) ? parsedPatients : patientRows;
  } catch {
    return patientRows;
  }
}

export function savePatients(patients) {
  window.localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
}

export function createPatient(form) {
  const conditions = form.conditions
    .split(",")
    .map((condition) => condition.trim())
    .filter(Boolean);
  const issues = form.issues
    .split(",")
    .map((issue) => issue.trim())
    .filter(Boolean);
  const medications = form.medications
    .split(",")
    .map((medication) => medication.trim())
    .filter(Boolean);

  return {
    id: `P-${Date.now().toString().slice(-6)}`,
    name: form.name.trim(),
    age: Number(form.age),
    gender: form.gender,
    condition: conditions[0] || "General follow-up",
    conditions,
    medications,
    issues,
    status: "New",
    priority: form.priority,
  };
}

export function retrieveClinicalContext(question, patients = getStoredPatients()) {
  const normalizedQuestion = question.toLowerCase();
  const terms = normalizedQuestion.split(/\s+/).filter((term) => term.length > 2);

  const matches = patients
    .map((patient) => {
      const searchableText = [
        patient.name,
        patient.condition,
        patient.status,
        patient.priority,
        ...(patient.conditions || []),
        ...(patient.medications || []),
        ...(patient.issues || []),
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce(
        (total, term) => total + (searchableText.includes(term) ? 1 : 0),
        0
      );

      return { patient, score };
    })
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 3);

  return matches.map(({ patient }) => patient);
}

export function answerClinicalQuestion(question, patients = getStoredPatients()) {
  const normalizedQuestion = question.toLowerCase();
  const context = retrieveClinicalContext(question, patients);

  if (!context.length) {
    if (patients.length === 1) {
      const patient = patients[0];
      const availableTopics = [
        patient.condition,
        ...(patient.issues || []),
        ...(patient.medications || []),
      ]
        .filter(Boolean)
        .join(", ");

      return {
        answer: `${patient.name}, I could not find that information in your recorded health profile. I can help you review ${availableTopics || "the information currently recorded in your profile"}.`,
        sources: [],
      };
    }

    return {
      answer:
        "I could not find a matching patient or clinical fact in the current knowledge graph. Try a patient name, condition, symptom, or medication.",
      sources: [],
    };
  }

  const patient = context[0];
  const symptoms = patient.issues?.join(", ") || "no symptoms recorded";
  const medications = patient.medications?.join(", ") || "no medications recorded";

  if (normalizedQuestion.includes("medication") || normalizedQuestion.includes("medicine")) {
    return {
      answer: `${patient.name} is recorded with ${medications}. This is a record lookup, not a medication recommendation.`,
      sources: context,
    };
  }

  if (normalizedQuestion.includes("symptom") || normalizedQuestion.includes("issue")) {
    return {
      answer: `${patient.name}'s recorded symptoms are ${symptoms}.`,
      sources: context,
    };
  }

  return {
    answer: `${patient.name} is a ${patient.age}-year-old patient with ${patient.condition}. Status: ${patient.status}; priority: ${patient.priority}. Recorded symptoms: ${symptoms}.`,
    sources: context,
  };
}