import { getStoredPatients } from "./clinicalStore";

const USER_STORAGE_KEY = "medgraph-current-user";

export const doctorUser = {
  id: "DR-001",
  name: "Dr. Shashank",
  role: "doctor",
  subtitle: "Healthcare Provider",
};

export function getPatientUser(patient) {
  return {
    id: patient.id || `P-${patient.name.replace(/\s+/g, "-").toLowerCase()}`,
    name: patient.name,
    role: "patient",
    subtitle: "Patient",
    patient,
  };
}

export function getCurrentUser() {
  try {
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : doctorUser;
  } catch {
    return doctorUser;
  }
}

export function signInAsDoctor() {
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(doctorUser));
  return doctorUser;
}

export function signInAsPatient(patientName) {
  const patients = getStoredPatients();
  const patient = patients.find((item) => item.name === patientName) || patients[0];
  const user = getPatientUser(patient);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function signOut() {
  window.localStorage.removeItem(USER_STORAGE_KEY);
}