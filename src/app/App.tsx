import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { ChevronRight, Radio, LogOut, Users, Loader } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { LoginPage } from "@/pages/LoginPage";
import { FONT_SANS } from "@/config/constants";
import type { View, Incident, StaffUser } from "@/types";
import type { LoginResult } from "@/pages/LoginPage";
import { api } from "@/lib/api";

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
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedIncident = incidents.find(i => i.id === selectedId) || null;
  const activeCount = incidents.filter(i => i.status !== "RESOLVED").length;
  const isMobile = window.innerWidth < 768;

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem("metro_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        setLoading(false);
      } catch {
        localStorage.removeItem("metro_user");
        localStorage.removeItem("metro_token");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch incidents when user logs in
  useEffect(() => {
    if (!user) return;
    const token = api.getToken();
    if (!token) return;

    const fetchData = async () => {
      try {
        const [incData, staffData] = await Promise.all([
          api.getIncidents(),
          api.getStaff().catch(() => []),
        ]);
        setIncidents(incData);
        setStaffList(staffData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [user]);

  const handleLogin = useCallback(async (loginResult: LoginResult) => {
    setUser(loginResult);
  }, []);

  const handleLogout = useCallback(() => {
    api.logout();
    setUser(null);
    setIncidents([]);
    setStaffList([]);
  }, []);

  const navigate = useCallback((v: View) => {
    setView(v);
    setSelectedId(null);
    setEditingIncident(null);
  }, []);

  const handleSelectIncident = useCallback((id: string) => {
    setSelectedId(id);
    setView("incident-detail");
  }, []);

  const refreshIncidents = useCallback(async () => {
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } catch (err) {
      console.error("Failed to refresh incidents:", err);
    }
  }, []);

  const handleNewIncident = useCallback(async (partial: Partial<Incident>) => {
    try {
      const created = await api.createIncident(partial);
      setIncidents(prev => [created, ...prev]);
      setTimeout(() => {
        setSelectedId(created.id);
        setView("incident-detail");
      }, 500);
    } catch (err) {
      console.error("Failed to create incident:", err);
    }
  }, []);

  const handleUpdateIncident = useCallback(async (id: string, data: Partial<Incident>) => {
    try {
      const updated = await api.updateIncident(id, data);
      setIncidents(prev => prev.map(i => i.id === id ? updated : i));
      setEditingIncident(null);
      setView("incident-detail");
    } catch (err) {
      console.error("Failed to update incident:", err);
    }
  }, []);

  const handleDeleteIncident = useCallback(async (id: string) => {
    try {
      await api.deleteIncident(id);
      setIncidents(prev => prev.filter(i => i.id !== id));
      setView("dashboard");
    } catch (err) {
      console.error("Failed to delete incident:", err);
    }
  }, []);

  const handleEditIncident = useCallback((inc: Incident) => {
    setEditingIncident(inc);
    setView("new-incident");
  }, []);

  const handleUpdateStaff = useCallback(async (updatedStaff: StaffUser[]) => {
    setStaffList(updatedStaff);
    await refreshIncidents();
  }, [refreshIncidents]);

  const PAGE_TITLES: Record<View, string> = {
    "dashboard":        "Dashboard",
    "new-incident":     editingIncident ? `Edit ${editingIncident.code}` : "New Incident",
    "incident-detail":  selectedIncident?.code || "Incident Details",
    "reports":          "Reports & Statistics",
    "staff-management": "Staff Management",
  };

  if (loading) return <LoaderFallback />;
  if (!user) return <LoginPage onLogin={handleLogin} />;

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
            <button onClick={handleLogout}
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
              <IncidentDetail incident={selectedIncident} onBack={() => { setView("dashboard"); setSelectedId(null); }}
                onEdit={() => handleEditIncident(selectedIncident)} onDelete={() => handleDeleteIncident(selectedIncident.id)} />
            )}
            {view === "reports" && <Reports incidents={incidents} onSelectIncident={handleSelectIncident} mobile={isMobile} />}
            {view === "staff-management" && <StaffManagement staffList={staffList} onUpdateStaff={handleUpdateStaff} onBack={() => setView("dashboard")} />}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
