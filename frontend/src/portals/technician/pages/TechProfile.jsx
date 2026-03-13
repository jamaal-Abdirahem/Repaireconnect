/** portals/technician/pages/TechProfile.jsx */
import { LogOut, User, Phone } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { InputField } from "../../../components/ui/InputField.jsx";

export function TechProfile({ user, onLogout }) {
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
        <Avatar name={user?.name || "?"} size="lg" color="emerald" />
        <div>
          <p className="font-bold text-slate-900">{user?.name}</p>
          <p className="text-sm text-emerald-600 font-medium mt-0.5">Technician</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h3 className="font-semibold text-slate-900 text-sm">Account Details</h3>
        <InputField label="Full Name" name="name" value={user?.name || ""} onChange={() => {}} icon={User} disabled />
        <InputField label="Phone" name="phone" value={user?.phone || ""} onChange={() => {}} icon={Phone} disabled />
        <p className="text-xs text-gray-400">Contact your administrator to update your account details.</p>
      </div>

      <button
        onClick={onLogout}
        className="w-full py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={14} /> Log Out
      </button>
    </div>
  );
}
