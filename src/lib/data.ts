import type { Option } from "@/components/fragment/select/select";

export const religion: Option[] = [
  { value: "Islam", label: "Islam" },
  { value: "Hindu", label: "Hindu" },
  { value: "Budha", label: "Budha" },
  { value: "Kristen", label: "Kristen" },
  { value: "Konghuchu", label: "Konghuchu" },
];

export const blood_type: Option[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "AB", label: "AB" },
  { value: "O", label: "O" },
  { value: "O+", label: "O+" },
];

export const maritalStatus: Option[] = [
  { value: "Belum Kawin", label: "Belum Kawin" },
  { value: "Kawin", label: "Kawin" },
  { value: "Janda", label: "Janda" },
  { value: "Duda", label: "Duda" },
];

export const sanctionLevel: number[] = [1, 2, 3];
