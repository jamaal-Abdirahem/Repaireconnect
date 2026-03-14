/** portals/admin/pages/AdminTechnicians.jsx */
import {
  Phone,
  MapPin,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  Loader2,
  User,
  Lock,
  PlusCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import { InputField } from "../../../components/ui/InputField.jsx";
import { Button } from "../../../components/ui/button.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table.jsx";
import { register as registerUser } from "../../../api/auth.js";
import { registerSchema } from "../../../validations/authSchemas.js";
import { setTechnicianAvailability } from "../../../api/users.js";
import { cls } from "../../../utils/helpers.js";

export function AdminTechnicians({ technicians, onRefresh, onToast }) {
  const [toggling, setToggling] = useState(null);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
    },
  });

  const handleToggle = async (tech) => {
    setToggling(tech.id);
    try {
      await setTechnicianAvailability(tech.id, !tech.available);
      onToast(
        `${tech.user?.name} marked as ${!tech.available ? "available" : "unavailable"}.`,
        "success",
      );
      onRefresh();
    } catch (err) {
      onToast(err.message || "Could not update availability.", "error");
    } finally {
      setToggling(null);
    }
  };

  const onCreateTechnician = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      await registerUser({
        name: values.name.trim(),
        phone: values.phone.trim(),
        password: values.password,
        role: "TECHNICIAN",
      });
      onToast("Technician created successfully.", "success");
      reset();
      setAdding(false);
      onRefresh();
    } catch (err) {
      setError(err.message || "Could not create technician.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-200 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-surface-900 tracking-tight">
            Technicians
          </h2>
          <div className="flex items-center gap-3 text-sm text-surface-500 mt-2 font-medium">
            <span className="flex items-center gap-1.5 bg-surface-50 text-brand-500 px-2.5 py-1 rounded-md border border-surface-200">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              {technicians.filter((t) => t.available).length} available
            </span>
            <span className="flex items-center gap-1.5 bg-surface-100 text-surface-600 px-2.5 py-1 rounded-md border border-surface-200">
              <span className="w-2 h-2 rounded-full bg-surface-400"></span>
              {technicians.filter((t) => !t.available).length} busy
            </span>
          </div>
        </div>

        <Button
          onClick={() => {
            setAdding((v) => !v);
            setError("");
            if (!adding) reset();
          }}
          className="gap-2"
        >
          <PlusCircle size={18} />
          {adding ? "Cancel" : "Add Technician"}
        </Button>
      </div>

      {adding && (
        <Card className="shadow-sm">
          <CardHeader className="border-b border-surface-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Register New Technician</CardTitle>
                <CardDescription>
                  Create a technician account; a technician profile will be
                  linked automatically.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setAdding(false);
                  setError("");
                  reset();
                }}
              >
                <X size={18} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md px-4 py-3 flex gap-2 items-start shadow-sm mb-6">
                <AlertTriangle
                  size={16}
                  className="shrink-0 mt-0.5 text-destructive"
                />{" "}
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onCreateTechnician)}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <InputField
                    {...register("name")}
                    label="Full Name"
                    placeholder="Ahmed Ali"
                    icon={User}
                    className={
                      errors.name
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs mt-1.5 font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    {...register("phone")}
                    label="Phone Number"
                    placeholder="0634567890"
                    type="tel"
                    icon={Phone}
                    className={
                      errors.phone
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {errors.phone && (
                    <p className="text-destructive text-xs mt-1.5 font-medium">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    {...register("password")}
                    label="Password"
                    type="password"
                    placeholder="Min 8 characters"
                    icon={Lock}
                    className={
                      errors.password
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {errors.password && (
                    <p className="text-destructive text-xs mt-1.5 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-surface-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAdding(false);
                    setError("");
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating…" : "Create Technician"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {technicians.length === 0 && !adding && (
        <Card className="py-10 shadow-sm border-dashed">
          <CardContent className="text-center text-surface-400 text-sm py-4">
            No technicians registered yet. Use "Add Technician" to create one.
          </CardContent>
        </Card>
      )}

      {technicians.length > 0 && (
        <Card className="shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-50/50">
                <TableHead>Technician</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar name={t.user?.name} size="md" color="brand" />
                        <span
                          className={cls(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface-50",
                            "bg-brand-500",
                          )}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-surface-900">
                          {t.user?.name}
                        </p>
                        {t.location && (
                          <p className="text-xs text-surface-500 flex items-center gap-1 mt-0.5 font-medium">
                            <MapPin size={10} /> {t.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-surface-600 flex items-center gap-2 font-medium">
                      <Phone size={14} className="text-surface-400" />{" "}
                      {t.user?.phone}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge color="brand">
                      {t.available ? "Available" : "On Job"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={t.available ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => handleToggle(t)}
                      disabled={!!toggling}
                      className={cls(
                        "gap-2 w-[110px]",
                        t.available &&
                          "hover:bg-surface-100 hover:text-brand-500 hover:border-surface-200 text-surface-700",
                        !t.available &&
                          "bg-surface-50 text-brand-500 hover:bg-surface-100 border border-surface-200",
                      )}
                    >
                      {toggling === t.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : t.available ? (
                        <ToggleRight size={14} />
                      ) : (
                        <ToggleLeft size={14} />
                      )}
                      {t.available ? "Set Busy" : "Set Free"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
