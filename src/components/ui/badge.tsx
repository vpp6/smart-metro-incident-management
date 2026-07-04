import { FONT_MONO, TYPE_COLORS } from "@/config/constants";
import { SEV_CONFIG } from "@/config/constants";
import type { Severity, IncidentStatus, ExtendedIncidentType } from "@/types";

export function SevBadge({ sev }: { sev: Severity }) {
  const c = SEV_CONFIG[sev];
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: c.bg, color: c.color, fontFamily: FONT_MONO }}>
      {c.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
  const map: Record<IncidentStatus, { label: string; color: string }> = {
    OPEN:     { label: "Open",   color: "var(--primary)" },
    ACTIVE:   { label: "Active", color: "var(--accent)" },
    RESOLVED: { label: "Closed", color: "var(--chart-3)" },
  };
  const { label, color } = map[status];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]" style={{ background: color + "18", color, fontFamily: FONT_MONO }}>
      <span className="w-1 h-1 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export function TypeTag({ type }: { type: ExtendedIncidentType }) {
  const color = TYPE_COLORS[type] || "#6b7280";
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]" style={{ background: color + "15", color }}>
      {type}
    </span>
  );
}
