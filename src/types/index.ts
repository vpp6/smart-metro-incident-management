export type View = "dashboard" | "new-incident" | "incident-detail" | "reports" | "staff-management" | "map";

export interface StaffUser {
  id: string;
  jobNumber: string;
  name: string;
  password: string;
  role: string;
  station: string;
}

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentStatus = "OPEN" | "ACTIVE" | "RESOLVED";
export type Shift = "Morning" | "Evening" | "Night";

export type Location = "Platform" | "Concourse" | "Street Level" | "Track" | "Equipment Room";

export type Discoverer =
  | "OCC"
  | "Station Manager (SM)"
  | "Asst. Station Manager (ASM)"
  | "Station Ambassador (SA)"
  | "Security"
  | "Maintenance"
  | "Cleaner"
  | "Passenger"
  | "Police"
  | "Civil Defense"
  | "Other";

export type ExtendedIncidentType =
  | "Passenger Medical Incident"
  | "Injury or Fall"
  | "Fire Alarm"
  | "Smoke"
  | "Fire Pump"
  | "Generator"
  | "Chiller"
  | "Tunnel Ventilation System TVS"
  | "HVAC"
  | "UPS"
  | "Escalators"
  | "Elevators"
  | "Platform Screen Doors PSD"
  | "Power Outage"
  | "Water Leak"
  | "Track Access"
  | "Switch Point Failure"
  | "Train Rescue"
  | "Train Breakdown"
  | "Door Isolation"
  | "Parking Brake"
  | "Air Brake"
  | "Train Positioning Loss"
  | "Security Incident"
  | "Suspicious Object"
  | "Other";

export type TrainMode = "UTO" | "ATPM" | "RM" | "DM";
export type PassengerStatus = "Stable" | "Moderate" | "Critical" | "Deceased";

export interface DetectionInfo {
  discoveredBy: Discoverer;
  reportedBy: string;
  discoveryTime: string;
  occNotificationTime: string;
  occResponseTime: string;
  emergencyCode: string;
  permitNumber: string;
}

export interface PassengerData {
  name: string;
  age: number;
  phone: string;
  emergencyContact: string;
  status: PassengerStatus;
  firstAidProvided: string;
  ambulanceRequestTime: string;
  ambulanceArrivalTime: string;
  handoverTime: string;
  departureTime: string;
  hospital: string;
  ambulanceRef: string;
}

export interface TrainOperations {
  trainNumber: string;
  currentLocation: string;
  destination: string;
  operationMode: TrainMode;
  rescueTrainNumber: string;
  rescueStartTime: string;
  rescueEndTime: string;
  handoverToOccTime: string;
  returnToServiceTime: string;
}

export interface EvacuationInfo {
  occOrderTime: string;
  evacuationStartTime: string;
  evacuationCompleteTime: string;
  stationClearReportTime: string;
  stationReopenTime: string;
}

export interface StaffMember {
  name: string;
  jobNumber: string;
  role: string;
  digitalSignature: string;
}

export interface StaffInfo {
  sm?: StaffMember;
  asm?: StaffMember;
  sa?: StaffMember;
  security?: StaffMember;
  maintenance?: StaffMember;
  ambulance?: StaffMember;
  police?: StaffMember;
  civilDefense?: StaffMember;
  other: StaffMember[];
}

export interface ImpactAssessment {
  incidentDuration: number;
  responseDuration: number;
  evacuationDuration: number;
  trainRescueDuration: number;
  trainDelay: number;
  affectedPassengers: number;
  affectedEquipment: string;
  injuries: number;
  fatalities: number;
  rootCause: string;
  correctiveActions: string;
  lessonsLearned: string;
  closed: boolean;
}

export interface Incident {
  id: string;
  code: string;
  date: string;
  day: string;
  time: string;
  shift: Shift;
  station: string;
  location: Location;
  description: string;
  detection?: DetectionInfo;
  incidentType: ExtendedIncidentType;
  severity: Severity;
  status: IncidentStatus;
  passenger?: PassengerData;
  trainOps?: TrainOperations;
  evacuation?: EvacuationInfo;
  staff?: StaffInfo;
  impact?: ImpactAssessment;
  reportedAt: Date;
  resolvedAt?: Date;
  assignedStaff: string[];
}
