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
    <div style={{ background: "var(--background)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SANS }}>
      <div className="rounded border p-6 sm:p-8 w-full max-w-sm mx-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded flex items-center justify-center" style={{ background: "rgba(var(--primary-rgb), 0.15)" }}>
            <Train size={24} style={{ color: "var(--primary)" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Staff Login</p>
          <p className="text-[10px] font-mono text-center" style={{ color: "var(--muted-foreground)" }}>Riyadh Metro — Incident Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "var(--muted-foreground)" }}>Job Number</label>
            <input type="text" value={jobNumber} onChange={e => { setJobNumber(e.target.value); setError(""); }}
              placeholder="e.g. SM-001, OCC-001"
              className="w-full px-3 py-2.5 rounded text-[13px] outline-none"
              style={{ background: "var(--secondary)", border: "1px solid rgba(100,140,200,0.12)", color: "var(--foreground)", minHeight: 42 }}
              autoFocus disabled={busy} />
          </div>

          <div>
            <label className="block text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "var(--muted-foreground)" }}>Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter password"
                className="w-full px-3 py-2.5 rounded text-[13px] outline-none"
                style={{ background: "var(--secondary)", border: "1px solid rgba(100,140,200,0.12)", color: "var(--foreground)", minHeight: 42 }} disabled={busy} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1" style={{ color: "var(--muted-foreground)" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[12px]" style={{ color: "var(--destructive)" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={busy}
            className="w-full py-2.5 rounded text-[13px] font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: busy ? "var(--muted-foreground)" : "var(--primary)", color: busy ? "var(--secondary)" : "var(--background)", minHeight: 42 }}>
            {busy && <Loader size={14} className="animate-spin" />}
            {busy ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={12} style={{ color: "var(--muted-foreground)" }} />
            <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Test Accounts</span>
          </div>
          <div className="text-[9px] font-mono leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            <span style={{ color: "var(--primary)" }}>SM-001</span> / sab123 — Station Manager<br />
            <span style={{ color: "var(--primary)" }}>OCC-001</span> / occ123 — OCC Operator<br />
            <span style={{ color: "var(--primary)" }}>SEC-001</span> / sec123 — Security<br />
            <span style={{ color: "var(--primary)" }}>STF-001</span> / staff123 — Station Staff
          </div>
        </div>
      </div>
    </div>
  );
}
