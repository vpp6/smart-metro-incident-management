import { TrendingUp, TrendingDown } from "lucide-react";
import { FONT_MONO, FONT_SANS } from "@/config/constants";

interface KPICardProps {
  label: string;
  value: string;
  unit?: string;
  sub: string;
  trend?: "up" | "down" | "neutral";
  color: string;
}

export function KPICard({ label, value, unit, sub, trend, color }: KPICardProps) {
  return (
    <div className="rounded border p-4 flex flex-col gap-2 hover:border-opacity-50 transition-colors" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.12)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#4a5f78" }}>{label}</span>
        {trend && trend !== "neutral" && (
          trend === "up"
            ? <TrendingUp size={12} style={{ color }} />
            : <TrendingDown size={12} style={{ color }} />
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold" style={{ color, fontFamily: FONT_MONO }}>{value}</span>
        {unit && <span className="text-xs mb-0.5" style={{ color: "#4a5f78", fontFamily: FONT_MONO }}>{unit}</span>}
      </div>
      <p className="text-[10px]" style={{ color: "#4a5f78", fontFamily: FONT_SANS }}>{sub}</p>
    </div>
  );
}
