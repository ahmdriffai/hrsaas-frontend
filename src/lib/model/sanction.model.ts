import z from "zod";
import type { Employee } from "./employee.model";

export type Sanction = {
  id: string;
  employee: Employee;
  sanction: SanctionType;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
};

export const CreateSanctionSchema = z.object({
  employee_id: z.string(),
  sanction_id: z.string(),
  reason: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  document_url: z.string(),
});

export type SanctionType = {
  id: string;
  name: string;
  description: string;
};

export const CreateSanctionTypeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  level: z.string().min(1), // e.g., 1 for low, 2 for medium, 3 for high
  note: z.string().min(1),
});

export type SearchSanctionRequest = {
  sanction_id?: string;
  reason?: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  status?: string; // active, lifted, expired
  page?: number;
  size?: number;
};

export type SearchSanctionTypeReq = {
  key?: string;
  page?: number;
  size?: number;
};
