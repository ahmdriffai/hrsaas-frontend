import z from "zod";

export type SearchShiftRequest = {
  key?: string;
  page?: number;
  size?: number;
};

export type ShiftDayType = "workday" | "offday";

export type Shift = {
  id: string;
  company_id: string;
  name: string;
  late_tolerance: number;
  shift_days: ShiftDay[];
  created_at: string;
  updated_at: string;
};

export type ShiftDay = {
  weekday: number;
  day_type: ShiftDayType;
  check_in?: string;
  check_out?: string;
  break_start?: string;
  break_end?: string;
  max_break_minutes?: number;
};

export const CreateShiftSchema = z.object({
  name: z.string().min(1),
  late_tolerance: z.number(),
  shift_days: z.array(
    z.object({
      weekday: z.number(),
      day_type: z.enum(["workday", "offday"]),
      check_in: z.string().optional(),
      check_out: z.string().optional(),
      break_start: z.string().optional(),
      break_end: z.string().optional(),
      max_break_minutes: z.number().optional(),
    }),
  ),
});
export const WEEKDAY_LABEL: Record<number, string> = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
  7: "Minggu",
};
