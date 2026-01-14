import { z } from "zod";

export const CreateEmployeeScheme = z.object({
  employee_number: z.string().min(1),
  fullname: z.string().min(1),
  birth_place: z.string().min(1),
  birth_date: z.string().min(1),
  blood_type: z.string().min(1),
  marital_status: z.string().min(1),
  religion: z.string().min(1),
  phone: z.string().min(1),
  timezone: z.string().min(1),
});

export type SearchEmployeeRequest = {
  key?: string;
  page?: number;
  size?: number;
};

export type Employee = {
  id: string;
  fullname: string;
  employee_number: string;
  birth_place: string;
  birth_date: string;
  blood_type: string;
  marital_status: string;
  religion: string;
  phone: string;
  timezone: string;
};
