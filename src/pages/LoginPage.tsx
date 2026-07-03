import { useState } from "react";
import { Train, Eye, EyeOff, Users, Loader } from "lucide-react";
import { FONT_SANS } from "@/config/constants";
import { api } from "@/lib/api";

export interface LoginResult {
  station: string;
  managerName: string;
  jobNumber: string;
  role: string;
}

interface Props {
  onLogin: (result: LoginResult) => void;
}

export function LoginPage({ onLogin }: Props) {
  const [jobNumber, setJobNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const user = await api.login(jobNumber.trim().toUpperCase(), password);
      onLogin({
        station: user.station,
        managerName: user.name,
        jobNumber: user.jobNumber,
        role: user.role,
      });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: "#04080f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SANS }}>
      <div className="rounded border p-6 sm:p-8 w-full max-w-sm mx-3" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.12)" }}>
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
            <Train size={24} style={{ color: "#f59e0b" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "#c9d4e8" }}>Staff Login</p>
          <p className="text-[10px] font-mono text-center" style={{ color: "#4a5f78" }}>Riyadh Metro — Incident Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "#4a5f78" }}>Job Number</label>
            <input type="text" value={jobNumber} onChange={e => { setJobNumber(e.target.value); setError(""); }}
              placeholder="e.g. SM-001, OCC-001"
              className="w-full px-3 py-2.5 rounded text-[13px] outline-none"
              style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8", minHeight: 42 }}
              autoFocus disabled={busy} />
          </div>

          <div>
            <label className="block text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "#4a5f78" }}>Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter password"
                className="w-full px-3 py-2.5 rounded text-[13px] outline-none"
                style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8", minHeight: 42 }} disabled={busy} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1" style={{ color: "#4a5f78" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[12px]" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={busy}
            className="w-full py-2.5 rounded text-[13px] font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: busy ? "#4a5f78" : "#f59e0b", color: busy ? "#0f1a2e" : "#04080f", minHeight: 42 }}>
            {busy && <Loader size={14} className="animate-spin" />}
            {busy ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t" style={{ borderColor: "rgba(100,140,200,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={12} style={{ color: "#4a5f78" }} />
            <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "#4a5f78" }}>Test Accounts</span>
          </div>
          <div className="text-[9px] font-mono leading-relaxed" style={{ color: "#4a5f78" }}>
            <span style={{ color: "#f59e0b" }}>SM-001</span> / sab123 — Station Manager<br />
            <span style={{ color: "#f59e0b" }}>OCC-001</span> / occ123 — OCC Operator<br />
            <span style={{ color: "#f59e0b" }}>SEC-001</span> / sec123 — Security<br />
            <span style={{ color: "#f59e0b" }}>STF-001</span> / staff123 — Station Staff
          </div>
        </div>
      </div>
    </div>
  );
}
