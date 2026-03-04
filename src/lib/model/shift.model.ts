export type SearchShiftRequest = {
  key?: string;
  page?: number;
  size?: number;
};

export type Shift = {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  late_tolerance: number;
  status?: "Aktif" | "Nonaktif";
};
