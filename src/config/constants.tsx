import type { Severity, ExtendedIncidentType, Location, Shift, Discoverer, TrainMode, PassengerStatus } from "@/types";

export const FONT_SANS = "'Inter', sans-serif";
export const FONT_MONO = "'Geist Mono', monospace";
export const FONT_AR = FONT_SANS;

export const SEV_CONFIG: Record<Severity, { label: string; color: string; bg: string }> = {
  CRITICAL: { label: "Critical", color: "var(--destructive)", bg: "rgba(var(--destructive-rgb), 0.12)" },
  HIGH:     { label: "High",    color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  MEDIUM:   { label: "Medium",  color: "var(--primary)", bg: "rgba(var(--primary-rgb), 0.12)" },
  LOW:      { label: "Low",     color: "var(--chart-3)", bg: "rgba(var(--chart-3-rgb), 0.12)" },
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
  { name: "King Saud University", line: "red", color: "var(--destructive)" },
  { name: "King Salman Oasis", line: "red", color: "var(--destructive)" },
  { name: "Technical City", line: "red", color: "var(--destructive)" },
  { name: "Al-Takhassusi", line: "red", color: "var(--destructive)" },
  { name: "stc", line: "red", color: "var(--destructive)" },
  { name: "Al-Wurud", line: "red", color: "var(--destructive)" },
  { name: "King Abdulaziz Road", line: "red", color: "var(--destructive)" },
  { name: "Ministry of Education", line: "red", color: "var(--destructive)" },
  { name: "Al-Nuzhah", line: "red", color: "var(--destructive)" },
  { name: "Riyadh Exhibition Center", line: "red", color: "var(--destructive)" },
  { name: "Khalid Bin Al-Waleed Road", line: "red", color: "var(--destructive)" },
  { name: "Al-Hamra", line: "red", color: "var(--destructive)" },
  { name: "Al-Khaleej", line: "red", color: "var(--destructive)" },
  { name: "Seville", line: "red", color: "var(--destructive)" },
  { name: "King Fahd Sports City", line: "red", color: "var(--destructive)" },
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
  "Passenger Medical Incident": "var(--destructive)",
  "Injury or Fall": "#f97316",
  "Fire Alarm": "#f97316",
  "Smoke": "#92400e",
  "Fire Pump": "var(--accent)",
  "Generator": "var(--accent)",
  "Chiller": "var(--accent)",
  "Tunnel Ventilation System TVS": "var(--accent)",
  "HVAC": "var(--accent)",
  "UPS": "var(--accent)",
  "Escalators": "var(--primary)",
  "Elevators": "var(--primary)",
  "Platform Screen Doors PSD": "var(--primary)",
  "Power Outage": "var(--accent)",
  "Water Leak": "var(--accent)",
  "Track Access": "#8b5cf6",
  "Switch Point Failure": "#8b5cf6",
  "Train Rescue": "var(--primary)",
  "Train Breakdown": "var(--primary)",
  "Door Isolation": "var(--primary)",
  "Parking Brake": "var(--primary)",
  "Air Brake": "var(--primary)",
  "Train Positioning Loss": "var(--primary)",
  "Security Incident": "#8b5cf6",
  "Suspicious Object": "#8b5cf6",
  "Other": "#6b7280",
};
