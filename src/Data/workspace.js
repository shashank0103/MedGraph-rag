import {
  Activity,
  Brain,
  FileText,
  LayoutDashboard,
  Network,
  Stethoscope,
  Users,
} from "lucide-react";


// =========================================================
// NAVIGATION
// =========================================================

export const navigationItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Patients",
    icon: Users,
    path: "/patients",
  },
  {
    label: "Consultation",
    icon: Stethoscope,
    path: "/consultation",
  },
  {
    label: "Knowledge Graph",
    icon: Network,
    path: "/knowledge-graph",
  },
  {
    label: "Reports",
    icon: FileText,
    path: "/reports",
  },
];


// =========================================================
// PAGE META
// =========================================================

export const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
    description: "Overview of your clinical AI workspace.",
  },

  "/patients": {
    title: "Patients",
    description: "Track active cases, priorities, and patient status.",
  },

  "/consultation": {
    title: "Consultation",
    description:
      "Capture symptoms, reasoning, and next steps in one view.",
  },

  "/knowledge-graph": {
    title: "Knowledge Graph",
    description:
      "Visualize clinical relationships and evidence links.",
  },

  "/reports": {
    title: "Reports",
    description:
      "Review generated reports and their delivery status.",
  },
};


// =========================================================
// DASHBOARD STATS
// =========================================================

export const dashboardStats = [
  {
    title: "Total Patients",
    value: "124",
    change: "+12%",
    icon: Users,
    tone: "teal",
  },

  {
    title: "Consultations",
    value: "48",
    change: "+8%",
    icon: Activity,
    tone: "sky",
  },

  {
    title: "Reports Generated",
    value: "36",
    change: "+15%",
    icon: FileText,
    tone: "amber",
  },

  {
    title: "KG Updates",
    value: "27",
    change: "+6%",
    icon: Brain,
    tone: "emerald",
  },
];


// =========================================================
// PATIENTS
// =========================================================
// Mock/demo patient data for the frontend.
// This is not real patient information.
// =========================================================

export const patientRows = [
  {
    name: "Aarav Mehta",
    age: 42,
    condition: "Hypertension",
    conditions: ["Hypertension"],
    medications: ["Amlodipine"],
    status: "Monitoring",
    priority: "Medium",

    issues: [
      "Occasional headache",
      "Mild dizziness",
      "Elevated blood pressure",
    ],
  },

  {
    name: "Maya Fernandez",
    age: 29,
    condition: "Migraine",
    conditions: ["Migraine"],
    medications: ["Sumatriptan"],
    status: "Action required",
    priority: "High",

    issues: [
      "Recurring headache",
      "Sensitivity to light",
      "Occasional nausea",
    ],
  },

  {
    name: "Noah Patel",
    age: 61,
    condition: "Type 2 Diabetes",
    conditions: ["Type 2 Diabetes"],
    medications: ["Metformin"],
    status: "Stable",
    priority: "Low",

    issues: [
      "Increased thirst",
      "Fatigue",
      "Elevated blood glucose",
    ],
  },

  {
    name: "Sara Khan",
    age: 54,
    condition: "Lumbar Radiculopathy",
    conditions: ["Lumbar Radiculopathy"],
    medications: ["Gabapentin"],
    status: "Review pending",
    priority: "Medium",

    issues: [
      "Lower back pain",
      "Radiating leg pain",
      "Lower-limb numbness",
    ],
  },
];

// =========================================================
// CONSULTATION PIPELINE
// =========================================================

export const consultationSteps = [
  "Clinical information",
  "Feature extraction",
  "Knowledge graph matching",
  "EHR retrieval",
  "AI reasoning",
  "Clinical assessment",
];


// =========================================================
// REPORTS
// =========================================================

export const reportRows = [
  {
    title: "Hypertension follow-up",
    owner: "Dr. Shashank",
    status: "Signed",
    updated: "2h ago",
  },

  {
    title: "Migraine assessment",
    owner: "AI Assistant",
    status: "Draft",
    updated: "Today",
  },

  {
    title: "Diabetes monitoring report",
    owner: "Nurse team",
    status: "Pending",
    updated: "Yesterday",
  },

  {
    title: "Lumbar radiculopathy review",
    owner: "Dr. Shashank",
    status: "Signed",
    updated: "3d ago",
  },
];


// =========================================================
// KNOWLEDGE GRAPH
// =========================================================

export const knowledgeNodes = [
  {
    label: "Symptoms",
    detail:
      "Headache, dizziness, fatigue, lower back pain, radiating leg pain, and numbness.",
  },

  {
    label: "Conditions",
    detail:
      "Hypertension, migraine, type 2 diabetes, and lumbar radiculopathy.",
  },

  {
    label: "Medications",
    detail:
      "Common medications associated with the mock clinical records.",
  },

  {
    label: "Evidence",
    detail:
      "Patient history, laboratory results, clinical notes, and retrieved medical evidence.",
  },
];