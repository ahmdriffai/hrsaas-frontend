import z from "zod";

export const CreatePositionSchema = z.object({
  name: z.string(),
  parent_id: z.string().nullable().optional(),
});

export type SearchPositionRequest = {
  name?: string;
  page?: number;
  size?: number;
};
