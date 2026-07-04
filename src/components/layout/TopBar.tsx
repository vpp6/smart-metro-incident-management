import { useState, useEffect, useCallback } from "react";
import { Bell, Menu } from "lucide-react";
import { PulseDot } from "@/components/PulseDot";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NotificationsPanel } from "@/components/ui/NotificationsPanel";
import { api } from "@/lib/api";
import type { Incident } from "@/types";

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  incidents: Incident[];
  mobile?: boolean;
  onNavigateToIncident?: (id: string) => void;
}

export function TopBar({ sidebarOpen, setSidebarOpen, incidents, mobile, onNavigateToIncident }: TopBarProps) {
  const [tick, setTick] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchUnread = useCallback(async () => {
    try {
      const data = await api.getUnreadCount();
      setUnreadCount(data.count);
    } catch {}
  }, []);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  const active = incidents.filter(i => i.status !== "RESOLVED").length;

  return (
    <>
      <header className="fixed top-0 left-0 z-30 flex items-center justify-between px-4 h-11 border-b" style={{
        background: "color-mix(in srgb, var(--background) 97%, transparent)", borderColor: "var(--border)",
        left: !mobile && sidebarOpen ? 220 : 0, right: 0, backdropFilter: "blur(8px)",
      }}>
        <div className="flex items-center gap-3">
          {!mobile && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: "var(--muted-foreground)" }}>
              <Menu size={15} />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <PulseDot color="var(--chart-3)" />
              <span className="text-[10px] font-mono" style={{ color: "var(--chart-3)" }}>ONLINE</span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>|</span>
            <span className="text-[10px] font-mono" style={{ color: "var(--secondary-foreground)" }}>
              {tick.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
            </span>
            <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
              {tick.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {active > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(var(--primary-rgb), 0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <PulseDot color="var(--primary)" />
              <span className="text-[10px] font-mono" style={{ color: "var(--primary)" }}>{active} active</span>
            </div>
          )}
          <ThemeToggle />
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: "var(--muted-foreground)" }}>
            <Bell size={14} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[14px] h-[14px] px-[3px] rounded-full text-[8px] font-bold leading-none"
                style={{ background: "var(--destructive)", color: "#fff" }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>
      <NotificationsPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        onNavigate={onNavigateToIncident || (() => {})}
      />
    </>
  );
}
