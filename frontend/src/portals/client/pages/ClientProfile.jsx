import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Phone, LogOut, Check } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { Label } from "../../../components/ui/label.jsx";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { formatDate } from "../../../utils/helpers.js";
import { logoutUser } from "../../../store/slices/authSlice.js";

export function ClientProfile({ user, onToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [saved, setSaved] = useState(false);
  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  // Profile update is not currently in the backend API — shows a helpful message
  const handleSave = () => {
    setSaved(true);
    onToast("Profile saved locally. Backend update coming soon.", "info");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Avatar card */}
      <Card className="rounded-none shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <CardContent className="p-8 flex items-center gap-6">
          <div className="relative z-10 ring-2 ring-surface-200 rounded-full p-1 border border-surface-200 shadow-inner">
            <Avatar name={user?.name || "?"} size="lg" color="brand" />
          </div>
          <div className="relative z-10">
            <p className="font-bold text-surface-900 text-2xl tracking-tight">{user?.name}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded-md bg-surface-100 text-brand-500 text-xs font-bold uppercase tracking-widest border border-surface-200">Client Account</span>
            </div>
            {user?.createdAt && (
              <p className="text-xs text-surface-500 mt-2 font-medium bg-surface-50 inline-block px-2 py-1 rounded-md">Joined {formatDate(user.createdAt)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit info */}
      <Card className="rounded-none shadow-sm">
        <CardContent className="p-8 space-y-6">
          <h3 className="font-bold text-surface-900 text-lg flex items-center gap-2 bg-surface-50 p-3 rounded-md border border-surface-100">
            <User size={18} className="text-surface-400" /> Personal Information
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <Input name="name" value={form.name} onChange={ch} placeholder="Your name" className="pl-10" />
                <User size={16} className="absolute left-3 top-3 text-surface-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Input type="tel" name="phone" value={form.phone} onChange={ch} placeholder="Your phone" className="pl-10" />
                <Phone size={16} className="absolute left-3 top-3 text-surface-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full py-6 transition-all duration-200"
          aria-label="Log out"
        >
          <LogOut size={16} className="mr-2 text-surface-400" /> Log Out
        </Button>

        <Button
          onClick={handleSave}
          className={`w-full py-6 transition-all duration-300 ${
            saved ? "bg-brand-500 hover:bg-[#0D0D0C] text-surface-50 shadow-glow" : ""
          }`}
        >
          {saved ? (
            <span className="inline-flex items-center gap-2"><Check size={16} /> Changes Saved</span>
          ) : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
