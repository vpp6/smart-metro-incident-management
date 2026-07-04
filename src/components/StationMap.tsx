import { useState, useMemo } from "react";
import { X, Circle, Train, ChevronRight } from "lucide-react";
import { STATIONS, getStationInfo, SEV_CONFIG, FONT_MONO, FONT_SANS } from "@/config/constants";
import { SevBadge } from "@/components/ui/badge";
import type { Incident } from "@/types";

interface StationMapProps {
  incidents: Incident[];
  onSelectIncident?: (id: string) => void;
}

const BLUE_STATIONS = STATIONS.filter(s => s.line === "blue");
const RED_STATIONS = STATIONS.filter(s => s.line === "red");

const BLUE_COLOR = "#3b82f6";
const RED_COLOR = "#ef4444";

export function StationMap({ incidents, onSelectIncident }: StationMapProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const incidentCounts = useMemo(() => {
    const m: Record<string, number> = {};
    incidents.forEach(i => { m[i.station] = (m[i.station] || 0) + 1; });
    return m;
  }, [incidents]);

  const maxCount = Math.max(...Object.values(incidentCounts), 1);

  function getHeatColor(count: number): string {
    if (count === 0) return "var(--muted-foreground)";
    const ratio = count / maxCount;
    if (ratio > 0.6) return "var(--destructive)";
    if (ratio > 0.3) return "var(--primary)";
    return "var(--chart-3)";
  }

  const stationIncidents = selected
    ? incidents.filter(i => i.station === selected).sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    : [];

  const stationInfo = selected ? getStationInfo(selected) : null;

  const BLUE_GAP = 26;
  const RED_GAP = 28;
  const DOT = 8;
  const BLUE_X = 160;
  const RED_Y = 340;
  const BLUE_TOP = 30;

  return (
    <div style={{ maxHeight: "calc(100vh - 120px)", overflow: "auto" }}>
      <div className="w-full overflow-auto">
        <svg viewBox="0 0 520 550" className="w-full" style={{ maxWidth: 520, margin: "0 auto", display: "block" }}>
          {/* Legend */}
          <text x={20} y={20} fontSize={9} fontFamily={FONT_MONO} fill="var(--muted-foreground)">● Blue Line</text>
          <circle cx={20} cy={14} r={4} fill={BLUE_COLOR} />
          <text x={100} y={20} fontSize={9} fontFamily={FONT_MONO} fill="var(--muted-foreground)">● Red Line</text>
          <circle cx={100} cy={14} r={4} fill={RED_COLOR} />

          {/* Blue Line vertical */}
          <line x1={BLUE_X} y1={BLUE_TOP} x2={BLUE_X} y2={BLUE_TOP + (BLUE_STATIONS.length - 1) * BLUE_GAP} stroke={BLUE_COLOR} strokeWidth={4} strokeLinecap="round" />

          {BLUE_STATIONS.map((s, i) => {
            const y = BLUE_TOP + i * BLUE_GAP;
            const count = incidentCounts[s.name] || 0;
            const heat = getHeatColor(count);
            const isSel = selected === s.name;
            return (
              <g key={s.name} onClick={() => setSelected(s.name)} style={{ cursor: "pointer" }}>
                <rect x={BLUE_X - 40} y={y - 10} width={130} height={20} rx={4} fill={isSel ? "rgba(var(--primary-rgb), 0.15)" : "transparent"} className="hover:fill-white/5" />
                <circle cx={BLUE_X} cy={y} r={isSel ? 6 : DOT / 2} fill={BLUE_COLOR} stroke="var(--background)" strokeWidth={2} />
                {count > 0 && (
                  <circle cx={BLUE_X + 14} cy={y - 8} r={5} fill={heat} stroke="var(--background)" strokeWidth={1.5} />
                )}
                {count > 0 && (
                  <text x={BLUE_X + 14} y={y - 5} fontSize={6} fontFamily={FONT_MONO} fill="#fff" textAnchor="middle" fontWeight={700}>
                    {count}
                  </text>
                )}
                <text x={BLUE_X + 12} y={y + 3} fontSize={7.5} fontFamily={FONT_SANS} fill="var(--foreground)" dominantBaseline="middle" fontWeight={isSel ? 700 : 400}>
                  {s.name}
                </text>
              </g>
            );
          })}

          {/* Red Line horizontal */}
          <line x1={30} y1={RED_Y} x2={30 + (RED_STATIONS.length - 1) * RED_GAP} y2={RED_Y} stroke={RED_COLOR} strokeWidth={4} strokeLinecap="round" />

          {RED_STATIONS.map((s, i) => {
            const x = 30 + i * RED_GAP;
            const count = incidentCounts[s.name] || 0;
            const heat = getHeatColor(count);
            const labelUp = i % 2 === 0;
            const isSel = selected === s.name;
            return (
              <g key={s.name} onClick={() => setSelected(s.name)} style={{ cursor: "pointer" }}>
                <rect x={x - 10} y={labelUp ? RED_Y - 40 : RED_Y + 10} width={60} height={30} rx={4} fill={isSel ? "rgba(var(--primary-rgb), 0.15)" : "transparent"} className="hover:fill-white/5" />
                <circle cx={x} cy={RED_Y} r={isSel ? 6 : DOT / 2} fill={RED_COLOR} stroke="var(--background)" strokeWidth={2} />
                {count > 0 && (
                  <circle cx={x + 14} cy={RED_Y - 8} r={5} fill={heat} stroke="var(--background)" strokeWidth={1.5} />
                )}
                {count > 0 && (
                  <text x={x + 14} y={RED_Y - 5} fontSize={6} fontFamily={FONT_MONO} fill="#fff" textAnchor="middle" fontWeight={700}>
                    {count}
                  </text>
                )}
                <text
                  x={x}
                  y={labelUp ? RED_Y - 14 : RED_Y + 16}
                  fontSize={6.5}
                  fontFamily={FONT_SANS}
                  fill="var(--foreground)"
                  textAnchor="start"
                  fontWeight={isSel ? 700 : 400}
                  transform={i > 8 ? `rotate(-35, ${x}, ${labelUp ? RED_Y - 14 : RED_Y + 16})` : undefined}
                >
                  {s.name}
                </text>
              </g>
            );
          })}

          <text x={BLUE_X + 50} y={BLUE_TOP + 10 * BLUE_GAP + 4} fontSize={7} fontFamily={FONT_MONO} fill="var(--primary)" fontStyle="italic">
            (stc — interchange)
          </text>
        </svg>
      </div>

      {/* Station detail panel */}
      {selected && (
        <div className="mx-auto mt-4 mb-6 p-4 rounded-xl border" style={{ maxWidth: 500, background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Circle size={10} fill={stationInfo?.line === "blue" ? BLUE_COLOR : RED_COLOR} stroke="none" />
              <span className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>{selected}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(var(--primary-rgb), 0.1)", color: "var(--primary)" }}>
                {stationInfo?.line === "blue" ? "Blue Line" : "Red Line"}
              </span>
            </div>
            <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-white/5" style={{ color: "var(--muted-foreground)" }}>
              <X size={14} />
            </button>
          </div>

          {stationIncidents.length === 0 ? (
            <div className="flex flex-col items-center py-6 gap-2">
              <span style={{ fontSize: 28 }}>✅</span>
              <p className="text-[12px] font-mono" style={{ color: "var(--chart-3)" }}>No incidents at this station</p>
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>This station is all clear</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                {stationIncidents.length} incident{stationIncidents.length > 1 ? "s" : ""} at this station
              </p>
              {stationIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident?.(inc.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors hover:bg-white/5"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <SevBadge sev={inc.severity} />
                  <span className="text-[10px] font-mono flex-1" style={{ color: "var(--foreground)" }}>
                    {inc.code}
                  </span>
                  <span className="text-[9px]" style={{ color: "var(--muted-foreground)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {inc.description}
                  </span>
                  <ChevronRight size={11} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
