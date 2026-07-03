import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { ChevronRight, Radio, LogOut, Users, Loader } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { LoginPage } from "@/pages/LoginPage";
import { SAMPLE_INCIDENTS } from "@/data/sample";
import { DEFAULT_STAFF } from "@/data/staff";
import { FONT_SANS } from "@/config/constants";
import type { View, Incident, StaffUser } from "@/types";
import type { LoginResult } from "@/pages/LoginPage";

const Dashboard = lazy(() => import("@/pages/Dashboard").then(m => ({ default: m.Dashboard })));
const NewIncidentForm = lazy(() => import("@/pages/NewIncidentForm").then(m => ({ default: m.NewIncidentForm })));
const IncidentDetail = lazy(() => import("@/pages/IncidentDetail").then(m => ({ default: m.IncidentDetail })));
const Reports = lazy(() => import("@/pages/Reports").then(m => ({ default: m.Reports })));
const StaffManagement = lazy(() => import("@/pages/StaffManagement").then(m => ({ default: m.StaffManagement })));

function LoaderFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader size={20} className="animate-spin" style={{ color: "#f59e0b" }} />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<LoginResult | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>(SAMPLE_INCIDENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [staffList, setStaffList] = useState<StaffUser[]>(DEFAULT_STAFF);

  const selectedIncident = incidents.find(i => i.id === selectedId) || null;
  const activeCount = incidents.filter(i => i.status !== "RESOLVED").length;
  const isMobile = window.innerWidth < 768;

  const navigate = useCallback((v: View) => {
    setView(v);
    setSelectedId(null);
    setEditingIncident(null);
  }, []);

  const handleSelectIncident = useCallback((id: string) => {
    setSelectedId(id);
    setView("incident-detail");
  }, []);

  const handleNewIncident = useCallback((partial: Partial<Incident>) => {
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
  }, []);

  const handleUpdateIncident = useCallback((id: string, data: Partial<Incident>) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    setEditingIncident(null);
    setView("incident-detail");
  }, []);

  const handleDeleteIncident = useCallback((id: string) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
    setView("dashboard");
  }, []);

  const handleEditIncident = useCallback((inc: Incident) => {
    setEditingIncident(inc);
    setView("new-incident");
  }, []);

  const PAGE_TITLES: Record<View, string> = {
    "dashboard":        "Dashboard",
    "new-incident":     editingIncident ? `Edit ${editingIncident.code}` : "New Incident",
    "incident-detail":  selectedIncident?.code || "Incident Details",
    "reports":          "Reports & Statistics",
    "staff-management": "Staff Management",
  };

  if (!user) return <LoginPage onLogin={setUser} />;

  const mainOffset = !isMobile && sidebarOpen ? 220 : 0;
  const bottomPad = isMobile ? 72 : 0;

  return (
    <div dir="ltr" style={{ background: "#04080f", minHeight: "100vh", fontFamily: FONT_SANS }}>
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(100,140,200,0.15); border-radius: 2px; }
        * { scrollbar-width: thin; scrollbar-color: rgba(100,140,200,0.15) transparent; }
        @media (max-width: 767px) { .hide-mobile { display: none !important; } .show-mobile-only { display: inline !important; } }
        @media (min-width: 768px) { .show-mobile-only { display: none !important; } }
      `}</style>

      <Sidebar view={view} setView={navigate} incidents={incidents} open={!isMobile && sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {isMobile && <BottomNav view={view} setView={navigate} activeCount={activeCount} />}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} incidents={incidents} mobile={isMobile} />

      <main className="transition-all duration-300" style={{ marginLeft: mainOffset, paddingTop: 44, paddingBottom: bottomPad }}>
        <div className="sticky top-0 z-20 px-3 sm:px-5 py-2.5 border-b flex items-center justify-between" style={{ background: "rgba(4,8,15,0.95)", borderColor: "rgba(100,140,200,0.08)", backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: "#4a5f78" }}>
            <Radio size={11} style={{ color: "#10b981" }} />
            <span className="hide-mobile">Incident Management System</span>
            <ChevronRight size={11} className="hide-mobile" />
            <span style={{ color: "#c9d4e8" }}>{PAGE_TITLES[view]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono hide-mobile" style={{ color: "#7a8fa8" }}>{user.jobNumber} · {user.managerName} · {user.station}</span>
            <span className="text-[10px] font-mono show-mobile-only" style={{ color: "#7a8fa8" }}>{user.jobNumber}</span>
            {view !== "staff-management" && (
              <button onClick={() => navigate("staff-management")}
                className="flex items-center gap-1 px-2 py-1.5 rounded text-[10px] transition-all hover:opacity-80"
                style={{ background: "rgba(100,140,200,0.08)", border: "1px solid rgba(100,140,200,0.1)", color: "#4a5f78" }}>
                <Users size={11} /><span className="hide-mobile">Staff</span>
              </button>
            )}
            <button onClick={() => setUser(null)}
              className="flex items-center gap-1 px-2 py-1.5 rounded text-[10px] transition-all hover:opacity-80"
              style={{ background: "rgba(100,140,200,0.08)", border: "1px solid rgba(100,140,200,0.1)", color: "#4a5f78" }}>
              <LogOut size={11} /><span className="hide-mobile">Logout</span>
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-5" style={{ paddingBottom: isMobile ? 80 : 20 }}>
          <Suspense fallback={<LoaderFallback />}>
            {view === "dashboard" && (
              <Dashboard incidents={incidents} onSelectIncident={handleSelectIncident} onNewIncident={() => setView("new-incident")} userStation={user.station} mobile={isMobile} />
            )}
            {view === "new-incident" && <NewIncidentForm onSubmit={handleNewIncident} onUpdate={handleUpdateIncident} editIncident={editingIncident} />}
            {view === "incident-detail" && selectedIncident && (
              <IncidentDetail incident={selectedIncident} onBack={() => { setView("dashboard"); setSelectedId(null); }} onEdit={() => handleEditIncident(selectedIncident)} onDelete={() => handleDeleteIncident(selectedIncident.id)} />
            )}
            {view === "reports" && <Reports incidents={incidents} onSelectIncident={handleSelectIncident} mobile={isMobile} />}
            {view === "staff-management" && <StaffManagement staffList={staffList} onUpdateStaff={setStaffList} onBack={() => setView("dashboard")} />}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
