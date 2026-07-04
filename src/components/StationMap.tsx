import { useMemo } from "react";
import { STATIONS } from "@/config/constants";
import { FONT_MONO, FONT_SANS } from "@/config/constants";
import type { Incident } from "@/types";

interface StationMapProps {
  incidents: Incident[];
  onStationClick?: (station: string) => void;
}

const BLUE_STATIONS = STATIONS.filter(s => s.line === "blue");
const RED_STATIONS = STATIONS.filter(s => s.line === "red");

const BLUE_COLOR = "#3b82f6";
const RED_COLOR = "#ef4444";

export function StationMap({ incidents, onStationClick }: StationMapProps) {
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

  const BLUE_GAP = 26;
  const RED_GAP = 28;
  const DOT = 8;
  const BLUE_X = 160;
  const RED_Y = 340;
  const BLUE_TOP = 30;

  return (
    <div className="w-full overflow-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
      <svg viewBox="0 0 520 550" className="w-full" style={{ maxWidth: 520, margin: "0 auto", display: "block" }}>
        {/* Legend */}
        <text x={20} y={20} fontSize={9} fontFamily={FONT_MONO} fill="var(--muted-foreground)">● Blue Line</text>
        <circle cx={20} cy={14} r={4} fill={BLUE_COLOR} />
        <text x={100} y={20} fontSize={9} fontFamily={FONT_MONO} fill="var(--muted-foreground)">● Red Line</text>
        <circle cx={100} cy={14} r={4} fill={RED_COLOR} />

        {/* Blue Line vertical */}
        <line x1={BLUE_X} y1={BLUE_TOP} x2={BLUE_X} y2={BLUE_TOP + (BLUE_STATIONS.length - 1) * BLUE_GAP} stroke={BLUE_COLOR} strokeWidth={4} strokeLinecap="round" />

        {/* Blue Line stations */}
        {BLUE_STATIONS.map((s, i) => {
          const y = BLUE_TOP + i * BLUE_GAP;
          const count = incidentCounts[s.name] || 0;
          const heat = getHeatColor(count);
          return (
            <g key={s.name} onClick={() => onStationClick?.(s.name)} style={{ cursor: onStationClick ? "pointer" : undefined }}>
              <rect x={BLUE_X - 40} y={y - 10} width={130} height={20} rx={4} fill="transparent" className="hover:fill-white/5" />
              <circle cx={BLUE_X} cy={y} r={DOT / 2} fill={BLUE_COLOR} stroke="var(--background)" strokeWidth={2} />
              {count > 0 && (
                <circle cx={BLUE_X + 14} cy={y - 8} r={5} fill={heat} stroke="var(--background)" strokeWidth={1.5} />
              )}
              {count > 0 && (
                <text x={BLUE_X + 14} y={y - 5} fontSize={6} fontFamily={FONT_MONO} fill="#fff" textAnchor="middle" fontWeight={700}>
                  {count}
                </text>
              )}
              <text x={BLUE_X + 12} y={y + 3} fontSize={7.5} fontFamily={FONT_SANS} fill="var(--foreground)" dominantBaseline="middle">
                {s.name}
              </text>
            </g>
          );
        })}

        {/* Red Line horizontal */}
        <line x1={30} y1={RED_Y} x2={30 + (RED_STATIONS.length - 1) * RED_GAP} y2={RED_Y} stroke={RED_COLOR} strokeWidth={4} strokeLinecap="round" />

        {/* Red Line stations */}
        {RED_STATIONS.map((s, i) => {
          const x = 30 + i * RED_GAP;
          const count = incidentCounts[s.name] || 0;
          const heat = getHeatColor(count);
          const labelUp = i % 2 === 0;
          return (
            <g key={s.name} onClick={() => onStationClick?.(s.name)} style={{ cursor: onStationClick ? "pointer" : undefined }}>
              <rect x={x - 10} y={labelUp ? RED_Y - 40 : RED_Y + 10} width={60} height={30} rx={4} fill="transparent" className="hover:fill-white/5" />
              <circle cx={x} cy={RED_Y} r={DOT / 2} fill={RED_COLOR} stroke="var(--background)" strokeWidth={2} />
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
                transform={i > 8 ? `rotate(-35, ${x}, ${labelUp ? RED_Y - 14 : RED_Y + 16})` : undefined}
              >
                {s.name}
              </text>
            </g>
          );
        })}

        {/* Interchange: stc appears on both lines */}
        <text x={BLUE_X + 50} y={BLUE_TOP + 10 * BLUE_GAP + 4} fontSize={7} fontFamily={FONT_MONO} fill="var(--primary)" fontStyle="italic">
          (stc — interchange)
        </text>
      </svg>
    </div>
  );
}
