import { useState } from "react";
import { Download, BarChart3, FileSpreadsheet, FileText, Mail } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { KPICard } from "@/components/KPICard";
import { SevBadge, StatusBadge, TypeTag } from "@/components/ui/badge";
import { TYPE_COLORS, INCIDENT_TYPES, getStationInfo, SEV_CONFIG, FONT_SANS, FONT_MONO } from "@/config/constants";
import { WEEKLY_DATA } from "@/data/sample";
import type { Incident, ExtendedIncidentType } from "@/types";
import { exportToExcel, exportToPDF } from "@/lib/export";
import { emailReport } from "@/lib/email";

interface ReportsProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  mobile?: boolean;
}

export function Reports({ incidents, onSelectIncident, mobile }: ReportsProps) {
  const [typeFilter, setTypeFilter] = useState<"ALL"|ExtendedIncidentType>("ALL");
  const [section, setSection] = useState<"kpi"|"detailed">("kpi");

  const filtered = typeFilter === "ALL" ? incidents : incidents.filter(i => i.incidentType === typeFilter);
  const resolved = incidents.filter(i => i.status === "RESOLVED");
  const totalInjuries = incidents.reduce((a, b) => a + (b.impact?.injuries || 0), 0);
  const totalFatalities = incidents.reduce((a, b) => a + (b.impact?.fatalities || 0), 0);
  const totalDelays = incidents.reduce((a, b) => a + (b.impact?.trainDelay || 0), 0);
  const avgDuration = incidents.length ? Math.round(incidents.reduce((a, b) => a + (b.impact?.incidentDuration || 0), 0) / incidents.length) : 0;

  const byType = INCIDENT_TYPES.map(t => ({
    type: t,
    count: incidents.filter(i => i.incidentType === t).length,
    color: TYPE_COLORS[t] || "#6b7280",
  })).filter(b => b.count > 0);

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <KPICard label="Total Incidents" value={String(incidents.length)} sub="All recorded" color="#06b6d4" />
        <KPICard label="Closure Rate" value={`${incidents.length ? Math.round((resolved.length / incidents.length) * 100) : 0}%`} sub={`${resolved.length} closed`} color="#10b981" />
        <KPICard label="Total Injuries" value={String(totalInjuries)} sub={`${totalFatalities} fatalities`} color={totalInjuries > 0 ? "#ef4444" : "#10b981"} />
        <KPICard label="Train Delays" value={String(totalDelays)} unit="min" sub={`Avg ${avgDuration} min`} color="#f59e0b" />
      </div>

      {/* Section toggle + export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "kpi", label: "KPI Dashboard", icon: <BarChart3 size={12} /> },
            { key: "detailed", label: "Detailed Report", icon: <Download size={12} /> },
          ].map(s => (
            <button key={s.key} onClick={() => setSection(s.key as "kpi"|"detailed")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-all"
              style={{
                background: section === s.key ? "rgba(245,158,11,0.12)" : "transparent",
                border: section === s.key ? "1px solid rgba(245,158,11,0.3)" : "1px solid transparent",
                color: section === s.key ? "#f59e0b" : "#4a5f78",
              }}>
              {s.icon}
              <span style={{ fontFamily: FONT_SANS }}>{s.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => exportToExcel(incidents, `Report_${new Date().toISOString().slice(0, 10)}.xlsx`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-all hover:opacity-80"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontFamily: FONT_SANS }}>
            <FileSpreadsheet size={12} /> Excel
          </button>
          <button onClick={() => exportToPDF(incidents, `Report_${new Date().toISOString().slice(0, 10)}.pdf`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-all hover:opacity-80"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontFamily: FONT_SANS }}>
            <FileText size={12} /> PDF
          </button>
          <button onClick={() => emailReport(incidents)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-all hover:opacity-80"
            style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4", fontFamily: FONT_SANS }}>
            <Mail size={12} /> Email
          </button>
        </div>
      </div>

      {section === "kpi" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded border p-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
            <p className="text-[9px] font-mono uppercase tracking-widest mb-4" style={{ color: "#4a5f78" }}>Severity Distribution</p>
            <div className="space-y-3">
              {(["CRITICAL","HIGH","MEDIUM","LOW"] as const).map(s => {
                const count = incidents.filter(i => i.severity === s).length;
                const color = s === "CRITICAL" ? "#ef4444" : s === "HIGH" ? "#f97316" : s === "MEDIUM" ? "#f59e0b" : "#10b981";
                return (
                  <div key={s}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px]" style={{ color }}>{count}</span>
                      <span className="text-[10px]" style={{ color: "#7a8fa8", fontFamily: FONT_SANS }}>{SEV_CONFIG[s].label}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(100,140,200,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(count / incidents.length) * 100}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded border p-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
            <p className="text-[9px] font-mono uppercase tracking-widest mb-4" style={{ color: "#4a5f78" }}>Type Distribution</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {byType.slice(0, 10).map(b => (
                <div key={b.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px]" style={{ color: b.color }}>{b.count}</span>
                    <span className="text-[9px]" style={{ color: "#7a8fa8", fontFamily: FONT_SANS }}>{b.type}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(100,140,200,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(b.count / incidents.length) * 100}%`, background: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded border p-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
            <p className="text-[9px] font-mono uppercase tracking-widest mb-3" style={{ color: "#4a5f78" }}>Weekly — Incidents / Resolved</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={WEEKLY_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#4a5f78", fontFamily: FONT_SANS }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#4a5f78", fontFamily: FONT_MONO }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0c1428", border: "1px solid rgba(100,140,200,0.15)", borderRadius: 4, fontSize: 10, fontFamily: FONT_MONO }} />
                <Bar dataKey="incidents" name="Incidents" fill="#f59e0b" opacity={0.7} radius={[2,2,0,0]} />
                <Bar dataKey="resolved"  name="Resolved"  fill="#10b981" opacity={0.8} radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {section === "detailed" && (
        <div className="rounded border" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(100,140,200,0.08)" }}>
            <div className="flex items-center gap-2">
              <button onClick={() => exportToExcel(filtered, `Detailed_${new Date().toISOString().slice(0, 10)}.xlsx`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-all hover:opacity-80"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontFamily: FONT_SANS }}>
                <FileSpreadsheet size={12} /> Excel
              </button>
              <button onClick={() => exportToPDF(filtered, `Detailed_${new Date().toISOString().slice(0, 10)}.pdf`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-all hover:opacity-80"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontFamily: FONT_SANS }}>
                <FileText size={12} /> PDF
              </button>
              <button onClick={() => emailReport(filtered)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-all hover:opacity-80"
                style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4", fontFamily: FONT_SANS }}>
                <Mail size={12} /> Email
              </button>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <button onClick={() => setTypeFilter("ALL")}
                className="text-[10px] px-2 py-1 rounded font-mono transition-colors"
                style={{ background: typeFilter === "ALL" ? "rgba(245,158,11,0.12)" : "transparent", color: typeFilter === "ALL" ? "#f59e0b" : "#4a5f78" }}>All</button>
              {INCIDENT_TYPES.slice(0, 6).map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className="text-[10px] px-2 py-1 rounded font-mono transition-colors"
                  style={{ background: typeFilter === t ? "rgba(245,158,11,0.12)" : "transparent", color: typeFilter === t ? "#f59e0b" : "#4a5f78" }}>{t}</button>
              ))}
            </div>
          </div>
          {mobile ? (
            <div className="divide-y" style={{ borderColor: "rgba(100,140,200,0.05)" }}>
              {filtered.length === 0 && (
                <div className="py-8 text-center text-[11px] font-mono" style={{ color: "#4a5f78" }}>No incidents found</div>
              )}
              {filtered.map(inc => (
                <div key={inc.id} onClick={() => onSelectIncident(inc.id)}
                  className="px-4 py-3 active:bg-white/[0.03] transition-colors cursor-pointer"
                  style={{ borderColor: "rgba(100,140,200,0.05)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[12px]" style={{ color: "#7a8fa8" }}>{inc.code}</span>
                    <SevBadge sev={inc.severity} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <TypeTag type={inc.incidentType} />
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: getStationInfo(inc.station).color, verticalAlign: "middle" }} />
                    <span className="text-[11px]" style={{ color: "#c9d4e8" }}>{inc.station}</span>
                    <span className="text-[10px] font-mono" style={{ color: "#4a5f78" }}>{inc.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono" style={{ color: "#4a5f78" }}>
                    <span style={{ color: (inc.impact?.injuries || 0) > 0 ? "#ef4444" : "#4a5f78" }}>Inj: {inc.impact?.injuries || 0}</span>
                    <span style={{ color: (inc.impact?.fatalities || 0) > 0 ? "#ef4444" : "#4a5f78" }}>Fat: {inc.impact?.fatalities || 0}</span>
                    <span style={{ color: "#f59e0b" }}>Delay: {inc.impact?.trainDelay ? `${inc.impact.trainDelay}m` : "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(100,140,200,0.08)" }}>
                    {["Code", "Type", "Station", "Severity", "Status", "Date", "Injuries", "Fatalities", "Delay"].map((h, i) => (
                      <th key={i} className="py-2 px-3 text-right text-[9px] font-mono uppercase tracking-widest" style={{ color: "#4a5f78" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inc => (
                    <tr key={inc.id} className="border-b hover:bg-white/[0.02] cursor-pointer transition-colors" style={{ borderColor: "rgba(100,140,200,0.05)" }} onClick={() => onSelectIncident(inc.id)}>
                      <td className="py-2 px-3 font-mono text-[11px]" style={{ color: "#7a8fa8" }}>{inc.code}</td>
                      <td className="py-2 px-3"><TypeTag type={inc.incidentType} /></td>
                      <td className="py-2 px-3 text-[11px]" style={{ fontFamily: FONT_SANS }}>
                        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: getStationInfo(inc.station).color, marginRight: 5, verticalAlign: "middle" }} />
                        <span style={{ color: "#c9d4e8" }}>{inc.station}</span>
                      </td>
                      <td className="py-2 px-3"><SevBadge sev={inc.severity} /></td>
                      <td className="py-2 px-3"><StatusBadge status={inc.status} /></td>
                      <td className="py-2 px-3 text-[10px] font-mono" style={{ color: "#4a5f78" }}>{inc.date}</td>
                      <td className="py-2 px-3 text-[10px] font-mono" style={{ color: (inc.impact?.injuries || 0) > 0 ? "#ef4444" : "#4a5f78" }}>{inc.impact?.injuries || 0}</td>
                      <td className="py-2 px-3 text-[10px] font-mono" style={{ color: (inc.impact?.fatalities || 0) > 0 ? "#ef4444" : "#4a5f78" }}>{inc.impact?.fatalities || 0}</td>
                      <td className="py-2 px-3 text-[10px] font-mono" style={{ color: "#f59e0b" }}>{inc.impact?.trainDelay ? `${inc.impact.trainDelay} min` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
