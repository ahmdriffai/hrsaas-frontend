import type z from "zod";
import type {
  CreateShiftSchema,
  SearchShiftRequest,
  Shift,
  ShiftAssignEmployeeSchema,
} from "../model/shift.model";
import type { Paging } from "../types/paging-types";

const BASE_URL = import.meta.env.VITE_API_PATH;

export const shiftCreate = async (
  token: string,
  request: z.infer<typeof CreateShiftSchema>,
) => {
  return await fetch(`${BASE_URL}/shifts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(request),
  });
};

export const shiftList = async (
  token: string | undefined,
  request: SearchShiftRequest,
): Promise<{ paging: Paging; data: Shift[] }> => {
  const url = new URL(`${BASE_URL}/shifts`);

  if (request.key) url.searchParams.append("key", request.key);
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
    throw new Error(err.message || "Failed to fetch shifts");
  }

  return response.json();
};

export const shiftDetail = async (
  token: string | undefined,
  shiftID: string,
): Promise<Shift> => {
  const url = new URL(`${BASE_URL}/shifts/${shiftID}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch shifts");
  }

  const data = await response.json();

  return data.data;
};

export const shiftAssignEmploye = async (
  token: string,
  request: z.infer<typeof ShiftAssignEmployeeSchema>,
) => {
  return await fetch(`${BASE_URL}/shifts/assign-employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(request),
  });
};
