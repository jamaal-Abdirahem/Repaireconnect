/** portals/client/components/NewRequestForm.jsx */
import { useState } from "react";
import { Car, MapPin, Wrench, FileText, AlertTriangle, Phone, User } from "lucide-react";
import { InputField } from "../../../components/ui/InputField.jsx";
import { createRequest } from "../../../api/requests.js";

const PROBLEM_TYPES = [
  "Battery dead / won't start",
  "Flat tyre",
  "Engine overheating",
  "Brake issues",
  "Locked out of car",
  "Fuel empty",
  "Electrical fault",
  "AC not working",
  "Accident / vehicle damage",
  "Other",
];

export function NewRequestForm({ onSuccess, onCancel, defaultName = "", defaultPhone = "" }) {
  const [form, setForm] = useState({
    clientName: defaultName,
    phone: defaultPhone,
    location: "",
    vehicle: "",
    problem: PROBLEM_TYPES[0],
    extraNotes: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError("");
    if (!form.phone.trim() || !form.location.trim() || !form.vehicle.trim()) {
      setError("Phone, location, and vehicle are required."); return;
    }
    const problemText = form.extraNotes.trim()
      ? `${form.problem} — Vehicle: ${form.vehicle}. Notes: ${form.extraNotes}`
      : `${form.problem} — Vehicle: ${form.vehicle}`;

    setLoading(true);
    try {
      const req = await createRequest({
        clientName: form.clientName.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        problem: problemText,
      });
      onSuccess(req);
    } catch (err) {
      setError(err.message || "Could not submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <h3 className="font-bold text-slate-900 text-lg">Request Roadside Assistance</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2.5 flex gap-2 items-start">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}

      <div className="grid gap-4">
        <InputField label="Your Name"            name="clientName"  value={form.clientName}  onChange={ch} placeholder="Jane Smith"               icon={User}   />
        <InputField label="Contact Phone"        name="phone"       value={form.phone}       onChange={ch} placeholder="+1 (555) 000-0000"         icon={Phone}  type="tel" />
        <InputField label="Current Location"     name="location"    value={form.location}    onChange={ch} placeholder="123 Main St, near BP Station" icon={MapPin} />
        <InputField label="Vehicle (Year+Make+Model)" name="vehicle" value={form.vehicle}   onChange={ch} placeholder="Toyota Camry 2021"          icon={Car}    />

        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Problem Type</label>
          <div className="relative">
            <Wrench size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              name="problem"
              value={form.problem}
              onChange={ch}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-slate-800 transition"
            >
              {PROBLEM_TYPES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Additional Notes <span className="font-normal">(optional)</span></label>
          <div className="relative">
            <FileText size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
            <textarea
              name="extraNotes"
              value={form.extraNotes}
              onChange={ch}
              rows={3}
              placeholder="Any extra details that will help the technician…"
              className="w-full pl-9 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-800 transition resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
        ✓ We'll assign a technician within <strong>20–30 minutes</strong>.
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button onClick={onCancel} className="py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={submit} disabled={loading} className="py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60">
          {loading ? "Submitting…" : "Submit Request"}
        </button>
      </div>
    </div>
  );
}
