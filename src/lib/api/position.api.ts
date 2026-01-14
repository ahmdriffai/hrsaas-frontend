import type z from "zod";
import type {
  CreatePositionSchema,
  SearchPositionRequest,
} from "../model/position.model";
import type { Paging } from "../types/paging-types";
import type { Position } from "../types/position.type";

const BASE_URL = import.meta.env.VITE_API_PATH;

export const positionCreate = async (
  token: string,
  data: z.infer<typeof CreatePositionSchema>
) => {
  return await fetch(`${BASE_URL}/positions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
};

export const positionList = async (
  token: string | undefined,
  request: SearchPositionRequest
): Promise<{ paging: Paging; data: Position[] }> => {
  const url = new URL(`${BASE_URL}/positions`);

  if (request.name) url.searchParams.append("name", request.name);
  if (request.page) url.searchParams.append("page", request.page.toString());
  if (request.size) url.searchParams.append("size", request.size.toString());

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch employees");
  }

  return response.json();
};
