import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface Notification {
  id: string;
  user_job_number: string;
  title: string;
  message: string;
  type: string;
  incident_id: string | null;
  incident_code: string | null;
  read: boolean;
  created_at: string;
}

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (incidentId: string) => void;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case "critical": return <AlertTriangle size={12} style={{ color: "var(--destructive)" }} />;
    case "success": return <CheckCircle size={12} style={{ color: "var(--chart-3)" }} />;
    case "warning": return <AlertCircle size={12} style={{ color: "#f97316" }} />;
    default: return <Info size={12} style={{ color: "var(--primary)" }} />;
  }
}

export function NotificationsPanel({ open, onClose, onNavigate }: NotificationsPanelProps) {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    try {
      const [data, countData] = await Promise.all([
        api.getNotifications(),
        api.getUnreadCount(),
      ]);
      setNotifs(data);
      setUnreadCount(countData.count);
    } catch {}
  };

  useEffect(() => {
    if (open) fetchNotifs();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) {
      setTimeout(() => document.addEventListener("click", handleClickOutside), 0);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open, onClose]);

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleClick = async (n: Notification) => {
    if (!n.read) {
      await api.markNotificationRead(n.id);
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    if (n.incident_id) {
      onNavigate(n.incident_id);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div ref={panelRef} className="fixed z-40 rounded-xl border shadow-2xl overflow-hidden" style={{
      top: 48, right: 12, width: 340, maxHeight: 420,
      background: "var(--card)", borderColor: "var(--border)",
      display: "flex", flexDirection: "column",
    }}>
      <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <Bell size={13} style={{ color: "var(--foreground)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: "var(--primary)", color: "#fff" }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="p-1 rounded hover:bg-white/5 transition-colors" title="Mark all read">
              <CheckCheck size={13} style={{ color: "var(--muted-foreground)" }} />
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5 transition-colors">
            <X size={13} style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 360 }}>
        {notifs.length === 0 && (
          <div className="flex flex-col items-center py-8" style={{ color: "var(--muted-foreground)" }}>
            <Bell size={20} opacity={0.4} />
            <span className="text-xs mt-2">No notifications</span>
          </div>
        )}
        {notifs.map(n => (
          <button key={n.id} onClick={() => handleClick(n)}
            className="w-full text-left px-3 py-2.5 border-b transition-colors hover:bg-white/[0.03]"
            style={{
              borderColor: "var(--border)",
              background: n.read ? "transparent" : "rgba(var(--primary-rgb), 0.04)",
            }}>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 shrink-0"><TypeIcon type={n.type} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{n.title}</span>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--primary)" }} />}
                </div>
                <p className="text-[10px] mt-0.5 leading-relaxed line-clamp-2" style={{ color: "var(--muted-foreground)" }}>{n.message}</p>
                <span className="text-[9px] font-mono mt-1 block" style={{ color: "var(--muted-foreground)" }}>{timeAgo(n.created_at)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
