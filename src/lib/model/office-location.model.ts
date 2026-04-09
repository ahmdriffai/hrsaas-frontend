import z from "zod";
import type { Employee } from "./employee.model";

export type OfficeLocation = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  radius_meters: number;
  is_active: boolean;
  employees: Employee[];
};

export const CreateOfficeLocationSchema = z.object({
  name: z.string().min(1, "Nama lokasi wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  lat: z.string(),
  lng: z.string(),
  radius: z.number().min(0, "Radius tidak boleh negatif"),
});

export type SearchOfficeLocationRequest = {
  key?: string;
  page?: number;
  size?: number;
};

export const OfficeLocAssignEmployeeSchema = z.object({
  employee_id: z.string(),
  office_location_id: z.string(),
});
