import { useState } from "react";
import {
  Car,
  MapPin,
  Wrench,
  FileText,
  AlertTriangle,
  Phone,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newRequestSchema } from "../../../validations/serviceSchemas.js";
import { InputField } from "../../../components/ui/InputField.jsx";
import { createRequest } from "../../../api/requests.js";
import { LocationPickerMap } from "../../../components/ui/LocationPickerMap.jsx";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "../../../components/ui/card.jsx";
import { Button } from "../../../components/ui/button.jsx";

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

export function NewRequestForm({
  onSuccess,
  onCancel,
  defaultName = "",
  defaultPhone = "",
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newRequestSchema),
    defaultValues: {
      clientName: defaultName,
      phone: defaultPhone,
      location: "",
      vehicleType: "CAR",
      vehicle: "",
      problem: PROBLEM_TYPES[0],
      extraNotes: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    const problemText = data.extraNotes?.trim()
      ? `${data.problem} — Vehicle: ${data.vehicle}. Notes: ${data.extraNotes}`
      : `${data.problem} — Vehicle: ${data.vehicle}`;

    setLoading(true);
    try {
      const req = await createRequest({
        clientName: data.clientName.trim(),
        phone: data.phone.trim(),
        location: data.location.trim(),
        vehicleType: data.vehicleType,
        latitude: coords ? coords.lat : null,
        longitude: coords ? coords.lng : null,
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
    <Card className="relative overflow-hidden  border-surface-200 shadow-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl pointer-events-none -z-10" />

      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl tracking-tight">
          <div className="w-10 h-10 bg-brand-500/10 rounded-none flex items-center justify-center shrink-0">
            <Car size={20} className="text-brand-600" />
          </div>
          Request Service
        </CardTitle>
        <CardDescription>
          Fill out the form below to request a technician to your location.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-brand-500/10 border border-brand-500/30 text-brand-600 text-sm rounded-md px-4 py-3 flex gap-2.5 items-start font-medium shadow-inner mb-6">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-brand-600" /> {error}
          </div>
        )}

        <form id="new-request-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          <div className="grid gap-4">
            <div>
              <InputField
                {...register("clientName")}
                label="Your Name"
                placeholder="Jane Smith"
                icon={User}
                className={errors.clientName ? "border-brand-500 focus-visible:ring-brand-500" : ""}
              />
              {errors.clientName && (
                <p className="text-brand-600 text-xs mt-1">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            <div>
              <InputField
                {...register("phone")}
                label="Contact Phone"
                placeholder="+1 (555) 000-0000"
                icon={Phone}
                type="tel"
                className={errors.phone ? "border-brand-500 focus-visible:ring-brand-500" : ""}
              />
              {errors.phone && (
                <p className="text-brand-600 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <InputField
                {...register("location")}
                label="Current Location"
                placeholder="e.g. KM4, near Sahafi Hotel"
                icon={MapPin}
                className={errors.location ? "border-brand-500 focus-visible:ring-brand-500" : ""}
                hint="Describe nearby roads or landmarks in Mogadishu. Then drop a pin on the map."
              />
              {errors.location && (
                <p className="text-brand-600 text-xs mt-1">
                  {errors.location.message}
                </p>
              )}
              <div className="rounded-md overflow-hidden border border-surface-200">
                <LocationPickerMap value={coords} onChange={setCoords} />
              </div>
              {coords && (
                <p className="text-[11px] text-surface-400">
                  Picked location: {coords.lat.toFixed(5)},{" "}
                  {coords.lng.toFixed(5)}
                </p>
              )}
            </div>

            <div>
              <InputField
                {...register("vehicle")}
                label="Vehicle (Year+Make+Model)"
                placeholder="Toyota Camry 2021"
                icon={Car}
                className={errors.vehicle ? "border-brand-500 focus-visible:ring-brand-500" : ""}
              />
              {errors.vehicle && (
                <p className="text-brand-600 text-xs mt-1">
                  {errors.vehicle.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-surface-900 block mb-2">
                Vehicle Type
              </label>
              <div className="relative group">
                <Car
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none group-focus-within:text-brand-500 transition-colors"
                />
                <select
                  {...register("vehicleType")}
                  className="flex h-10 w-full rounded-md border border-surface-200 bg-surface-50 px-3 py-2 text-sm shadow-sm ring-offset-surface-50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-surface-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 cursor-pointer appearance-none"
                >
                  <option value="CAR">Car</option>
                  <option value="MOTORCYCLE">Motorcycle</option>
                  <option value="BAJAJ">Bajaj / Tuk-tuk</option>
                  <option value="LORRY">Lorry / Truck</option>
                  <option value="BUS">Bus</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              {errors.vehicleType && (
                <p className="text-brand-600 text-xs mt-1 font-medium px-1">
                  {errors.vehicleType.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-surface-900 block mb-2">
                Problem Type
              </label>
              <div className="relative group">
                <Wrench
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none group-focus-within:text-brand-500 transition-colors"
                />
                <select
                  {...register("problem")}
                  className="flex h-10 w-full rounded-md border border-surface-200 bg-surface-50 px-3 py-2 text-sm shadow-sm ring-offset-surface-50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-surface-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 cursor-pointer appearance-none"
                >
                  {PROBLEM_TYPES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-surface-900 block mb-2">
                Additional Notes <span className="font-medium normal-case text-surface-400 font-normal">(optional)</span>
              </label>
              <div className="relative group">
                <FileText
                  size={16}
                  className="absolute left-3.5 top-3.5 text-surface-400 pointer-events-none group-focus-within:text-brand-500 transition-colors"
                />
                <textarea
                  {...register("extraNotes")}
                  rows={3}
                  placeholder="Any extra details that will help the technician…"
                  className="flex min-h-[80px] w-full rounded-md border border-surface-200 bg-surface-50 px-3 py-2 text-sm shadow-sm ring-offset-surface-50 placeholder:text-surface-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-brand-50 border border-brand-200/50 rounded-md px-5 py-4 text-sm font-medium text-brand-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
               <span className="text-brand-600 text-lg">⚡</span>
            </div>
            <p>We'll assign a technician within <strong className="font-bold text-brand-900">20–30 minutes</strong>.</p>
          </div>
        </form>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-4 border-t border-surface-100 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full h-12 text-sm font-bold"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="new-request-form"
          disabled={loading}
          className="w-full h-12 text-sm font-bold"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-surface-50/30 border-t-surface-50 rounded-full animate-spin" /> Submitting...
            </span>
          ) : (
            "Submit Request"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
