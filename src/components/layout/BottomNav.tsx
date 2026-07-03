import { Activity, Plus, FileText, Users } from "lucide-react";
import type { View } from "@/types";

interface BottomNavProps {
  view: View;
  setView: (v: View) => void;
  activeCount: number;
}

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard",    label: "Dashboard",    icon: <Activity size={20} /> },
  { id: "new-incident", label: "New",          icon: <Plus size={20} /> },
  { id: "reports",      label: "Reports",      icon: <FileText size={20} /> },
  { id: "staff-management", label: "Staff",    icon: <Users size={20} /> },
];

export function BottomNav({ view, setView, activeCount }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t"
      style={{
        background: "rgba(4,8,15,0.97)",
        borderColor: "rgba(100,140,200,0.1)",
        backdropFilter: "blur(8px)",
        height: 56,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {NAV_ITEMS.map(item => {
        const isActive = view === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
            style={{ color: isActive ? "#f59e0b" : "#4a5f78" }}
          >
            <div className="relative">
              {item.icon}
              {item.id === "dashboard" && activeCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                  style={{ background: "#f59e0b", color: "#04080f" }}
                >
                  {activeCount > 9 ? "9+" : activeCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
