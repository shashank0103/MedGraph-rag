import { Bell, ChevronDown, Globe, Menu } from "lucide-react";
import { getCurrentUser } from "../Data/auth";

export default function Topbar({ title, description, onMenuClick }) {
  const user = getCurrentUser();
  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="h-[80px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-7">
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">
              Clinical Workspace
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <Globe size={18} />
            <span>English</span>
            <ChevronDown size={15} />
          </button>

          <button className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-100 text-sm font-semibold text-teal-700">
              {initials}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.subtitle}</p>
            </div>
          </div>
        </div>

      </div>

    </header>
  );
}