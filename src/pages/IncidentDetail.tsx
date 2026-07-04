import { ArrowLeft, Edit3, Trash2, Mail, Info, Bell, AlertTriangle, Users, Train, Building2, ClipboardCheck, BarChart3 } from "lucide-react";
import { SEV_CONFIG, FONT_SANS, FONT_MONO, getStationInfo } from "@/config/constants";
import { SevBadge, StatusBadge } from "@/components/ui/badge";
import type { Incident } from "@/types";
import { emailIncident } from "@/lib/email";

interface Props {
  incident: Incident;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function IncidentDetail({ incident, onBack, onEdit, onDelete }: Props) {
  const sevConf = SEV_CONFIG[incident.severity];

  function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
      <div className="rounded border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
          <span style={{ color: "var(--primary)" }}>{icon}</span>
          <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>{title}</span>
        </div>
        <div className="space-y-1">{children}</div>
      </div>
    );
  }

  function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
    return (
      <div className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
        <span className="text-[11px]" style={{ color: valueColor || "var(--foreground)", fontFamily: FONT_SANS }}>{value}</span>
        <span className="text-[9px] font-mono" style={{ color: "var(--muted-foreground)" }}>{label}</span>
      </div>
    );
  }

  const d = incident.detection;
  const p = incident.passenger;
  const t = incident.trainOps;
  const e = incident.evacuation;
  const s = incident.staff;
  const im = incident.impact;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={onBack} className="p-1.5 rounded hover:bg-white/5 transition-colors mt-0.5" style={{ color: "var(--muted-foreground)", border: "1px solid rgba(100,140,200,0.1)" }}>
          <ArrowLeft size={14} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-[13px]" style={{ color: "var(--foreground)" }}>{incident.code}</span>
            <SevBadge sev={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
          <p className="text-[11px]" style={{ color: "var(--secondary-foreground)", fontFamily: FONT_SANS }}>
            {incident.date} ({incident.day}) · {incident.time} · {incident.shift}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onEdit && (
          <button onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-all hover:opacity-80"
            style={{ background: "rgba(var(--primary-rgb), 0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--primary)", fontFamily: FONT_SANS }}>
            <Edit3 size={12} /> Edit
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-all hover:opacity-80"
            style={{ background: "rgba(var(--destructive-rgb), 0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--destructive)", fontFamily: FONT_SANS }}>
            <Trash2 size={12} /> Delete
          </button>
        )}
        <button onClick={() => emailIncident(incident)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] transition-all hover:opacity-80 ml-auto"
          style={{ background: "rgba(var(--accent-rgb), 0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "var(--accent)", fontFamily: FONT_SANS }}>
          <Mail size={12} /> Email
        </button>
      </div>

      {/* Grid of sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1 - General */}
        <Section title="General Information" icon={<Info size={13} />}>
          <Row label="Incident No." value={incident.code} />
          <Row label="Date" value={`${incident.date} (${incident.day})`} />
          <Row label="Time" value={incident.time} />
          <Row label="Shift" value={incident.shift} />
          <Row label="Station" value={incident.station} valueColor={getStationInfo(incident.station).color} />
          <Row label="Location" value={incident.location} />
        </Section>

        {/* 2 - Detection */}
        <Section title="Detection & Reporting" icon={<Bell size={13} />}>
          {d ? (
            <>
              <Row label="Discovered By" value={d.discoveredBy} />
              <Row label="Reported By" value={d.reportedBy} />
              <Row label="Discovery Time" value={d.discoveryTime} />
              <Row label="OCC Notification" value={d.occNotificationTime} />
              <Row label="OCC Response" value={d.occResponseTime} />
              <Row label="Emergency Code" value={d.emergencyCode} />
              <Row label="Permit No." value={d.permitNumber} />
            </>
          ) : <Row label="Info" value="No detection data" />}
        </Section>

        {/* 3 - Type */}
        <Section title="Incident Type & Severity" icon={<AlertTriangle size={13} />}>
          <Row label="Type" value={incident.incidentType} />
          <Row label="Severity" value={sevConf.label} />
          <Row label="Status" value={incident.status} />
        </Section>

        {/* 4 - Passenger (medical only) */}
        {incident.incidentType === "Passenger Medical Incident" || incident.incidentType === "Injury or Fall" ? (
          <Section title="Passenger Data" icon={<Users size={13} />}>
            {p ? (
              <>
                <Row label="Name" value={p.name} />
                <Row label="Age" value={String(p.age)} />
                <Row label="Phone" value={p.phone} />
                <Row label="Emergency Contact" value={p.emergencyContact} />
                <Row label="Status" value={p.status} />
                <Row label="First Aid" value={p.firstAidProvided} />
                <Row label="Ambulance Request" value={p.ambulanceRequestTime || "—"} />
                <Row label="Ambulance Arrival" value={p.ambulanceArrivalTime || "—"} />
                <Row label="Handover" value={p.handoverTime || "—"} />
                <Row label="Departure" value={p.departureTime || "—"} />
                <Row label="Hospital" value={p.hospital || "—"} />
                <Row label="Ambulance Ref" value={p.ambulanceRef || "—"} />
              </>
            ) : <Row label="Info" value="No passenger data" />}
          </Section>
        ) : null}

        {/* 5 - Train ops (train-related only) */}
        {t ? (
          <Section title="Train Operations" icon={<Train size={13} />}>
            <Row label="Train No." value={t.trainNumber} />
            <Row label="Current Location" value={t.currentLocation} />
            <Row label="Destination" value={t.destination} />
            <Row label="Operation Mode" value={t.operationMode} />
            <Row label="Rescue Train" value={t.rescueTrainNumber || "—"} />
            <Row label="Rescue Start" value={t.rescueStartTime || "—"} />
            <Row label="Rescue End" value={t.rescueEndTime || "—"} />
            <Row label="OCC Handover" value={t.handoverToOccTime || "—"} />
            <Row label="Return to Service" value={t.returnToServiceTime || "—"} />
          </Section>
        ) : null}

        {/* 6 - Evacuation */}
        {e ? (
          <Section title="Station Evacuation" icon={<Building2 size={13} />}>
            <Row label="OCC Order" value={e.occOrderTime || "—"} />
            <Row label="Evacuation Start" value={e.evacuationStartTime || "—"} />
            <Row label="Evacuation Complete" value={e.evacuationCompleteTime || "—"} />
            <Row label="Station Clear" value={e.stationClearReportTime || "—"} />
            <Row label="Station Reopen" value={e.stationReopenTime || "—"} />
          </Section>
        ) : null}

        {/* 7 - Staff */}
        {s ? (
          <Section title="Staff" icon={<ClipboardCheck size={13} />}>
            {s.sm && <Row label="Station Manager" value={`${s.sm.name} (${s.sm.role})`} />}
            {s.asm && <Row label="Asst. Manager" value={`${s.asm.name} (${s.asm.role})`} />}
            {s.sa && <Row label="Ambassador" value={`${s.sa.name} (${s.sa.role})`} />}
            {s.security && <Row label="Security" value={`${s.security.name} (${s.security.role})`} />}
            {s.maintenance && <Row label="Maintenance" value={`${s.maintenance.name} (${s.maintenance.role})`} />}
            {s.ambulance && <Row label="Ambulance" value={`${s.ambulance.name} (${s.ambulance.role})`} />}
            {s.police && <Row label="Police" value={`${s.police.name} (${s.police.role})`} />}
            {s.civilDefense && <Row label="Civil Defense" value={`${s.civilDefense.name} (${s.civilDefense.role})`} />}
            {s.other.length > 0 && s.other.map((m, i) => (
              <Row key={i} label={`Other #${i + 1}`} value={`${m.name} (${m.role})`} />
            ))}
            {!s.sm && !s.asm && !s.sa && s.other.length === 0 && <Row label="Info" value="No staff data" />}
          </Section>
        ) : null}

        {/* 8 - Impact */}
        {im ? (
          <Section title="Impact Assessment" icon={<BarChart3 size={13} />}>
            <Row label="Duration (min)" value={String(im.incidentDuration)} />
            <Row label="Response Time" value={String(im.responseDuration)} />
            <Row label="Evacuation Time" value={String(im.evacuationDuration)} />
            <Row label="Rescue Time" value={String(im.trainRescueDuration)} />
            <Row label="Train Delay" value={im.trainDelay ? `${im.trainDelay} min` : "—"} />
            <Row label="Affected Pass." value={String(im.affectedPassengers)} />
            <Row label="Affected Equipment" value={im.affectedEquipment || "—"} />
            <Row label="Injuries" value={String(im.injuries)} valueColor={im.injuries > 0 ? "var(--destructive)" : undefined} />
            <Row label="Fatalities" value={String(im.fatalities)} valueColor={im.fatalities > 0 ? "var(--destructive)" : undefined} />
            <Row label="Root Cause" value={im.rootCause || "—"} />
            <Row label="Corrective Actions" value={im.correctiveActions || "—"} />
            <Row label="Lessons Learned" value={im.lessonsLearned || "—"} />
          </Section>
        ) : null}
      </div>
    </div>
  );
}
