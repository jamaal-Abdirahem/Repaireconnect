import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Phone, Info, Dot } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { Label } from "../../../components/ui/label.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx";
import { logoutUser } from "../../../store/slices/authSlice.js";

export function TechProfile({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-xl mx-auto">
      <Card className="shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-surface-100 rounded-bl-[100px] -z-10 opacity-50" />
        <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
          <Avatar name={user?.name || "?"} size="lg" color="brand" />
          <div className="flex-1">
            <p className="font-bold text-surface-900 text-xl tracking-tight">{user?.name}</p>
            <p className="text-sm text-brand-500 font-bold uppercase tracking-wider mt-1.5">Technician</p>
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-surface-500 text-sm font-medium">
              <Dot size={18} className="text-brand-500" /> Available for jobs
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-surface-900 text-sm uppercase tracking-wider">
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input name="name" value={user?.name || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input name="phone" value={user?.phone || ""} readOnly />
          </div>
          <div className="bg-surface-50 rounded-md p-4 border border-surface-100">
            <p className="text-xs text-surface-500 flex items-center gap-2 font-medium">
              <Info size={14} className="text-surface-500" /> Contact your administrator to update your account details.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="pt-2">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full py-6 group hover:text-brand-500 hover:border-surface-200 flex items-center justify-center gap-2 transition-all duration-200"
          aria-label="Log out"
        >
          <LogOut size={16} className="text-surface-500 group-hover:text-brand-500 transition-colors" /> Log Out
        </Button>
      </div>
    </div>
  );
}
