import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";
import { FONT_SANS, FONT_MONO } from "@/config/constants";
import type { StaffUser } from "@/types";

interface Props {
  staffList: StaffUser[];
  onUpdateStaff: (list: StaffUser[]) => void;
  onBack: () => void;
}

export function StaffManagement({ staffList, onUpdateStaff, onBack }: Props) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newStaff, setNewStaff] = useState({ jobNumber: "", name: "", password: "", role: "", station: "" });

  const filtered = staffList.filter(s =>
    s.jobNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.station.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: string) {
    if (window.confirm("Delete this staff member?")) {
      onUpdateStaff(staffList.filter(s => s.id !== id));
    }
  }

  function handleAdd() {
    if (!newStaff.jobNumber || !newStaff.name) return;
    const entry: StaffUser = {
      id: `staff-${Date.now()}`,
      jobNumber: newStaff.jobNumber.toUpperCase(),
      name: newStaff.name,
      password: newStaff.password || "staff123",
      role: newStaff.role || "Staff",
      station: newStaff.station || "Unassigned",
    };
    onUpdateStaff([...staffList, entry]);
    setNewStaff({ jobNumber: "", name: "", password: "", role: "", station: "" });
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: "#4a5f78", border: "1px solid rgba(100,140,200,0.1)" }}>
          <ArrowLeft size={14} />
        </button>
        <div>
          <p className="text-[13px] font-semibold" style={{ color: "#c9d4e8" }}>Staff Management</p>
          <p className="text-[10px] font-mono" style={{ color: "#4a5f78" }}>{staffList.length} registered staff</p>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={12} style={{ color: "#4a5f78", position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input type="text" placeholder="Search by name, job number, role..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-2 rounded text-[12px] outline-none font-mono"
            style={{ background: "#080e1c", border: "1px solid rgba(100,140,200,0.1)", color: "#c9d4e8" }} />
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-2 rounded text-[11px] transition-all whitespace-nowrap"
          style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" }}>
          <Plus size={13} /> Add Staff
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded border p-4 space-y-3" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
          <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "#4a5f78" }}>New Staff Member</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[9px] font-mono mb-1" style={{ color: "#4a5f78" }}>Job Number</label>
              <input value={newStaff.jobNumber} onChange={e => setNewStaff(p => ({ ...p, jobNumber: e.target.value }))}
                placeholder="e.g. SM-042"
                className="w-full px-2.5 py-2 rounded text-[12px] outline-none"
                style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8", minHeight: 38 }} />
            </div>
            <div>
              <label className="block text-[9px] font-mono mb-1" style={{ color: "#4a5f78" }}>Name</label>
              <input value={newStaff.name} onChange={e => setNewStaff(p => ({ ...p, name: e.target.value }))}
                placeholder="Full name"
                className="w-full px-2.5 py-2 rounded text-[12px] outline-none"
                style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8", minHeight: 38 }} />
            </div>
            <div>
              <label className="block text-[9px] font-mono mb-1" style={{ color: "#4a5f78" }}>Role</label>
              <input value={newStaff.role} onChange={e => setNewStaff(p => ({ ...p, role: e.target.value }))}
                placeholder="e.g. Station Manager"
                className="w-full px-2.5 py-2 rounded text-[12px] outline-none"
                style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8", minHeight: 38 }} />
            </div>
            <div>
              <label className="block text-[9px] font-mono mb-1" style={{ color: "#4a5f78" }}>Station</label>
              <input value={newStaff.station} onChange={e => setNewStaff(p => ({ ...p, station: e.target.value }))}
                placeholder="e.g. SAB"
                className="w-full px-2.5 py-2 rounded text-[12px] outline-none"
                style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8", minHeight: 38 }} />
            </div>
            <div>
              <label className="block text-[9px] font-mono mb-1" style={{ color: "#4a5f78" }}>Password</label>
              <input value={newStaff.password} onChange={e => setNewStaff(p => ({ ...p, password: e.target.value }))}
                placeholder="Default: staff123"
                className="w-full px-2.5 py-2 rounded text-[12px] outline-none"
                style={{ background: "#0f1a2e", border: "1px solid rgba(100,140,200,0.12)", color: "#c9d4e8", minHeight: 38 }} />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={handleAdd}
                className="px-4 py-2 rounded text-[11px] transition-all"
                style={{ background: "#f59e0b", color: "#04080f", minHeight: 38 }}>
                Add
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded text-[11px] transition-all"
                style={{ background: "rgba(100,140,200,0.08)", border: "1px solid rgba(100,140,200,0.1)", color: "#4a5f78", minHeight: 38 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff table */}
      <div className="rounded border overflow-hidden" style={{ background: "#080e1c", borderColor: "rgba(100,140,200,0.1)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(100,140,200,0.08)" }}>
                {["Job Number", "Name", "Role", "Station", ""].map(h => (
                  <th key={h} className="py-2.5 px-3 text-right text-[9px] font-mono uppercase tracking-widest" style={{ color: "#4a5f78" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-[11px] font-mono" style={{ color: "#4a5f78" }}>No staff found</td></tr>
              )}
              {filtered.map(s => (
                <tr key={s.id} className="border-b" style={{ borderColor: "rgba(100,140,200,0.05)" }}>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[11px]" style={{ color: "#f59e0b" }}>{s.jobNumber}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[12px]" style={{ color: "#c9d4e8", fontFamily: FONT_SANS }}>{s.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(100,140,200,0.08)", color: "#7a8fa8" }}>{s.role}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] font-mono" style={{ color: "#4a5f78" }}>{s.station}</td>
                  <td className="py-2.5 px-3">
                    <button onClick={() => handleDelete(s.id)} className="p-1 rounded hover:bg-white/5 transition-colors" style={{ color: "#4a5f78" }}>
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
