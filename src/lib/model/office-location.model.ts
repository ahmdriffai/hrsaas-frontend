import z from "zod";

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
