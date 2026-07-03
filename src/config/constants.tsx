import type { Severity, ExtendedIncidentType, Location, Shift, Discoverer, TrainMode, PassengerStatus } from "@/types";

export const FONT_SANS = "'Inter', sans-serif";
export const FONT_MONO = "'Geist Mono', monospace";
export const FONT_AR = FONT_SANS;

export const SEV_CONFIG: Record<Severity, { label: string; color: string; bg: string }> = {
  CRITICAL: { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  HIGH:     { label: "High",    color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  MEDIUM:   { label: "Medium",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  LOW:      { label: "Low",     color: "#10b981", bg: "rgba(16,185,129,0.12)" },
};

export const INCIDENT_TYPES: ExtendedIncidentType[] = [
  "Passenger Medical Incident", "Injury or Fall", "Fire Alarm", "Smoke",
  "Fire Pump", "Generator", "Chiller", "Tunnel Ventilation System TVS",
  "HVAC", "UPS", "Escalators", "Elevators", "Platform Screen Doors PSD",
  "Power Outage", "Water Leak", "Track Access",
  "Switch Point Failure", "Train Rescue", "Train Breakdown", "Door Isolation",
  "Parking Brake", "Air Brake", "Train Positioning Loss",
  "Security Incident", "Suspicious Object", "Other",
];

export const LOCATIONS: Location[] = ["Platform", "Concourse", "Street Level", "Track", "Equipment Room"];

export const SHIFTS: Shift[] = ["Morning", "Evening", "Night"];

export const DISCOVERERS: Discoverer[] = [
  "OCC", "Station Manager (SM)", "Asst. Station Manager (ASM)", "Station Ambassador (SA)",
  "Security", "Maintenance", "Cleaner", "Passenger", "Police", "Civil Defense", "Other",
];

export const TRAIN_MODES: TrainMode[] = ["UTO", "ATPM", "RM", "DM"];

export const PASSENGER_STATUSES: PassengerStatus[] = ["Stable", "Moderate", "Critical", "Deceased"];

export interface StationInfo { name: string; line: "blue" | "red"; color: string; }

export const STATIONS: StationInfo[] = [
  { name: "SAB", line: "blue", color: "#3b82f6" },
  { name: "Al-Masar", line: "blue", color: "#3b82f6" },
  { name: "Dr. Suliman Al-Habib", line: "blue", color: "#3b82f6" },
  { name: "Financial Center", line: "blue", color: "#3b82f6" },
  { name: "Al-Murooj", line: "blue", color: "#3b82f6" },
  { name: "King Fahd District", line: "blue", color: "#3b82f6" },
  { name: "King Fahd District 2", line: "blue", color: "#3b82f6" },
  { name: "stc", line: "blue", color: "#3b82f6" },
  { name: "Al-Wurud 2", line: "blue", color: "#3b82f6" },
  { name: "Al-Urubah", line: "blue", color: "#3b82f6" },
  { name: "Al-Inma Bank", line: "blue", color: "#3b82f6" },
  { name: "Bank AlBilad", line: "blue", color: "#3b82f6" },
  { name: "King Fahd Library", line: "blue", color: "#3b82f6" },
  { name: "Ministry of Interior", line: "blue", color: "#3b82f6" },
  { name: "Al-Murabba", line: "blue", color: "#3b82f6" },
  { name: "Al-Jawazat", line: "blue", color: "#3b82f6" },
  { name: "National Museum", line: "blue", color: "#3b82f6" },
  { name: "Al-Batha", line: "blue", color: "#3b82f6" },
  { name: "Qasr Al-Hukm", line: "blue", color: "#3b82f6" },
  { name: "Al-Oud", line: "blue", color: "#3b82f6" },
  { name: "Skirina", line: "blue", color: "#3b82f6" },
  { name: "Manfuha", line: "blue", color: "#3b82f6" },
  { name: "Eman Hospital", line: "blue", color: "#3b82f6" },
  { name: "Public Transport Center", line: "blue", color: "#3b82f6" },
  { name: "Al-Aziziah", line: "blue", color: "#3b82f6" },
  { name: "Al-Dar Al-Bayda", line: "blue", color: "#3b82f6" },
  { name: "King Saud University", line: "red", color: "#ef4444" },
  { name: "King Salman Oasis", line: "red", color: "#ef4444" },
  { name: "Technical City", line: "red", color: "#ef4444" },
  { name: "Al-Takhassusi", line: "red", color: "#ef4444" },
  { name: "stc", line: "red", color: "#ef4444" },
  { name: "Al-Wurud", line: "red", color: "#ef4444" },
  { name: "King Abdulaziz Road", line: "red", color: "#ef4444" },
  { name: "Ministry of Education", line: "red", color: "#ef4444" },
  { name: "Al-Nuzhah", line: "red", color: "#ef4444" },
  { name: "Riyadh Exhibition Center", line: "red", color: "#ef4444" },
  { name: "Khalid Bin Al-Waleed Road", line: "red", color: "#ef4444" },
  { name: "Al-Hamra", line: "red", color: "#ef4444" },
  { name: "Al-Khaleej", line: "red", color: "#ef4444" },
  { name: "Seville", line: "red", color: "#ef4444" },
  { name: "King Fahd Sports City", line: "red", color: "#ef4444" },
];

export const STATION_NAMES = STATIONS.map(s => s.name);

export function getStationInfo(name: string) {
  return STATIONS.find(s => s.name === name) ?? { name, line: "blue" as const, color: "#3b82f6" };
}

export const STAFF_POOL = [
  "Ahmed Al-Ghamdi", "Mohammed Al-Otaibi", "Sara Al-Zahrani", "Khalid Al-Mutairi",
  "Noura Al-Subaie", "Faisal Al-Dosari", "Hind Al-Shammari", "Omar Al-Baqmi",
  "Reem Al-Anzi", "Saad Al-Harbi",
];

export const TYPE_COLORS: Record<string, string> = {
  "Passenger Medical Incident": "#ef4444",
  "Injury or Fall": "#f97316",
  "Fire Alarm": "#f97316",
  "Smoke": "#92400e",
  "Fire Pump": "#06b6d4",
  "Generator": "#06b6d4",
  "Chiller": "#06b6d4",
  "Tunnel Ventilation System TVS": "#06b6d4",
  "HVAC": "#06b6d4",
  "UPS": "#06b6d4",
  "Escalators": "#f59e0b",
  "Elevators": "#f59e0b",
  "Platform Screen Doors PSD": "#f59e0b",
  "Power Outage": "#06b6d4",
  "Water Leak": "#06b6d4",
  "Track Access": "#8b5cf6",
  "Switch Point Failure": "#8b5cf6",
  "Train Rescue": "#f59e0b",
  "Train Breakdown": "#f59e0b",
  "Door Isolation": "#f59e0b",
  "Parking Brake": "#f59e0b",
  "Air Brake": "#f59e0b",
  "Train Positioning Loss": "#f59e0b",
  "Security Incident": "#8b5cf6",
  "Suspicious Object": "#8b5cf6",
  "Other": "#6b7280",
};
