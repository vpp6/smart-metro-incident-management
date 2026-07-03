import { STATIONS } from "@/config/constants";
import type { StaffUser } from "@/types";

export const DEFAULT_STAFF: StaffUser[] = [
  // Station Managers for every station (job number format: SM-XXX)
  ...STATIONS.map((s, i) => ({
    id: `staff-sm-${i}`,
    jobNumber: `SM-${String(i + 1).padStart(3, "0")}`,
    name: `Manager of ${s.name}`,
    password: s.name.toLowerCase().replace(/\s+/g, "") + "123",
    role: "Station Manager",
    station: s.name,
  })),
  // Additional staff
  { id: "staff-op1", jobNumber: "OCC-001", name: "Ahmed Al-Ghamdi", password: "occ123", role: "OCC Operator", station: "OCC" },
  { id: "staff-op2", jobNumber: "OCC-002", name: "Mohammed Al-Otaibi", password: "occ123", role: "OCC Supervisor", station: "OCC" },
  { id: "staff-sec1", jobNumber: "SEC-001", name: "Faisal Al-Dosari", password: "sec123", role: "Security Supervisor", station: "SAB" },
  { id: "staff-sec2", jobNumber: "SEC-002", name: "Noura Al-Subaie", password: "sec123", role: "Security Officer", station: "Al-Masar" },
  { id: "staff-mnt1", jobNumber: "MNT-001", name: "Omar Al-Baqmi", password: "mnt123", role: "Maintenance Lead", station: "Financial Center" },
  { id: "staff-mnt2", jobNumber: "MNT-002", name: "Reem Al-Anzi", password: "mnt123", role: "Maintenance Tech", station: "King Saud University" },
  { id: "staff-amb1", jobNumber: "AMB-001", name: "Saad Al-Harbi", password: "amb123", role: "Ambulance Medic", station: "SAB" },
  { id: "staff-pol1", jobNumber: "POL-001", name: "Khalid Al-Mutairi", password: "pol123", role: "Police Officer", station: "Al-Murooj" },
  { id: "staff-civ1", jobNumber: "CIV-001", name: "Hind Al-Shammari", password: "civ123", role: "Civil Defense", station: "Dr. Suliman Al-Habib" },

  // Extra staff for all stations (one per station)
  ...STATIONS.map((s, i) => ({
    id: `staff-extra-${i}`,
    jobNumber: `STF-${String(i + 1).padStart(3, "0")}`,
    name: `Staff ${i + 1} - ${s.name}`,
    password: "staff123",
    role: "Station Staff",
    station: s.name,
  })),
];

export function verifyStaff(jobNumber: string, password: string, staffList: StaffUser[]): StaffUser | null {
  return staffList.find(s => s.jobNumber === jobNumber && s.password === password) || null;
}
