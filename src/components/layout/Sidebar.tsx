import { Activity, Plus, FileText, Train, X, Users } from "lucide-react";
import { PulseDot } from "@/components/PulseDot";
import { STAFF_POOL, FONT_SANS } from "@/config/constants";
import type { View, Incident } from "@/types";

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
  incidents: Incident[];
  open: boolean;
  onClose?: () => void;
  mobile?: boolean;
}

export function Sidebar({ view, setView, incidents, open, onClose, mobile }: SidebarProps) {
  const active = incidents.filter(i => i.status !== "RESOLVED").length;
  const critical = incidents.filter(i => i.severity === "CRITICAL" && i.status !== "RESOLVED").length;

  const navItems: { id: View; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "dashboard",    label: "Dashboard",    icon: <Activity size={15} />,  badge: active },
    { id: "new-incident", label: "New Incident", icon: <Plus size={15} /> },
    { id: "reports",      label: "Reports",      icon: <FileText size={15} /> },
    { id: "staff-management", label: "Staff",    icon: <Users size={15} /> },
  ];

  const onDutyStaff = STAFF_POOL.slice(0, 6);

  function handleNav(id: View) {
    setView(id);
    if (mobile && onClose) onClose();
  }

  return (
    <>
      {mobile && open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30"
          style={{ background: "rgba(0,0,0,0.6)" }}
        />
      )}
      <aside
        className="fixed left-0 top-0 h-full z-40 flex flex-col border-r transition-all duration-300"
        style={{
          width: open ? 220 : 0,
          overflow: "hidden",
          background: "#04080f",
          borderColor: "rgba(100,140,200,0.1)",
          minWidth: open ? 220 : 0,
        }}
      >
        {mobile && open && (
          <div className="absolute top-3 right-3 z-50">
            <button onClick={onClose} className="p-1 rounded hover:bg-white/5" style={{ color: "#4a5f78" }}>
              <X size={14} />
            </button>
          </div>
        )}
      <div className="px-4 py-4 border-b flex items-center gap-3" style={{ borderColor: "rgba(100,140,200,0.1)" }}>
        <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,158,11,0.15)" }}>
          <Train size={14} style={{ color: "#f59e0b" }} />
        </div>
        <div>
          <p className="text-[11px] font-bold leading-tight" style={{ color: "#c9d4e8", fontFamily: FONT_SANS, whiteSpace: "nowrap" }}>Incident Management</p>
          <p className="text-[9px] font-mono" style={{ color: "#4a5f78" }}>Metro IMS v2.4</p>
        </div>
      </div>

      {critical > 0 && (
        <div className="mx-3 mt-3 px-3 py-2 rounded border flex items-center gap-2" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }}>
          <PulseDot color="#ef4444" />
          <span className="text-[10px]" style={{ color: "#ef4444", fontFamily: FONT_SANS }}>{critical} critical incident(s)</span>
        </div>
      )}

      <nav className="px-2 pt-4 flex flex-col gap-0.5">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-left transition-all hover:bg-white/5"
            style={{
              background: view === item.id ? "rgba(245,158,11,0.1)" : "transparent",
              borderLeft: view === item.id ? "2px solid #f59e0b" : "2px solid transparent",
            }}
          >
            <span style={{ color: view === item.id ? "#f59e0b" : "#4a5f78" }}>{item.icon}</span>
            <span className="flex-1 text-left text-[12px]" style={{ color: view === item.id ? "#c9d4e8" : "#4a5f78", fontFamily: FONT_SANS, whiteSpace: "nowrap" }}>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="text-[9px] font-mono px-1 py-0.5 rounded" style={{ background: "#f59e0b", color: "#04080f" }}>{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 mt-6">
        <p className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: "#4a5f78" }}>On-Duty Staff</p>
        <div className="space-y-1">
          {onDutyStaff.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: i < 4 ? "#10b981" : "#f59e0b" }} />
              <span className="text-[10px] truncate" style={{ color: "#7a8fa8", fontFamily: FONT_SANS }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto px-3 py-4 border-t" style={{ borderColor: "rgba(100,140,200,0.08)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>O</div>
          <div>
            <p className="text-[10px]" style={{ color: "#c9d4e8", fontFamily: FONT_SANS, whiteSpace: "nowrap" }}>Operations Operator</p>
            <p className="text-[9px] font-mono" style={{ color: "#4a5f78" }}>OPS-CTRL-01</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
