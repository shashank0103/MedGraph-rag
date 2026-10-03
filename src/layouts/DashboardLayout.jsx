import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import PageContainer from "../components/PageContainer";
import Topbar from "../components/Topbar";
import RagChatbot from "../components/RagChatbot";
import { pageMeta } from "../Data/workspace";

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPage = useMemo(() => {
    return pageMeta[location.pathname] ?? pageMeta["/dashboard"];
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute right-0 top-28 h-80 w-80 rounded-full bg-sky-200/25 blur-3xl" />
      </div>

      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="relative min-h-screen lg:ml-[263px]">
        <Topbar
          title={currentPage.title}
          description={currentPage.description}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <PageContainer>
          <div className="rounded-[2rem] border border-white/60 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 lg:p-8">
            <div className="overflow-auto pr-1">
              {children}
            </div>
          </div>
        </PageContainer>
      </div>

      <RagChatbot />
    </div>
  );
}