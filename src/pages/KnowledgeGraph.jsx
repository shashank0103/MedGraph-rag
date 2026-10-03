import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Activity,
  Plus,
  Brain,
  ChevronRight,
  CircleAlert,
  FileText,
  HeartPulse,
  Link2,
  Pill,
  Search,
  User,
  X,
} from "lucide-react";

import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
} from "reactflow";

import "reactflow/dist/style.css";
import { getCurrentUser } from "../Data/auth";

const defaultPatient = {
  id: "P-1024",
  name: "Suresh Kumar",
  age: 52,
  gender: "Male",
};

const defaultDiagnosis = {
  name: "Sciatica",
  relevance: "High relevance",
  description:
    "The reported symptoms are consistent with a nerve-related pain pattern affecting the lower back and leg.",
};

const defaultSymptoms = ["Lower Back Pain", "Radiating Leg Pain", "Leg Numbness"];

function getConditionLabel(diagnosisName) {
  const normalized = (diagnosisName || "").toLowerCase();

  if (normalized.includes("migraine")) {
    return "Neurological condition";
  }

  if (normalized.includes("sciatica") || normalized.includes("stenosis")) {
    return "Nerve-related condition";
  }

  return "Clinical condition";
}

function buildGraphData(patient, diagnosis, symptoms) {
  const safePatient = patient || defaultPatient;
  const safeDiagnosis = diagnosis || {
    ...defaultDiagnosis,
    name: safePatient.condition || defaultDiagnosis.name,
  };
  const safeSymptoms = symptoms?.length ? symptoms : defaultSymptoms;

  const conditions = safePatient.conditions?.length
    ? safePatient.conditions
    : safePatient.condition
      ? [safePatient.condition]
      : [];

  const medications = safePatient.medications?.length
    ? safePatient.medications
    : [];

  const symptomPositions = [80, 350, 620];

  const symptomNodes = safeSymptoms.map((symptom, index) => ({
    id: `symptom-${index}`,
    type: "clinical",
    position: { x: symptomPositions[index] ?? 350, y: 200 },
    data: {
      label: symptom,
      type: "Symptom",
      icon: Activity,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  }));

  const conditionNodes = conditions.map((condition, index) => ({
    id: `condition-${index}`,
    type: "clinical",
    position: { x: 80 + index * 270, y: 390 },
    data: {
      label: condition,
      type: "Condition",
      icon: HeartPulse,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  }));

  const medicationNodes = medications.map((medication, index) => ({
    id: `medication-${index}`,
    type: "clinical",
    position: { x: 80 + index * 270, y: 570 },
    data: {
      label: medication,
      type: "Medication",
      icon: Pill,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  }));

  const evidenceNode = {
    id: "evidence",
    type: "clinical",
    position: { x: 620, y: 390 },
    data: {
      label: "Clinical Evidence",
      type: "Evidence",
      icon: FileText,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  };

  const nodes = [
    {
      id: "patient",
      type: "clinical",
      position: { x: 350, y: 40 },
      data: {
        label: safePatient.name,
        type: "Patient",
        icon: User,
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
      },
    },
    ...symptomNodes,
    {
      id: "diagnosis",
      type: "clinical",
      position: { x: 350, y: 390 },
      data: {
        label: safeDiagnosis.name,
        type: "Diagnosis",
        icon: Brain,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
      },
    },
    ...conditionNodes,
    ...medicationNodes,
    evidenceNode,
  ];

  const edges = [
    ...symptomNodes.map((node) => ({
      id: `patient-${node.id}`,
      source: "patient",
      target: node.id,
      label: "reports",
      animated: true,
    })),
    ...symptomNodes.map((node) => ({
      id: `${node.id}-diagnosis`,
      source: node.id,
      target: "diagnosis",
      label: "supports",
    })),
    ...conditionNodes.map((node) => ({
      id: `diagnosis-${node.id}`,
      source: "diagnosis",
      target: node.id,
      label: "associated with",
    })),
    ...conditionNodes.map((node) => ({
      id: `patient-${node.id}`,
      source: "patient",
      target: node.id,
      label: "has condition",
    })),
    ...conditionNodes.flatMap((conditionNode) =>
      medicationNodes.map((medicationNode) => ({
        id: `${conditionNode.id}-${medicationNode.id}`,
        source: conditionNode.id,
        target: medicationNode.id,
        label: "treated with",
      }))
    ),
    ...medicationNodes.map((node) => ({
      id: `patient-${node.id}`,
      source: "patient",
      target: node.id,
      label: "takes",
    })),
    {
      id: "diagnosis-evidence",
      source: "diagnosis",
      target: evidenceNode.id,
      label: "supported by",
    },
  ];

  return { nodes, edges };
}

function ClinicalNode({ data }) {
  const Icon = data.icon;

  return (
    <div
      className={`min-w-[180px] rounded-2xl border bg-white px-4 py-3 shadow-lg ${
        data.selected ? "border-teal-500 ring-2 ring-teal-100" : "border-slate-200"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-teal-500"
      />

      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${data.iconBg}`}>
          <Icon size={18} className={data.iconColor} />
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {data.type}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{data.label}</p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-teal-500"
      />
    </div>
  );
}

const nodeTypes = { clinical: ClinicalNode };

export default function KnowledgeGraph() {
  const location = useLocation();
  const routeState = location.state || {};
  const currentUser = getCurrentUser();
  const activePatient = routeState.patient || currentUser.patient;

  const graphData = useMemo(
    () => buildGraphData(activePatient, routeState.diagnosis, routeState.symptoms),
    [activePatient, routeState.diagnosis, routeState.symptoms]
  );

  const [nodes, setNodes] = useState(graphData.nodes);
  const [edges, setEdges] = useState(graphData.edges);
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [showUpdatePanel, setShowUpdatePanel] = useState(false);
  const [newNodeType, setNewNodeType] = useState("Condition");
  const [newNodeLabel, setNewNodeLabel] = useState("");

  useEffect(() => {
    setNodes(graphData.nodes);
    setEdges(graphData.edges);
    setSelectedNode(null);
  }, [graphData]);

  const filteredNodes = useMemo(() => {
    if (!search.trim()) {
      return nodes;
    }

    return nodes.filter((node) =>
      node.data.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [nodes, search]);

  const filteredNodeIds = useMemo(
    () => new Set(filteredNodes.map((node) => node.id)),
    [filteredNodes]
  );

  const filteredEdges = useMemo(
    () =>
      edges.filter(
        (edge) => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
      ),
    [edges, filteredNodeIds]
  );

  const handleAddNode = (event) => {
    event.preventDefault();

    const label = newNodeLabel.trim();
    if (!label) return;

    const typeConfig = {
      Symptom: {
        icon: Activity,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        relationship: "reports",
      },
      Condition: {
        icon: HeartPulse,
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
        relationship: "has condition",
      },
      Medication: {
        icon: Pill,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        relationship: "takes",
      },
      Evidence: {
        icon: FileText,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        relationship: "supported by",
      },
    };

    const config = typeConfig[newNodeType];
    const nodeId = `${newNodeType.toLowerCase()}-${Date.now()}`;
    const sameTypeNodes = nodes.filter((node) => node.data.type === newNodeType);

    const newNode = {
      id: nodeId,
      type: "clinical",
      position: {
        x: 80 + (sameTypeNodes.length % 3) * 270,
        y: 200 + Math.floor(sameTypeNodes.length / 3) * 180,
      },
      data: {
        label,
        type: newNodeType,
        icon: config.icon,
        iconBg: config.iconBg,
        iconColor: config.iconColor,
      },
    };

    const targetId = newNodeType === "Evidence" ? "diagnosis" : "patient";

    const newEdge = {
      id: `${targetId}-${nodeId}`,
      source: targetId,
      target: nodeId,
      label: config.relationship,
      animated: newNodeType === "Symptom",
    };

    setNodes((currentNodes) => [...currentNodes, newNode]);
    setEdges((currentEdges) => [...currentEdges, newEdge]);
    setNewNodeLabel("");
    setShowUpdatePanel(false);
    setSelectedNode(newNode);
  };

  const legend = [
    { label: "Patient", icon: User, style: "bg-teal-50 text-teal-600" },
    { label: "Symptom", icon: Activity, style: "bg-blue-50 text-blue-600" },
    { label: "Diagnosis", icon: Brain, style: "bg-violet-50 text-violet-600" },
    { label: "Condition", icon: HeartPulse, style: "bg-rose-50 text-rose-600" },
    { label: "Medication", icon: Pill, style: "bg-emerald-50 text-emerald-600" },
  ];

  const handleNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
              <Link2 className="text-teal-600" size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Knowledge Graph</h1>
              <p className="mt-1 text-sm text-slate-500">
                Explore clinical relationships, concepts, and supporting evidence.
              </p>
              {routeState.patient && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">
                    {routeState.patient.name}
                  </span>
                  {routeState.diagnosis && (
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">
                      {routeState.diagnosis.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search graph..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowUpdatePanel((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            <Plus size={17} />
            Update graph
          </button>
        </div>
      </div>

      {showUpdatePanel && (
        <section className="rounded-3xl border border-teal-100 bg-teal-50/60 p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Update knowledge graph</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Add a clinical node to the current patient graph. The change is stored in React state for this frontend session.
              </p>
            </div>

            <form onSubmit={handleAddNode} className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <select
                value={newNodeType}
                onChange={(e) => setNewNodeType(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="Condition">Condition</option>
                <option value="Medication">Medication</option>
                <option value="Symptom">Symptom</option>
                <option value="Evidence">Evidence</option>
              </select>

              <input
                type="text"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder={`Enter ${newNodeType.toLowerCase()} name...`}
                className="min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:w-64"
              />

              <button
                type="submit"
                disabled={!newNodeLabel.trim()}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add node
              </button>
            </form>
          </div>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Clinical Relationship Map
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Patient symptoms, diagnoses, conditions, and medications
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Graph synchronized
              </div>
            </div>
          </div>

          <div className="h-[650px]">
            <ReactFlow
              nodes={filteredNodes}
              edges={filteredEdges}
              nodeTypes={nodeTypes}
              onNodeClick={handleNodeClick}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              attributionPosition="bottom-left"
            >
              <Background gap={20} size={1} />
              <Controls />
            </ReactFlow>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Graph overview
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-2xl font-semibold text-slate-900">
                  {nodes.length}
                </p>
                <p className="mt-1 text-xs text-slate-500">Clinical nodes</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-2xl font-semibold text-slate-900">
                  {edges.length}
                </p>
                <p className="mt-1 text-xs text-slate-500">Relationships</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Node types
            </p>

            <div className="mt-4 space-y-3">
              {legend.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.style}`}>
                      <Icon size={16} />
                    </div>

                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Selected node
              </p>

              {selectedNode && (
                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {selectedNode ? (
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                    {(() => {
                      const Icon = selectedNode.data.icon;
                      return <Icon size={19} className="text-teal-600" />;
                    })()}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedNode.data.label}
                    </p>
                    <p className="text-xs text-slate-500">{selectedNode.data.type}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">
                      Relationship information
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      This node is connected to the consultation patient,
                      symptoms, diagnosis, and supporting evidence.
                    </p>
                  </div>

                  <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50">
                    View related evidence
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <CircleAlert size={17} className="mt-0.5 text-slate-400" />
                  <p className="text-sm leading-6 text-slate-500">
                    Select a node in the graph to inspect its clinical relationships
                    and supporting information.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4">
        <FileText size={18} className="mt-0.5 text-teal-600" />
        <div>
          <p className="text-sm font-semibold text-teal-900">
            Explainable clinical reasoning
          </p>
          <p className="mt-1 text-sm leading-6 text-teal-800">
            The graph reflects the current consultation state, and new clinical nodes can be
            added directly from the Update graph panel. Changes remain in React state until
            the page is refreshed.
          </p>
        </div>
      </div>
    </div>
  );
}