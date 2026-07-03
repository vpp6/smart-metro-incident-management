import { useState } from "react";
import {
  CheckCircle, Info, Bell, AlertTriangle, Users, Train,
  Building2, ClipboardCheck, BarChart3, ChevronLeft,
} from "lucide-react";
import { STATION_NAMES, getStationInfo, SEV_CONFIG, LOCATIONS, SHIFTS, DISCOVERERS, INCIDENT_TYPES, TYPE_COLORS, TRAIN_MODES, PASSENGER_STATUSES, STAFF_POOL, FONT_SANS } from "@/config/constants";
import { nowHHMM, todayYYYYMMDD, getDayName, getShift } from "@/lib/utils";
import type { Incident, ExtendedIncidentType, Severity, Location, Shift, Discoverer, TrainMode, PassengerStatus } from "@/types";

const STEPS = [
  { key: "general",    label: "General Info",          icon: <Info size={14} /> },
  { key: "detection",  label: "Detection & Reporting", icon: <Bell size={14} /> },
  { key: "type",       label: "Incident Type",         icon: <AlertTriangle size={14} /> },
  { key: "passenger",  label: "Passenger Data",        icon: <Users size={14} /> },
  { key: "train",      label: "Train Operations",      icon: <Train size={14} /> },
  { key: "evacuation", label: "Station Evacuation",    icon: <Building2 size={14} /> },
  { key: "staff",      label: "Staff",                 icon: <ClipboardCheck size={14} /> },
  { key: "impact",     label: "Impact Assessment",     icon: <BarChart3 size={14} /> },
];

type StepKey = typeof STEPS[number]["key"];

interface FormData {
  date: string;
  day: string;
  time: string;
  shift: Shift;
  station: string;
  location: Location;
  description: string;
  discoveredBy: Discoverer;
  reportedBy: string;
  discoveryTime: string;
  occNotificationTime: string;
  occResponseTime: string;
  emergencyCode: string;
  permitNumber: string;
  incidentType: ExtendedIncidentType;
  severity: Severity;
  passengerName: string;
  passengerAge: string;
  passengerPhone: string;
  emergencyContact: string;
  passengerStatus: PassengerStatus;
  firstAidProvided: string;
  ambulanceRequestTime: string;
  ambulanceArrivalTime: string;
  handoverTime: string;
  departureTime: string;
  hospital: string;
  ambulanceRef: string;
  trainNumber: string;
  currentLocation: string;
  destination: string;
  operationMode: TrainMode;
  rescueTrainNumber: string;
  rescueStartTime: string;
  rescueEndTime: string;
  handoverToOccTime: string;
  returnToServiceTime: string;
  occOrderTime: string;
  evacuationStartTime: string;
  evacuationCompleteTime: string;
  stationClearReportTime: string;
  stationReopenTime: string;
  smName: string;
  smJob: string;
  asmName: string;
  asmJob: string;
  saName: string;
  saJob: string;
  securityName: string;
  securityJob: string;
  maintenanceName: string;
  maintenanceJob: string;
  ambulanceName: string;
  ambulanceJob: string;
  policeName: string;
  policeJob: string;
  civilDefenseName: string;
  civilDefenseJob: string;
  otherStaff: string;
  rootCause: string;
  correctiveActions: string;
  lessonsLearned: string;
  injuries: string;
  fatalities: string;
  affectedPassengers: string;
  affectedEquipment: string;
  trainDelay: string;
}

interface Props {
  onSubmit: (inc: Partial<Incident>) => void;
}

export function NewIncidentForm({ onSubmit }: Props) {
  const [step, setStep] = useState<StepKey>("general");
  const [submitted, setSubmitted] = useState(false);
  const now = nowHHMM();
  const today = todayYYYYMMDD();

  const [f, setF] = useState<FormData>({
    date: today, day: getDayName(new Date()), time: now, shift: getShift(new Date().getHours()),
    station: STATION_NAMES[0], location: "Platform", description: "",
    discoveredBy: "OCC", reportedBy: "", discoveryTime: now,
    occNotificationTime: now, occResponseTime: now, emergencyCode: "", permitNumber: "",
    incidentType: "Passenger Medical Incident", severity: "MEDIUM",
    passengerName: "", passengerAge: "", passengerPhone: "", emergencyContact: "",
    passengerStatus: "Stable", firstAidProvided: "", ambulanceRequestTime: "",
    ambulanceArrivalTime: "", handoverTime: "", departureTime: "", hospital: "", ambulanceRef: "",
    trainNumber: "", currentLocation: "", destination: "", operationMode: "UTO",
    rescueTrainNumber: "", rescueStartTime: "", rescueEndTime: "",
    handoverToOccTime: "", returnToServiceTime: "",
    occOrderTime: "", evacuationStartTime: "", evacuationCompleteTime: "",
    stationClearReportTime: "", stationReopenTime: "",
    smName: "", smJob: "", asmName: "", asmJob: "", saName: "", saJob: "",
    securityName: "", securityJob: "", maintenanceName: "", maintenanceJob: "",
    ambulanceName: "", ambulanceJob: "", policeName: "", policeJob: "",
    civilDefenseName: "", civilDefenseJob: "", otherStaff: "",
    rootCause: "", correctiveActions: "", lessonsLearned: "",
    injuries: "0", fatalities: "0", affectedPassengers: "0", affectedEquipment: "", trainDelay: "0",
  });

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setF(prev => ({ ...prev, [k]: v }));
  }

  const trainRelated = ["Train Breakdown", "Train Rescue", "Door Isolation", "Parking Brake", "Air Brake", "Train Positioning Loss", "Track Access", "Switch Point Failure"];
  const isTrainRelated = trainRelated.includes(f.incidentType);
  const isMedical = f.incidentType === "Passenger Medical Incident" || f.incidentType === "Injury or Fall";

  const stepIndex = STEPS.findIndex(s => s.key === step);
  const totalSteps = STEPS.length;

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => {
      const inc: Partial<Incident> = {
        id: String(Date.now()),
        code: `INC-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
        date: f.date,
        day: f.day,
        time: f.time,
        shift: f.shift,
        station: f.station,
        location: f.location,
        description: f.description,
        incidentType: f.incidentType,
        severity: f.severity,
        status: "OPEN",
        reportedAt: new Date(),
        assignedStaff: [],
        detection: {
          discoveredBy: f.discoveredBy,
          reportedBy: f.reportedBy,
          discoveryTime: f.discoveryTime,
          occNotificationTime: f.occNotificationTime,
          occResponseTime: f.occResponseTime,
          emergencyCode: f.emergencyCode,
          permitNumber: f.permitNumber,
        },
        ...(isMedical ? {
          passenger: {
            name: f.passengerName, age: Number(f.passengerAge), phone: f.passengerPhone,
            emergencyContact: f.emergencyContact, status: f.passengerStatus,
            firstAidProvided: f.firstAidProvided, ambulanceRequestTime: f.ambulanceRequestTime,
            ambulanceArrivalTime: f.ambulanceArrivalTime, handoverTime: f.handoverTime,
            departureTime: f.departureTime, hospital: f.hospital, ambulanceRef: f.ambulanceRef,
          },
        } : {}),
        ...(isTrainRelated ? {
          trainOps: {
            trainNumber: f.trainNumber, currentLocation: f.currentLocation, destination: f.destination,
            operationMode: f.operationMode, rescueTrainNumber: f.rescueTrainNumber,
            rescueStartTime: f.rescueStartTime, rescueEndTime: f.rescueEndTime,
            handoverToOccTime: f.handoverToOccTime, returnToServiceTime: f.returnToServiceTime,
          },
        } : {}),
        evacuation: {
          occOrderTime: f.occOrderTime, evacuationStartTime: f.evacuationStartTime,
          evacuationCompleteTime: f.evacuationCompleteTime, stationClearReportTime: f.stationClearReportTime,
          stationReopenTime: f.stationReopenTime,
        },
        impact: {
          incidentDuration: 0, responseDuration: 0, evacuationDuration: 0, trainRescueDuration: 0,
          trainDelay: Number(f.trainDelay), affectedPassengers: Number(f.affectedPassengers),
          affectedEquipment: f.affectedEquipment, injuries: Number(f.injuries), fatalities: Number(f.fatalities),
          rootCause: f.rootCause, correctiveActions: f.correctiveActions, lessonsLearned: f.lessonsLearned,
          closed: false,
        },
      };
      onSubmit(inc);
    }, 600);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <CheckCircle size={32} style={{ color: "#10b981" }} />
        </div>
        <p className="text-lg font-semibold" style={{ color: "#c9d4e8", fontFamily: FONT_SANS }}>Incident Recorded Successfully</p>
        <p className="text-[12px] font-mono" style={{ color: "#4a5f78" }}>Sending alerts to the relevant team...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step pills */}
      <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 mb-6" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div className="flex gap-1.5 p-2 rounded border min-w-max" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          {STEPS.map((s, i) => (
            <button key={s.key} onClick={() => setStep(s.key)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] transition-all whitespace-nowrap"
              style={{
                background: step === s.key ? "rgba(245,158,11,0.15)" : "transparent",
                border: step === s.key ? "1px solid rgba(245,158,11,0.3)" : "1px solid transparent",
                color: step === s.key ? "#f59e0b" : "#4a5f78",
              }}>
              {s.icon}
              <span style={{ fontFamily: FONT_SANS, fontSize: 10 }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full overflow-hidden mb-6" style={{ background: "rgba(100,140,200,0.1)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%`, background: "#f59e0b" }} />
      </div>

      {/* ─── STEP 1: General ─────────────────────────────── */}
      {step === "general" && (
        <div className="rounded border p-4 space-y-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <SectionTitle>General Information</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Field label="Date" value={f.date} onChange={v => set("date", v)} type="date" />
            <Field label="Day" value={f.day} onChange={v => set("day", v)} type="text" />
            <Field label="Time" value={f.time} onChange={v => set("time", v)} type="time" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Select label="Shift" value={f.shift} onChange={v => set("shift", v as Shift)} options={SHIFTS} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Select label="Station" value={f.station} onChange={v => set("station", v)} options={STATION_NAMES} colorMap={Object.fromEntries(STATION_NAMES.map(n => [n, getStationInfo(n).color]))} />
            <Select label="Location" value={f.location} onChange={v => set("location", v as Location)} options={LOCATIONS} />
          </div>
          <TextArea label="Incident Description" value={f.description} onChange={v => set("description", v)} rows={3} />
        </div>
      )}

      {/* ─── STEP 2: Detection & Reporting ──────────────── */}
      {step === "detection" && (
        <div className="rounded border p-4 space-y-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <SectionTitle>Detection & Reporting</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Select label="Discovered By" value={f.discoveredBy} onChange={v => set("discoveredBy", v as Discoverer)} options={DISCOVERERS} />
            <Field label="Reported By" value={f.reportedBy} onChange={v => set("reportedBy", v)} type="text" />
            <Field label="Discovery Time" value={f.discoveryTime} onChange={v => set("discoveryTime", v)} type="time" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Field label="OCC Notification" value={f.occNotificationTime} onChange={v => set("occNotificationTime", v)} type="time" />
            <Field label="OCC Response" value={f.occResponseTime} onChange={v => set("occResponseTime", v)} type="time" />
            <Field label="Emergency Code" value={f.emergencyCode} onChange={v => set("emergencyCode", v)} type="text" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Field label="Permit Number" value={f.permitNumber} onChange={v => set("permitNumber", v)} type="text" />
          </div>
        </div>
      )}

      {/* ─── STEP 3: Incident Type ──────────────────────── */}
      {step === "type" && (
        <div className="rounded border p-4 space-y-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <SectionTitle>Incident Type & Severity</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Select label="Incident Type" value={f.incidentType} onChange={v => set("incidentType", v as ExtendedIncidentType)} options={INCIDENT_TYPES} colorMap={TYPE_COLORS} />
            <Select label="Severity" value={f.severity} onChange={v => set("severity", v as Severity)} options={["CRITICAL", "HIGH", "MEDIUM", "LOW"]} colorMap={{ CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#10b981" }} />
          </div>
        </div>
      )}

      {/* ─── STEP 4: Passenger (conditional) ────────────── */}
      {step === "passenger" && (
        <div className="rounded border p-4 space-y-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <SectionTitle>Passenger Data</SectionTitle>
          {isMedical ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <Field label="Name" value={f.passengerName} onChange={v => set("passengerName", v)} type="text" />
                <Field label="Age" value={f.passengerAge} onChange={v => set("passengerAge", v)} type="number" />
                <Field label="Phone" value={f.passengerPhone} onChange={v => set("passengerPhone", v)} type="text" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <Field label="Emergency Contact" value={f.emergencyContact} onChange={v => set("emergencyContact", v)} type="text" />
                <Select label="Status" value={f.passengerStatus} onChange={v => set("passengerStatus", v as PassengerStatus)} options={PASSENGER_STATUSES} colorMap={{ Stable: "#10b981", Moderate: "#f59e0b", Critical: "#ef4444", Deceased: "#6b7280" }} />
                <Field label="First Aid Provided" value={f.firstAidProvided} onChange={v => set("firstAidProvided", v)} type="text" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <Field label="Ambulance Request" value={f.ambulanceRequestTime} onChange={v => set("ambulanceRequestTime", v)} type="time" />
                <Field label="Ambulance Arrival" value={f.ambulanceArrivalTime} onChange={v => set("ambulanceArrivalTime", v)} type="time" />
                <Field label="Handover Time" value={f.handoverTime} onChange={v => set("handoverTime", v)} type="time" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <Field label="Departure Time" value={f.departureTime} onChange={v => set("departureTime", v)} type="time" />
                <Field label="Hospital" value={f.hospital} onChange={v => set("hospital", v)} type="text" />
                <Field label="Ambulance Ref" value={f.ambulanceRef} onChange={v => set("ambulanceRef", v)} type="text" />
              </div>
            </>
          ) : (
            <p className="text-[11px]" style={{ color: "#4a5f78", fontFamily: FONT_SANS }}>Passenger medical data is only available for medical incidents.</p>
          )}
        </div>
      )}

      {/* ─── STEP 5: Train Operations (conditional) ─────── */}
      {step === "train" && (
        <div className="rounded border p-4 space-y-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <SectionTitle>Train Operations</SectionTitle>
          {isTrainRelated ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <Field label="Train Number" value={f.trainNumber} onChange={v => set("trainNumber", v)} type="text" />
                <Field label="Current Location" value={f.currentLocation} onChange={v => set("currentLocation", v)} type="text" />
                <Field label="Destination" value={f.destination} onChange={v => set("destination", v)} type="text" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <Select label="Operation Mode" value={f.operationMode} onChange={v => set("operationMode", v as TrainMode)} options={TRAIN_MODES} />
                <Field label="Rescue Train No." value={f.rescueTrainNumber} onChange={v => set("rescueTrainNumber", v)} type="text" />
                <Field label="Rescue Start" value={f.rescueStartTime} onChange={v => set("rescueStartTime", v)} type="time" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <Field label="Rescue End" value={f.rescueEndTime} onChange={v => set("rescueEndTime", v)} type="time" />
                <Field label="OCC Handover" value={f.handoverToOccTime} onChange={v => set("handoverToOccTime", v)} type="time" />
                <Field label="Return to Service" value={f.returnToServiceTime} onChange={v => set("returnToServiceTime", v)} type="time" />
              </div>
            </>
          ) : (
            <p className="text-[11px]" style={{ color: "#4a5f78", fontFamily: FONT_SANS }}>Train operation data is only available for train-related incidents.</p>
          )}
        </div>
      )}

      {/* ─── STEP 6: Evacuation ────────────────────────── */}
      {step === "evacuation" && (
        <div className="rounded border p-4 space-y-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <SectionTitle>Station Evacuation</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Field label="OCC Order Time" value={f.occOrderTime} onChange={v => set("occOrderTime", v)} type="time" />
            <Field label="Evacuation Start" value={f.evacuationStartTime} onChange={v => set("evacuationStartTime", v)} type="time" />
            <Field label="Evacuation Complete" value={f.evacuationCompleteTime} onChange={v => set("evacuationCompleteTime", v)} type="time" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Field label="Station Clear Report" value={f.stationClearReportTime} onChange={v => set("stationClearReportTime", v)} type="time" />
            <Field label="Station Reopen" value={f.stationReopenTime} onChange={v => set("stationReopenTime", v)} type="time" />
          </div>
        </div>
      )}

      {/* ─── STEP 7: Staff ──────────────────────────────── */}
      {step === "staff" && (
        <div className="rounded border p-4 space-y-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <SectionTitle>Staff</SectionTitle>
          <p className="text-[10px]" style={{ color: "#f59e0b", fontFamily: FONT_SANS }}>Enter each person with their job number</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>
            <Field label="Station Manager Name" value={f.smName} onChange={v => set("smName", v)} type="text" />
            <Field label="Station Manager Job No." value={f.smJob} onChange={v => set("smJob", v)} type="text" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>
            <Field label="Asst. Manager Name" value={f.asmName} onChange={v => set("asmName", v)} type="text" />
            <Field label="Asst. Manager Job No." value={f.asmJob} onChange={v => set("asmJob", v)} type="text" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>
            <Field label="Ambassador Name" value={f.saName} onChange={v => set("saName", v)} type="text" />
            <Field label="Ambassador Job No." value={f.saJob} onChange={v => set("saJob", v)} type="text" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>
            <Field label="Security Name" value={f.securityName} onChange={v => set("securityName", v)} type="text" />
            <Field label="Security Job No." value={f.securityJob} onChange={v => set("securityJob", v)} type="text" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>
            <Field label="Maintenance Name" value={f.maintenanceName} onChange={v => set("maintenanceName", v)} type="text" />
            <Field label="Maintenance Job No." value={f.maintenanceJob} onChange={v => set("maintenanceJob", v)} type="text" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>
            <Field label="Ambulance Name" value={f.ambulanceName} onChange={v => set("ambulanceName", v)} type="text" />
            <Field label="Ambulance Job No." value={f.ambulanceJob} onChange={v => set("ambulanceJob", v)} type="text" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>
            <Field label="Police Name" value={f.policeName} onChange={v => set("policeName", v)} type="text" />
            <Field label="Police Job No." value={f.policeJob} onChange={v => set("policeJob", v)} type="text" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>
            <Field label="Civil Defense Name" value={f.civilDefenseName} onChange={v => set("civilDefenseName", v)} type="text" />
            <Field label="Civil Defense Job No." value={f.civilDefenseJob} onChange={v => set("civilDefenseJob", v)} type="text" />
          </div>
          <TextArea label="Other Staff (name — job) one per line" value={f.otherStaff} onChange={v => set("otherStaff", v)} rows={3} />
        </div>
      )}

      {/* ─── STEP 8: Impact Assessment ──────────────────── */}
      {step === "impact" && (
        <div className="rounded border p-4 space-y-4" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <SectionTitle>Impact Assessment</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Field label="Injuries" value={f.injuries} onChange={v => set("injuries", v)} type="number" />
            <Field label="Fatalities" value={f.fatalities} onChange={v => set("fatalities", v)} type="number" />
            <Field label="Affected Passengers" value={f.affectedPassengers} onChange={v => set("affectedPassengers", v)} type="number" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Field label="Train Delay (min)" value={f.trainDelay} onChange={v => set("trainDelay", v)} type="number" />
            <Field label="Affected Equipment" value={f.affectedEquipment} onChange={v => set("affectedEquipment", v)} type="text" />
          </div>
          <TextArea label="Root Cause" value={f.rootCause} onChange={v => set("rootCause", v)} rows={2} />
          <TextArea label="Corrective Actions" value={f.correctiveActions} onChange={v => set("correctiveActions", v)} rows={2} />
          <TextArea label="Lessons Learned" value={f.lessonsLearned} onChange={v => set("lessonsLearned", v)} rows={2} />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <button onClick={() => { const idx = STEPS.findIndex(s => s.key === step); if (idx > 0) setStep(STEPS[idx - 1].key); }}
          className="flex items-center gap-1.5 px-4 py-2.5 sm:py-2 rounded text-[12px] sm:text-[11px] transition-colors disabled:opacity-30"
          style={{ background: "rgba(100,140,200,0.08)", border: "1px solid rgba(100,140,200,0.15)", color: "#7a8fa8" }}
          disabled={stepIndex === 0}>
          <ChevronLeft size={14} /> Back
        </button>

        {stepIndex < totalSteps - 1 ? (
          <button onClick={() => setStep(STEPS[stepIndex + 1].key)}
            className="flex items-center gap-1.5 px-5 py-2.5 sm:py-2 rounded text-[12px] sm:text-[11px] transition-colors"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" }}>
            Next
          </button>
        ) : (
          <button onClick={handleSubmit}
            className="flex items-center gap-1.5 px-5 py-2.5 sm:py-2 rounded text-[12px] sm:text-[11px] transition-colors"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
            Submit Report
          </button>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "#4a5f78" }}>{children}</p>
  );
}

function Field({ label, value, onChange, type }: {
  label: string; value: string; onChange: (v: string) => void; type: string;
}) {
  return (
    <div>
      <label className="block text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: "#4a5f78" }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2.5 sm:py-2 rounded text-[13px] sm:text-[12px] outline-none"
          style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8", fontFamily: FONT_SANS, textAlign: "left", minHeight: 40 }} />
    </div>
  );
}

function Select({ label, value, onChange, options, colorMap }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; colorMap?: Record<string, string>;
}) {
  const dotColor = colorMap?.[value];
  return (
    <div>
      <label className="block text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: "#4a5f78" }}>
        {dotColor && <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: dotColor, marginRight: 6, verticalAlign: "middle" }} />}
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2.5 sm:py-2 rounded text-[13px] sm:text-[12px] outline-none"
          style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8", fontFamily: FONT_SANS, textAlign: "left", minHeight: 40 }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function TextArea({ label, value, onChange, rows }: {
  label: string; value: string; onChange: (v: string) => void; rows: number;
}) {
  return (
    <div>
      <label className="block text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: "#4a5f78" }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
          className="w-full px-3 py-2.5 sm:py-2 rounded text-[13px] sm:text-[12px] outline-none resize-none"
          style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8", fontFamily: FONT_SANS, textAlign: "left" }} />
    </div>
  );
}
