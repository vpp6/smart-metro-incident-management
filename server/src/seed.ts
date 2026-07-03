import bcrypt from "bcryptjs";
import { query } from "./db";

export async function seedStaff() {
  const existing = await query("SELECT COUNT(*) FROM staff");
  if (parseInt(existing.rows[0].count) > 0) {
    console.log("[DB] Staff already seeded, skipping");
    return;
  }

  const stations = [
    "Qasr Al Hokm", "Al Hokm Palace", "Naseem", "Al Muasam", "Riyadh Air Base",
    "SAB Bank", "Al Kharz", "Al Hamra", "Al Khashm", "Al Hamra-2",
    "Olaya", "Takhassusi", "SPF", "Al Urubah", "Al Urubah-2",
    "Khurais", "Granada", "Al Izdihar", "Al Izdihar-2", "Al Wurud",
    "King Fahad", "King Fahad-2", "Al Malaz", "Al Malaz-2", "Batha",
    "Al Bateen", "Al Yarmuk", "Al Andalus", "Sultanah", "Salam",
    "Alhamra_A", "Alhamra_B", "Khuraid", "Hayer", "Diriyah",
    "Diriyah_2", "Ad Diriyah", "Umm Al Hamam", "As Suwaidi",
    "As Suwaidi_2", "Bani Malik",
  ];

  const roles = ["Station Manager", "Station Staff", "OCC Operator", "Security", "Maintenance", "Ambulance", "Police", "Civil Defense"];
  const passwords = await Promise.all(
    ["sab123", "staff123", "occ123", "sec123", "maint123", "amb123", "pol123", "civil123"].map(p => bcrypt.hash(p, 10))
  );

  // Station managers for all stations
  for (let i = 0; i < stations.length; i++) {
    const num = String(i + 1).padStart(3, "0");
    await query(
      "INSERT INTO staff (job_number, name, password_hash, role, station) VALUES ($1, $2, $3, $4, $5)",
      [`SM-${num}`, `Station Manager ${num}`, passwords[0], "Station Manager", stations[i]]
    );
  }

  // Operational staff
  const opsStaff = [
    ["OCC-001", "OCC Operator", passwords[2], "OCC Operator", "OCC"],
    ["OCC-002", "OCC Operator 2", passwords[2], "OCC Operator", "OCC"],
    ["SEC-001", "Security Lead", passwords[3], "Security", "All Stations"],
    ["MAINT-001", "Maintenance Lead", passwords[4], "Maintenance", "All Stations"],
    ["AMB-001", "Ambulance Team", passwords[5], "Ambulance", "All Stations"],
    ["POL-001", "Police Liaison", passwords[6], "Police", "All Stations"],
    ["CIVIL-001", "Civil Defense", passwords[7], "Civil Defense", "All Stations"],
    ["STF-001", "Staff Member", passwords[1], "Station Staff", "Qasr Al Hokm"],
    ["STF-002", "Staff Member 2", passwords[1], "Station Staff", "Olaya"],
    ["STF-003", "Staff Member 3", passwords[1], "Station Staff", "King Fahad"],
  ];

  for (const [job, name, hash, role, station] of opsStaff) {
    await query(
      "INSERT INTO staff (job_number, name, password_hash, role, station) VALUES ($1, $2, $3, $4, $5)",
      [job, name, hash, role, station]
    );
  }

  console.log(`[DB] Seeded ${stations.length + opsStaff.length} staff members`);
}
