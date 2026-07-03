import { useState, useMemo, memo } from "react";
import { Search, ChevronRight, Plus, ArrowUpDown } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { KPICard } from "@/components/KPICard";
import { PulseDot } from "@/components/PulseDot";
import { SevBadge, StatusBadge, TypeTag } from "@/components/ui/badge";
import { SEV_CONFIG, getStationInfo, FONT_SANS, FONT_MONO } from "@/config/constants";
import { HOURLY_DATA, WEEKLY_DATA } from "@/data/sample";
import { useDebounce } from "@/lib/useDebounce";
import type { Incident, IncidentStatus, Severity } from "@/types";

interface DashboardProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onNewIncident: () => void;
  userStation: string;
  mobile?: boolean;
}

type SortKey = "newest" | "oldest" | "severity";

const IncidentCard = memo(function IncidentCard({ inc, onSelect }: { inc: Incident; onSelect: (id: string) => void }) {
  return (
    <div onClick={() => onSelect(inc.id)}
      className="px-4 py-3 active:bg-white/[0.03] transition-colors cursor-pointer"
      style={{ borderColor: "rgba(100,140,200,0.05)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {inc.status === "ACTIVE" && <PulseDot color={SEV_CONFIG[inc.severity].color} />}
          <span className="font-mono text-[12px]" style={{ color: "#7a8fa8" }}>{inc.code}</span>
          <SevBadge sev={inc.severity} />
        </div>
        <StatusBadge status={inc.status} />
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: getStationInfo(inc.station).color, verticalAlign: "middle" }} />
        <span className="text-[11px]" style={{ color: "#c9d4e8" }}>{inc.station}</span>
        <span className="text-[9px] font-mono" style={{ color: "#4a5f78" }}>· {inc.location}</span>
      </div>
      <div className="flex items-center gap-2">
        <TypeTag type={inc.incidentType} />
        <span className="text-[9px] font-mono" style={{ color: "#4a5f78", marginLeft: "auto" }}>{inc.time}</span>
        <ChevronRight size={11} style={{ color: "#4a5f78" }} />
      </div>
    </div>
  );
});

const IncidentRow = memo(function IncidentRow({ inc, onSelect }: { inc: Incident; onSelect: (id: string) => void }) {
  return (
    <tr className="border-b hover:bg-white/[0.02] cursor-pointer transition-colors" style={{ borderColor: "rgba(100,140,200,0.05)" }} onClick={() => onSelect(inc.id)}>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2">
          {inc.status === "ACTIVE" && <PulseDot color={SEV_CONFIG[inc.severity].color} />}
          <span className="font-mono text-[11px]" style={{ color: "#7a8fa8" }}>{inc.code}</span>
        </div>
      </td>
      <td className="py-2.5 px-3"><TypeTag type={inc.incidentType} /></td>
      <td className="py-2.5 px-3 text-[11px]" style={{ fontFamily: FONT_SANS }}>
        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: getStationInfo(inc.station).color, marginRight: 5, verticalAlign: "middle" }} />
        <span style={{ color: "#c9d4e8" }}>{inc.station}</span>
      </td>
      <td className="py-2.5 px-3"><SevBadge sev={inc.severity} /></td>
      <td className="py-2.5 px-3"><StatusBadge status={inc.status} /></td>
      <td className="py-2.5 px-3 text-[10px] font-mono" style={{ color: "#4a5f78" }}>{inc.location}</td>
      <td className="py-2.5 px-3 text-[10px] font-mono" style={{ color: "#4a5f78" }}>{inc.time}</td>
      <td className="py-2.5 px-3"><ChevronRight size={12} style={{ color: "#4a5f78" }} /></td>
    </tr>
  );
});

export function Dashboard({ incidents, onSelectIncident, onNewIncident, userStation, mobile }: DashboardProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | IncidentStatus>("ALL");
  const [stationFilter, setStationFilter] = useState<"ALL" | string>("ALL");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const debouncedSearch = useDebounce(search, 200);

  const activeIncidents = useMemo(() => incidents.filter(i => i.status !== "RESOLVED"), [incidents]);
  const critical = useMemo(() => incidents.filter(i => i.status !== "RESOLVED" && i.severity === "CRITICAL"), [incidents]);
  const resolvedToday = useMemo(() => incidents.filter(i => i.status === "RESOLVED" && i.date === new Date().toISOString().slice(0, 10)), [incidents]);

  const filtered = useMemo(() => {
    return [...incidents]
      .filter(i => {
        const matchSearch = i.code.includes(debouncedSearch) || i.station.includes(debouncedSearch) || i.description.includes(debouncedSearch);
        const matchStatus = statusFilter === "ALL" || i.status === statusFilter;
        const matchStation = stationFilter === "ALL" || i.station === stationFilter;
        return matchSearch && matchStatus && matchStation;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
        if (sortBy === "oldest") return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
        const sevOrder: Record<Severity, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return (sevOrder[a.severity] ?? 99) - (sevOrder[b.severity] ?? 99);
      });
  }, [incidents, debouncedSearch, statusFilter, stationFilter, sortBy]);

  const statBarData = [
    { label: "Active", count: activeIncidents.length, color: "#f59e0b" },
    { label: "Critical", count: critical.length, color: "#ef4444" },
    { label: "Resolved Today", count: resolvedToday.length, color: "#10b981" },
    { label: "Total", count: incidents.length, color: "#06b6d4" },
  ];

  const stationList = [...new Set(incidents.map(i => i.station))].sort();

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <KPICard label="Active Incidents" value={String(activeIncidents.length)} sub={`${critical.length} critical`} color="#f59e0b" />
        <KPICard label="Critical" value={String(critical.length)} sub="requires immediate action" color="#ef4444" />
        <KPICard label="Resolved Today" value={String(resolvedToday.length)} sub="closed incidents" color="#10b981" />
        <KPICard label="Total Reported" value={String(incidents.length)} sub="all time" color="#06b6d4" />
      </div>

      {/* Search, Filters, Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search size={12} style={{ color: "#4a5f78", position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input type="text" placeholder="Search..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-2 sm:py-1.5 rounded text-[12px] sm:text-[11px] outline-none font-mono"
            style={{ background: "#080e1c", border: "1px solid rgba(100,140,200,0.1)", color: "#c9d4e8" }} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={onNewIncident}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-[10px] font-medium transition-all"
            style={{ background: "#f59e0b", color: "#04080f" }}>
            <Plus size={12} /> New
          </button>
          <div className="w-px h-4" style={{ background: "rgba(100,140,200,0.15)" }} />
          {["ALL", "OPEN", "ACTIVE", "RESOLVED"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s as "ALL" | IncidentStatus)}
              className="px-2.5 sm:px-2 py-1.5 sm:py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors"
              style={{
                background: statusFilter === s ? "rgba(245,158,11,0.12)" : "transparent",
                color: statusFilter === s ? "#f59e0b" : "#4a5f78",
                border: statusFilter === s ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
              }}>
              {s === "ALL" ? "All" : s}
            </button>
          ))}
          <div className="w-px h-4" style={{ background: "rgba(100,140,200,0.15)" }} />
          <button onClick={() => setSortBy(prev => prev === "newest" ? "oldest" : prev === "oldest" ? "severity" : "newest")}
            className="flex items-center gap-1 px-2 py-1.5 sm:py-1 rounded text-[10px] font-mono transition-colors"
            style={{ color: "#7a8fa8", border: "1px solid rgba(100,140,200,0.1)" }}>
            <ArrowUpDown size={10} />
            {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : "Severity"}
          </button>
        </div>
      </div>

      {/* Station filter chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
        <button onClick={() => setStationFilter("ALL")}
          className="px-2.5 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-colors"
          style={{
            background: stationFilter === "ALL" ? "rgba(245,158,11,0.12)" : "transparent",
            color: stationFilter === "ALL" ? "#f59e0b" : "#4a5f78",
            border: "1px solid " + (stationFilter === "ALL" ? "rgba(245,158,11,0.2)" : "transparent"),
          }}>All Stations</button>
        <button onClick={() => setStationFilter(userStation)}
          className="px-2.5 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-colors"
          style={{
            background: stationFilter === userStation ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.08)",
            color: stationFilter === userStation ? "#f59e0b" : "#10b981",
            border: "1px solid " + (stationFilter === userStation ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"),
          }}>
          <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: getStationInfo(userStation).color, marginRight: 4, verticalAlign: "middle" }} />
          My Station
        </button>
        {stationList.filter(s => s !== userStation).map(st => (
          <button key={st} onClick={() => setStationFilter(st)}
            className="px-2.5 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-colors"
            style={{
              background: stationFilter === st ? "rgba(245,158,11,0.12)" : "transparent",
              color: stationFilter === st ? "#f59e0b" : "#7a8fa8",
              border: "1px solid " + (stationFilter === st ? "rgba(245,158,11,0.2)" : "rgba(100,140,200,0.1)"),
            }}>
            <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: getStationInfo(st).color, marginRight: 4, verticalAlign: "middle" }} />
            {st}
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded border p-4 col-span-2" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <p className="text-[9px] font-mono uppercase tracking-widest mb-3" style={{ color: "#4a5f78" }}>Hourly Activity</p>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={HOURLY_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorCount2" x1={0} y1={0} x2={0} y2={1}>
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="h" tick={{ fontSize: 9, fill: "#4a5f78", fontFamily: FONT_MONO }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#4a5f78", fontFamily: FONT_MONO }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0c1428", border: "1px solid rgba(100,140,200,0.15)", borderRadius: 4, fontSize: 10, fontFamily: FONT_MONO }} />
              <Area type="monotone" dataKey="count" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCount2)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded border p-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <p className="text-[9px] font-mono uppercase tracking-widest mb-3" style={{ color: "#4a5f78" }}>Incident Status</p>
          <div className="flex flex-col gap-3 justify-center h-[130px]">
            {statBarData.map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px]" style={{ color: "#7a8fa8", fontFamily: FONT_SANS }}>{s.label}</span>
                  <span className="font-mono text-[10px]" style={{ color: s.color }}>{s.count}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(100,140,200,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(s.count / Math.max(...statBarData.map(x => x.count), 1)) * 100}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="rounded border p-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
        <p className="text-[9px] font-mono uppercase tracking-widest mb-3" style={{ color: "#4a5f78" }}>Weekly Overview — Incidents / Resolved</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={WEEKLY_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#4a5f78", fontFamily: FONT_SANS }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#4a5f78", fontFamily: FONT_MONO }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "#0c1428", border: "1px solid rgba(100,140,200,0.15)", borderRadius: 4, fontSize: 10, fontFamily: FONT_MONO }} />
            <Bar dataKey="incidents" name="Incidents" fill="#f59e0b" opacity={0.7} radius={[2,2,0,0]} />
            <Bar dataKey="resolved"  name="Resolved"  fill="#10b981" opacity={0.8} radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* All Incidents */}
      <div className="rounded border overflow-hidden" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(100,140,200,0.08)" }}>
          <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "#4a5f78" }}>
            Incidents {filtered.length < incidents.length && <span style={{ color: "#f59e0b" }}>({filtered.length})</span>}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[11px] font-mono mb-2" style={{ color: "#4a5f78" }}>No incidents found</p>
            {stationFilter !== "ALL" && (
              <button onClick={() => setStationFilter("ALL")} className="text-[10px] font-mono underline" style={{ color: "#f59e0b" }}>Clear filter</button>
            )}
          </div>
        ) : mobile ? (
          <div className="divide-y" style={{ borderColor: "rgba(100,140,200,0.05)" }}>
            {filtered.map(inc => <IncidentCard key={inc.id} inc={inc} onSelect={onSelectIncident} />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(100,140,200,0.08)" }}>
                  {["Code", "Type", "Station", "Severity", "Status", "Location", "Time", ""].map((h, i) => (
                    <th key={i} className="py-2.5 px-3 text-right text-[9px] font-mono uppercase tracking-widest" style={{ color: "#4a5f78" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inc => <IncidentRow key={inc.id} inc={inc} onSelect={onSelectIncident} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
