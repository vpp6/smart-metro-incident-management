import { useState } from "react";
import { Train, Eye, EyeOff } from "lucide-react";
import { STATIONS, FONT_SANS } from "@/config/constants";

const STATION_MANAGERS: Record<string, { password: string; name: string }> = {
  "SAB":                  { password: "sab123",   name: "Ahmed Al-Ghamdi" },
  "Al-Masar":             { password: "masar123", name: "Mohammed Al-Otaibi" },
  "Dr. Suliman Al-Habib": { password: "habib123", name: "Sara Al-Zahrani" },
  "Financial Center":     { password: "fin123",   name: "Khalid Al-Mutairi" },
  "Al-Murooj":            { password: "muroj123", name: "Noura Al-Subaie" },
  "King Fahd District":   { password: "kfd123",   name: "Faisal Al-Dosari" },
  "King Fahd District 2": { password: "kfd2123",  name: "Hind Al-Shammari" },
  "stc":                  { password: "stc123",   name: "Omar Al-Baqmi" },
  "Al-Wurud 2":           { password: "wurud123", name: "Reem Al-Anzi" },
  "Al-Urubah":            { password: "urubah123",name: "Saad Al-Harbi" },
  "Al-Inma Bank":         { password: "inma123",  name: "Ahmed Al-Ghamdi" },
  "Bank AlBilad":         { password: "bilad123", name: "Mohammed Al-Otaibi" },
  "King Fahd Library":    { password: "lib123",   name: "Sara Al-Zahrani" },
  "Ministry of Interior": { password: "moi123",   name: "Khalid Al-Mutairi" },
  "Al-Murabba":           { password: "murabba123", name: "Noura Al-Subaie" },
  "Al-Jawazat":           { password: "jawa123",  name: "Faisal Al-Dosari" },
  "National Museum":      { password: "museum123",name: "Hind Al-Shammari" },
  "Al-Batha":             { password: "batha123", name: "Omar Al-Baqmi" },
  "Qasr Al-Hukm":         { password: "qasr123",  name: "Reem Al-Anzi" },
  "Al-Oud":               { password: "oud123",   name: "Saad Al-Harbi" },
  "Skirina":              { password: "skir123",  name: "Ahmed Al-Ghamdi" },
  "Manfuha":              { password: "manf123",  name: "Mohammed Al-Otaibi" },
  "Eman Hospital":        { password: "eman123",  name: "Sara Al-Zahrani" },
  "Public Transport Center": { password: "ptc123", name: "Khalid Al-Mutairi" },
  "Al-Aziziah":           { password: "aziz123",  name: "Noura Al-Subaie" },
  "Al-Dar Al-Bayda":      { password: "dar123",   name: "Faisal Al-Dosari" },
  "King Saud University": { password: "ksu123",   name: "Hind Al-Shammari" },
  "King Salman Oasis":    { password: "oasis123", name: "Omar Al-Baqmi" },
  "Technical City":       { password: "tech123",  name: "Reem Al-Anzi" },
  "Al-Takhassusi":        { password: "takh123",  name: "Saad Al-Harbi" },
  "Al-Wurud":             { password: "wurud123", name: "Ahmed Al-Ghamdi" },
  "King Abdulaziz Road":  { password: "kar123",   name: "Mohammed Al-Otaibi" },
  "Ministry of Education":{ password: "moe123",   name: "Sara Al-Zahrani" },
  "Al-Nuzhah":            { password: "nuzh123",  name: "Khalid Al-Mutairi" },
  "Riyadh Exhibition Center": { password: "rec123", name: "Noura Al-Subaie" },
  "Khalid Bin Al-Waleed Road": { password: "kbw123", name: "Faisal Al-Dosari" },
  "Al-Hamra":             { password: "hamra123", name: "Hind Al-Shammari" },
  "Al-Khaleej":           { password: "khaleej123", name: "Omar Al-Baqmi" },
  "Seville":              { password: "sev123",   name: "Reem Al-Anzi" },
  "King Fahd Sports City": { password: "kfsc123", name: "Saad Al-Harbi" },
};

interface LoginResult {
  station: string;
  managerName: string;
}

interface Props {
  onLogin: (result: LoginResult) => void;
}

export function LoginPage({ onLogin }: Props) {
  const [station, setStation] = useState(STATIONS[0].name);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const info = STATION_MANAGERS[station];
    if (!info) { setError("Invalid station"); return; }
    if (password !== info.password) { setError("Incorrect password"); return; }
    onLogin({ station, managerName: info.name });
  }

  return (
    <div style={{ background: "#04080f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SANS }}>
      <div className="rounded border p-8 w-full max-w-sm" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.12)" }}>
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
            <Train size={24} style={{ color: "#f59e0b" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "#c9d4e8" }}>Station Manager Login</p>
          <p className="text-[10px] font-mono" style={{ color: "#4a5f78" }}>Riyadh Metro — Incident Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "#4a5f78" }}>Station</label>
            <select value={station} onChange={e => { setStation(e.target.value); setError(""); }}
              className="w-full px-3 py-2.5 rounded text-[12px] outline-none"
              style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8" }}>
              {STATIONS.map(s => (
                <option key={s.name} value={s.name} style={{ background: "#0f1a2e", color: "#c9d4e8" }}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "#4a5f78" }}>Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter station password"
                className="w-full px-3 py-2.5 rounded text-[12px] outline-none"
                style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8" }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1" style={{ color: "#4a5f78" }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && <p className="text-[11px]" style={{ color: "#ef4444" }}>{error}</p>}

          <button type="submit"
            className="w-full py-2.5 rounded text-[12px] font-semibold transition-all hover:opacity-90"
            style={{ background: "#f59e0b", color: "#04080f" }}>
            Login
          </button>
        </form>

        <p className="text-[9px] font-mono text-center mt-4" style={{ color: "#4a5f78" }}>
          Use station name as password hint
        </p>
      </div>
    </div>
  );
}
