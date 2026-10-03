import { NavLink } from "react-router-dom";

import { LogOut, Settings, Activity, X } from "lucide-react";

import { navigationItems } from "../Data/workspace";
import { getCurrentUser, signOut } from "../Data/auth";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const isPatient = getCurrentUser().role === "patient";
  const visibleNavigation = isPatient
    ? navigationItems.filter((item) => ["Dashboard", "Knowledge Graph", "Reports"].includes(item.label))
    : navigationItems;

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={`fixed inset-0 z-30 bg-slate-950/40 transition lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[263px] flex-col border-r border-slate-200 bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[80px] items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
              <Activity size={22} />
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900">
                MedGraph-RAG
              </h1>
              <p className="text-xs text-slate-500">Clinical AI Copilot</p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-auto px-4 py-5">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Workspace
          </p>

          <div className="mt-3 space-y-1">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  state={
                    isPatient && item.label === "Knowledge Graph"
                      ? { patient: getCurrentUser().patient }
                      : undefined
                  }
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-rose-50 hover:text-rose-600">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}