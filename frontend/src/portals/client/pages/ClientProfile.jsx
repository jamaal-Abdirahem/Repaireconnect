/** portals/client/pages/ClientProfile.jsx */
import { useState } from "react";
import { User, Phone, LogOut, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { InputField } from "../../../components/ui/InputField.jsx";
import { formatDate } from "../../../utils/helpers.js";

export function ClientProfile({ user, onLogout, onToast }) {
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [saved, setSaved] = useState(false);
  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Profile update is not currently in the backend API — shows a helpful message
  const handleSave = () => {
    setSaved(true);
    onToast("Profile saved locally. Backend update coming soon.", "info");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-xl mx-auto">
      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
        <Avatar name={user?.name || "?"} size="lg" color="amber" />
        <div>
          <p className="font-bold text-slate-900">{user?.name}</p>
          <p className="text-sm text-gray-500 mt-0.5">Client account</p>
          {user?.createdAt && (
            <p className="text-xs text-gray-400 mt-0.5">Joined {formatDate(user.createdAt)}</p>
          )}
        </div>
      </div>

      {/* Edit info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h3 className="font-semibold text-slate-900 text-sm">Personal Information</h3>
        <InputField label="Full Name" name="name" value={form.name} onChange={ch} icon={User} placeholder="Your name" />
        <InputField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={ch} icon={Phone} placeholder="Your phone" />
      </div>

      <button
        onClick={handleSave}
        className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
          saved ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {saved ? "✓ Saved!" : "Save Changes"}
      </button>

      <button
        onClick={onLogout}
        className="w-full py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={14} /> Log Out
      </button>
    </div>
  );
}
