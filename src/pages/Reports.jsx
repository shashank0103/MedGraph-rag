import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { reportRows } from "../Data/workspace";
import { getCurrentUser } from "../Data/auth";

export default function Reports() {
  const user = getCurrentUser();
  const isPatient = user.role === "patient";
  const visibleReports = isPatient
    ? reportRows.filter((report) => {
        const patientTerms = [user.patient.name, user.patient.condition, ...(user.patient.conditions || [])]
          .join(" ")
          .toLowerCase();
        return report.title.toLowerCase().split(" ").some((term) => patientTerms.includes(term));
      })
    : reportRows;
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState("All");

  const filteredReports = useMemo(() => {
    return visibleReports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.owner.toLowerCase().includes(search.toLowerCase()) ||
        report.status.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || report.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter, visibleReports]);

  const totalReports = visibleReports.length;

  const signedReports = visibleReports.filter(
    (report) => report.status === "Signed"
  ).length;

  const draftReports = visibleReports.filter(
    (report) => report.status === "Draft"
  ).length;

  const pendingReports = visibleReports.filter(
    (report) => report.status === "Pending"
  ).length;

  const downloadReport = (report) => {
    const reportText = [
      "MedGraph-RAG Clinical Report",
      "============================",
      `Report: ${report.title}`,
      `Owner: ${report.owner}`,
      `Status: ${report.status}`,
      `Updated: ${report.updated}`,
      "",
      "This report was exported from the MedGraph-RAG clinical workspace.",
    ].join("\n");
    const file = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Signed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "Draft":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "Pending":
        return "bg-sky-50 text-sky-700 border-sky-100";

      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <FileText size={18} />
              </div>

              <span className="text-sm font-semibold text-teal-700">
                Clinical Documentation
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reports
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {isPatient ? "Reports shared with you by your care team." : "Review, track, and manage generated clinical reports."}
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700"
          >
            <Sparkles size={17} />
            Generate Report
          </button>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FileText}
            label="Total Reports"
            value={totalReports}
            description="All generated reports"
          />

          <StatCard
            icon={CheckCircle2}
            label="Signed"
            value={signedReports}
            description="Completed reports"
          />

          <StatCard
            icon={Clock3}
            label="Drafts"
            value={draftReports}
            description="Reports being reviewed"
          />

          <StatCard
            icon={Clock3}
            label="Pending"
            value={pendingReports}
            description="Awaiting completion"
          />
        </div>

        {/* REPORTS CARD */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* TOOLBAR */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Clinical Reports
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredReports.length} reports found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* SEARCH */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search reports..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white sm:w-64"
                />
              </div>

              {/* FILTER */}
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                <Filter size={15} className="ml-2 text-slate-400" />

                {["All", "Signed", "Draft", "Pending"].map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilter(status)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        filter === status
                          ? "bg-white text-teal-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Report
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Owner
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Updated
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr
                    key={report.title}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                  >
                    {/* REPORT */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          <FileText size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {report.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Clinical assessment
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* OWNER */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-slate-700">
                        {report.owner}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </td>

                    {/* UPDATED */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-500">
                        {report.updated}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadReport(report)}
                        aria-label={`Download ${report.title}`}
                        className="ml-2 inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredReports.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center"
                    >
                      <FileText
                        size={28}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        No reports found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your search or filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* REPORT PREVIEW DRAWER */}
      {selectedReport && (
        <div className="fixed inset-0 z-50">
          {/* BACKDROP */}
          <button
            type="button"
            aria-label="Close report preview"
            onClick={() => setSelectedReport(null)}
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
          />

          {/* DRAWER */}
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
            {/* DRAWER HEADER */}
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedReport.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Generated clinical report
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* DRAWER CONTENT */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Owner"
                  value={selectedReport.owner}
                />

                <InfoItem
                  label="Status"
                  value={selectedReport.status}
                />

                <InfoItem
                  label="Last Updated"
                  value={selectedReport.updated}
                />

                <InfoItem
                  label="Document Type"
                  value="Clinical Assessment"
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-teal-600" />

                  <h3 className="text-sm font-bold text-slate-900">
                    Report Summary
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  This report contains the clinical assessment,
                  supporting evidence, patient information, and
                  recommended follow-up actions generated during the
                  consultation workflow.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-900">
                  Clinical Sections
                </h3>

                <div className="mt-3 space-y-3">
                  {[
                    "Patient information",
                    "Clinical symptoms",
                    "Knowledge graph evidence",
                    "Retrieved medical evidence",
                    "Clinical assessment",
                    "Follow-up recommendations",
                  ].map((section) => (
                    <div
                      key={section}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                    >
                      <CheckCircle2
                        size={17}
                        className="text-emerald-500"
                      />

                      <span className="text-sm text-slate-700">
                        {section}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs leading-5 text-amber-800">
                  This interface is a frontend prototype. Generated
                  clinical content should be reviewed by a qualified
                  healthcare professional before use.
                </p>
              </div>
            </div>

            {/* DRAWER FOOTER */}
            <div className="flex gap-3 border-t border-slate-200 p-5">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Download size={17} />
                Download
              </button>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Close
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-teal-700">
          <Icon size={19} />
        </div>

        <span className="text-xs font-medium text-slate-400">
          Overview
        </span>
      </div>

      <p className="mt-5 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}