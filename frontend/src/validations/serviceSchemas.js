import { z } from "zod";

export const newRequestSchema = z.object({
  clientName: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  location: z.string().min(5, "A descriptive location is required"),
  vehicleType: z.enum(["CAR", "MOTORCYCLE", "BAJAJ", "LORRY", "BUS", "OTHER"], {
    required_error: "Please select a vehicle type",
  }),
  vehicle: z
    .string()
    .min(3, "Please enter your vehicle (e.g. Toyota Camry 2021)"),
  problem: z.string().min(1, "Please select a problem type"),
  extraNotes: z.string().optional(),
});
