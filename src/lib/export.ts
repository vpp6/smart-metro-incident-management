import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Incident } from "@/types";

function sectionLabel(s: string) {
  const map: Record<string, string> = {
    general: "General Information",
    detection: "Detection & Reporting",
    type: "Incident Type & Severity",
    passenger: "Passenger Data",
    train: "Train Operations",
    evacuation: "Station Evacuation",
    staff: "Staff",
    impact: "Impact Assessment",
  };
  return map[s] || s;
}

function buildRows(incidents: Incident[]) {
  return incidents.map(inc => ({
    code: inc.code,
    date: inc.date,
    day: inc.day,
    time: inc.time,
    shift: inc.shift,
    station: inc.station,
    location: inc.location,
    description: inc.description,
    incidentType: inc.incidentType,
    severity: inc.severity,
    status: inc.status,
    discoveredBy: inc.detection?.discoveredBy ?? "—",
    reportedBy: inc.detection?.reportedBy ?? "—",
    discoveryTime: inc.detection?.discoveryTime ?? "—",
    occNotificationTime: inc.detection?.occNotificationTime ?? "—",
    occResponseTime: inc.detection?.occResponseTime ?? "—",
    emergencyCode: inc.detection?.emergencyCode ?? "—",
    permitNumber: inc.detection?.permitNumber ?? "—",
    passengerName: inc.passenger?.name ?? "—",
    passengerAge: inc.passenger?.age ?? "—",
    passengerPhone: inc.passenger?.phone ?? "—",
    passengerEmergencyContact: inc.passenger?.emergencyContact ?? "—",
    passengerStatus: inc.passenger?.status ?? "—",
    firstAidProvided: inc.passenger?.firstAidProvided ?? "—",
    ambulanceRequestTime: inc.passenger?.ambulanceRequestTime ?? "—",
    ambulanceArrivalTime: inc.passenger?.ambulanceArrivalTime ?? "—",
    handoverTime: inc.passenger?.handoverTime ?? "—",
    departureTime: inc.passenger?.departureTime ?? "—",
    hospital: inc.passenger?.hospital ?? "—",
    ambulanceRef: inc.passenger?.ambulanceRef ?? "—",
    trainNumber: inc.trainOps?.trainNumber ?? "—",
    currentLocation: inc.trainOps?.currentLocation ?? "—",
    destination: inc.trainOps?.destination ?? "—",
    operationMode: inc.trainOps?.operationMode ?? "—",
    rescueTrainNumber: inc.trainOps?.rescueTrainNumber ?? "—",
    rescueStartTime: inc.trainOps?.rescueStartTime ?? "—",
    rescueEndTime: inc.trainOps?.rescueEndTime ?? "—",
    handoverToOccTime: inc.trainOps?.handoverToOccTime ?? "—",
    returnToServiceTime: inc.trainOps?.returnToServiceTime ?? "—",
    occOrderTime: inc.evacuation?.occOrderTime ?? "—",
    evacuationStartTime: inc.evacuation?.evacuationStartTime ?? "—",
    evacuationCompleteTime: inc.evacuation?.evacuationCompleteTime ?? "—",
    stationClearReportTime: inc.evacuation?.stationClearReportTime ?? "—",
    stationReopenTime: inc.evacuation?.stationReopenTime ?? "—",
    staffSM: inc.staff?.sm?.name ? `${inc.staff.sm.name} (${inc.staff.sm.role})` : "—",
    staffASM: inc.staff?.asm?.name ? `${inc.staff.asm.name} (${inc.staff.asm.role})` : "—",
    staffSA: inc.staff?.sa?.name ? `${inc.staff.sa.name} (${inc.staff.sa.role})` : "—",
    staffSecurity: inc.staff?.security?.name ? `${inc.staff.security.name} (${inc.staff.security.role})` : "—",
    staffMaintenance: inc.staff?.maintenance?.name ? `${inc.staff.maintenance.name} (${inc.staff.maintenance.role})` : "—",
    staffAmbulance: inc.staff?.ambulance?.name ? `${inc.staff.ambulance.name} (${inc.staff.ambulance.role})` : "—",
    staffPolice: inc.staff?.police?.name ? `${inc.staff.police.name} (${inc.staff.police.role})` : "—",
    staffCivilDefense: inc.staff?.civilDefense?.name ? `${inc.staff.civilDefense.name} (${inc.staff.civilDefense.role})` : "—",
    staffOther: inc.staff?.other?.length ? inc.staff.other.map(m => `${m.name} (${m.role})`).join("; ") : "—",
    incidentDuration: inc.impact?.incidentDuration ?? "—",
    responseDuration: inc.impact?.responseDuration ?? "—",
    evacuationDuration: inc.impact?.evacuationDuration ?? "—",
    trainRescueDuration: inc.impact?.trainRescueDuration ?? "—",
    trainDelay: inc.impact?.trainDelay ?? "—",
    affectedPassengers: inc.impact?.affectedPassengers ?? "—",
    affectedEquipment: inc.impact?.affectedEquipment ?? "—",
    injuries: inc.impact?.injuries ?? "—",
    fatalities: inc.impact?.fatalities ?? "—",
    rootCause: inc.impact?.rootCause ?? "—",
    correctiveActions: inc.impact?.correctiveActions ?? "—",
    lessonsLearned: inc.impact?.lessonsLearned ?? "—",
  }));
}

export function exportToExcel(incidents: Incident[], filename = "report.xlsx") {
  const rows = buildRows(incidents);

  const sheets: Record<string, unknown[][]> = {
    [sectionLabel("general")]: [
      ["Code", "Date", "Day", "Time", "Shift", "Station", "Location", "Description"],
      ...rows.map(r => [r.code, r.date, r.day, r.time, r.shift, r.station, r.location, r.description]),
    ],
    [sectionLabel("detection")]: [
      ["Code", "Discovered By", "Reported By", "Discovery Time", "OCC Notification", "OCC Response", "Emergency Code", "Permit No."],
      ...rows.map(r => [r.code, r.discoveredBy, r.reportedBy, r.discoveryTime, r.occNotificationTime, r.occResponseTime, r.emergencyCode, r.permitNumber]),
    ],
    [sectionLabel("type")]: [
      ["Code", "Incident Type", "Severity", "Status"],
      ...rows.map(r => [r.code, r.incidentType, r.severity, r.status]),
    ],
    [sectionLabel("passenger")]: [
      ["Code", "Name", "Age", "Phone", "Emergency Contact", "Status", "First Aid", "Ambulance Request", "Ambulance Arrival", "Handover", "Departure", "Hospital", "Ambulance Ref"],
      ...rows.map(r => [r.code, r.passengerName, r.passengerAge, r.passengerPhone, r.passengerEmergencyContact, r.passengerStatus, r.firstAidProvided, r.ambulanceRequestTime, r.ambulanceArrivalTime, r.handoverTime, r.departureTime, r.hospital, r.ambulanceRef]),
    ],
    [sectionLabel("train")]: [
      ["Code", "Train No.", "Current Location", "Destination", "Mode", "Rescue Train", "Rescue Start", "Rescue End", "OCC Handover", "Return to Service"],
      ...rows.map(r => [r.code, r.trainNumber, r.currentLocation, r.destination, r.operationMode, r.rescueTrainNumber, r.rescueStartTime, r.rescueEndTime, r.handoverToOccTime, r.returnToServiceTime]),
    ],
    [sectionLabel("evacuation")]: [
      ["Code", "OCC Order", "Evacuation Start", "Evacuation Complete", "Station Clear", "Station Reopen"],
      ...rows.map(r => [r.code, r.occOrderTime, r.evacuationStartTime, r.evacuationCompleteTime, r.stationClearReportTime, r.stationReopenTime]),
    ],
    [sectionLabel("staff")]: [
      ["Code", "Station Manager", "Asst. Manager", "Ambassador", "Security", "Maintenance", "Ambulance", "Police", "Civil Defense", "Others"],
      ...rows.map(r => [r.code, r.staffSM, r.staffASM, r.staffSA, r.staffSecurity, r.staffMaintenance, r.staffAmbulance, r.staffPolice, r.staffCivilDefense, r.staffOther]),
    ],
    [sectionLabel("impact")]: [
      ["Code", "Duration (min)", "Response Time", "Evacuation Time", "Rescue Time", "Train Delay", "Affected Pass.", "Affected Equipment", "Injuries", "Fatalities", "Root Cause", "Corrective Actions", "Lessons Learned"],
      ...rows.map(r => [r.code, r.incidentDuration, r.responseDuration, r.evacuationDuration, r.trainRescueDuration, r.trainDelay, r.affectedPassengers, r.affectedEquipment, r.injuries, r.fatalities, r.rootCause, r.correctiveActions, r.lessonsLearned]),
    ],
  };

  const wb = XLSX.utils.book_new();
  for (const [name, data] of Object.entries(sheets)) {
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, name);
  }
  XLSX.writeFile(wb, filename);
}

export function exportToPDF(incidents: Incident[], filename = "report.pdf") {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFontSize(14);
  doc.text("Incident Report - Riyadh Metro", 297 / 2, 15, { align: "center" });
  doc.setFontSize(8);
  doc.text(`Exported: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 297 / 2, 21, { align: "center" });

  const rows = buildRows(incidents);
  let cursorY = 28;

  const sections: { title: string; headers: string[]; data: string[][] }[] = [
    {
      title: sectionLabel("general"),
      headers: ["Code", "Date", "Shift", "Station", "Location"],
      data: rows.map(r => [r.code, r.date, r.shift, r.station, r.location]),
    },
    {
      title: sectionLabel("detection"),
      headers: ["Code", "Discovered By", "Reported By", "Discovery Time", "Emergency Code"],
      data: rows.map(r => [r.code, r.discoveredBy, r.reportedBy, r.discoveryTime, r.emergencyCode]),
    },
    {
      title: sectionLabel("type"),
      headers: ["Code", "Incident Type", "Severity", "Status"],
      data: rows.map(r => [r.code, r.incidentType, r.severity, r.status]),
    },
    {
      title: sectionLabel("passenger"),
      headers: ["Code", "Name", "Status", "Hospital"],
      data: rows.map(r => [r.code, r.passengerName, r.passengerStatus, r.hospital]),
    },
    {
      title: sectionLabel("train"),
      headers: ["Code", "Train No.", "Location", "Destination", "Mode"],
      data: rows.map(r => [r.code, r.trainNumber, r.currentLocation, r.destination, r.operationMode]),
    },
    {
      title: sectionLabel("evacuation"),
      headers: ["Code", "OCC Order", "Evac. Start", "Evac. Complete", "Station Reopen"],
      data: rows.map(r => [r.code, r.occOrderTime, r.evacuationStartTime, r.evacuationCompleteTime, r.stationReopenTime]),
    },
    {
      title: sectionLabel("staff"),
      headers: ["Code", "Station Manager", "Security", "Maintenance", "Ambulance"],
      data: rows.map(r => [r.code, r.staffSM, r.staffSecurity, r.staffMaintenance, r.staffAmbulance]),
    },
    {
      title: sectionLabel("impact"),
      headers: ["Code", "Duration (min)", "Delay", "Injuries", "Fatalities", "Root Cause"],
      data: rows.map(r => [r.code, r.incidentDuration, r.trainDelay, r.injuries, r.fatalities, r.rootCause]),
    },
  ];

  for (const sec of sections) {
    if (cursorY > 180) {
      doc.addPage();
      cursorY = 20;
    }
    doc.setFontSize(10);
    doc.text(sec.title, 14, cursorY);
    cursorY += 5;

    autoTable(doc, {
      head: [sec.headers],
      body: sec.data,
      startY: cursorY,
      margin: { left: 14, right: 14 },
      styles: { fontSize: 7, font: "helvetica" },
      headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
      tableLineColor: [50, 70, 100],
      tableLineWidth: 0.1,
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    cursorY = finalY + 8;
  }

  doc.save(filename);
}
