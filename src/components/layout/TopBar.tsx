import { useState, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { PulseDot } from "@/components/PulseDot";
import type { Incident } from "@/types";

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  incidents: Incident[];
}

export function TopBar({ sidebarOpen, setSidebarOpen, incidents }: TopBarProps) {
  const [tick, setTick] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTick(new Date()), 1000); return () => clearInterval(t); }, []);

  const active = incidents.filter(i => i.status !== "RESOLVED").length;

  return (
    <header className="fixed top-0 left-0 z-30 flex items-center justify-between px-4 h-11 border-b" style={{
      background: "rgba(4,8,15,0.97)", borderColor: "rgba(100,140,200,0.1)",
      left: sidebarOpen ? 220 : 0, right: 0, backdropFilter: "blur(8px)",
    }}>
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: "#4a5f78" }}>
          <Menu size={15} />
        </button>
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <PulseDot color="#10b981" />
            <span className="text-[10px] font-mono" style={{ color: "#10b981" }}>ONLINE</span>
          </div>
          <span className="text-[10px] font-mono" style={{ color: "#4a5f78" }}>|</span>
          <span className="text-[10px] font-mono" style={{ color: "#7a8fa8" }}>
            {tick.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
          </span>
          <span className="text-[10px] font-mono" style={{ color: "#4a5f78" }}>
            {tick.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {active > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <PulseDot color="#f59e0b" />
            <span className="text-[10px] font-mono" style={{ color: "#f59e0b" }}>{active} active</span>
          </div>
        )}
        <button className="relative p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: "#4a5f78" }}>
          <Bell size={14} />
          {active > 0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#ef4444]" />}
        </button>
      </div>
    </header>
  );
}
