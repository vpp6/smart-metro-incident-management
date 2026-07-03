import { useState, useEffect } from "react";
import { Plus, ChevronRight, Radio, LogOut, Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Dashboard } from "@/pages/Dashboard";
import { NewIncidentForm } from "@/pages/NewIncidentForm";
import { IncidentDetail } from "@/pages/IncidentDetail";
import { Reports } from "@/pages/Reports";
import { LoginPage } from "@/pages/LoginPage";
import { SAMPLE_INCIDENTS } from "@/data/sample";
import { FONT_SANS } from "@/config/constants";
import type { View, Incident } from "@/types";

function useMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return mobile;
}

export default function App() {
  const isMobile = useMobile();
  const [user, setUser] = useState<{ station: string; managerName: string } | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [incidents, setIncidents] = useState<Incident[]>(SAMPLE_INCIDENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const selectedIncident = incidents.find(i => i.id === selectedId) || null;

  function handleSelectIncident(id: string) {
    setSelectedId(id);
    setView("incident-detail");
    if (isMobile) setSidebarOpen(false);
  }

  function handleNewIncident(partial: Partial<Incident>) {
    const code = `INC-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`;
    const newInc: Incident = {
      id: String(Date.now()),
      code,
      date: partial.date || "",
      day: partial.day || "",
      time: partial.time || "",
      shift: partial.shift || "Morning",
      station: partial.station || "SAB",
      location: partial.location || "Platform",
      description: partial.description || "",
      incidentType: partial.incidentType || "Passenger Medical Incident",
      severity: partial.severity || "MEDIUM",
      status: "OPEN",
      reportedAt: new Date(),
      assignedStaff: [],
      detection: partial.detection,
      passenger: partial.passenger,
      trainOps: partial.trainOps,
      evacuation: partial.evacuation,
      staff: partial.staff,
      impact: partial.impact,
    };
    setIncidents(prev => [newInc, ...prev]);
    setTimeout(() => {
      setSelectedId(newInc.id);
      setView("incident-detail");
    }, 800);
  }

  const mainOffset = !isMobile && sidebarOpen ? 220 : 0;

  const PAGE_TITLES: Record<View, string> = {
    "dashboard":       "Dashboard",
    "new-incident":    "New Incident",
    "incident-detail": selectedIncident?.code || "Incident Details",
    "reports":         "Reports & Statistics",
  };

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div dir="ltr" style={{ background: "#04080f", minHeight: "100vh", fontFamily: FONT_SANS }}>
      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(100,140,200,0.15); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(100,140,200,0.25); }
        * { scrollbar-width: thin; scrollbar-color: rgba(100,140,200,0.15) transparent; }
        @media (max-width: 767px) {
          .hide-mobile { display: none !important; }
          .stack-mobile { grid-template-columns: 1fr !important; }
          .wrap-mobile { flex-wrap: wrap !important; }
          .full-mobile { width: 100% !important; max-width: 100% !important; }
          .overflow-mobile { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
        }
      `}</style>

      <Sidebar view={view} setView={v => { setView(v); setSelectedId(null); if (isMobile) setSidebarOpen(false); }} incidents={incidents} open={sidebarOpen} onClose={() => setSidebarOpen(false)} mobile={isMobile} />
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} incidents={incidents} mobile={isMobile} />

      <main className="transition-all duration-300 pt-11" style={{ marginLeft: mainOffset }}>
        <div className="sticky top-11 z-20 px-3 sm:px-5 py-3 border-b flex items-center justify-between" style={{ background: "rgba(4,8,15,0.95)", borderColor: "rgba(100,140,200,0.08)", backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: "#4a5f78" }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} className="p-1 mr-1 rounded hover:bg-white/5" style={{ color: "#4a5f78" }}>
                <Menu size={14} />
              </button>
            )}
            <Radio size={11} style={{ color: "#10b981" }} />
            <span className="hide-mobile">Incident Management System</span>
            <ChevronRight size={11} className="hide-mobile" />
            <span style={{ color: "#c9d4e8" }}>{PAGE_TITLES[view]}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: "#4a5f78" }}>
            <Radio size={11} style={{ color: "#10b981" }} />
            <span>Incident Management System</span>
            <ChevronRight size={11} />
            <span style={{ color: "#c9d4e8" }}>{PAGE_TITLES[view]}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono" style={{ color: "#7a8fa8" }}>
              {user.station} — {user.managerName}
            </span>
            <button onClick={() => setUser(null)}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all hover:opacity-80"
              style={{ background: "rgba(100,140,200,0.08)", border: "1px solid rgba(100,140,200,0.1)", color: "#4a5f78" }}>
              <LogOut size={11} /> Logout
            </button>
            {view === "dashboard" && (
              <button onClick={() => setView("new-incident")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-medium transition-all hover:opacity-90"
                style={{ background: "#f59e0b", color: "#04080f" }}>
                <Plus size={12} /> New Incident
              </button>
            )}
          </div>
        </div>

        <div className="p-3 sm:p-5">
          {view === "dashboard" && <Dashboard incidents={incidents} onSelectIncident={handleSelectIncident} />}
          {view === "new-incident" && <NewIncidentForm onSubmit={handleNewIncident} />}
          {view === "incident-detail" && selectedIncident && <IncidentDetail incident={selectedIncident} onBack={() => setView("dashboard")} />}
          {view === "reports" && <Reports incidents={incidents} onSelectIncident={handleSelectIncident} />}
        </div>
      </main>
    </div>
  );
}
