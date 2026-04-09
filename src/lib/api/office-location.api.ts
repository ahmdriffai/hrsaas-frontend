import type z from "zod";
import type {
  CreateOfficeLocationSchema,
  OfficeLocAssignEmployeeSchema,
  OfficeLocation,
  SearchOfficeLocationRequest,
} from "../model/office-location.model";
import type { Paging } from "../types/paging-types";

const BASE_URL = import.meta.env.VITE_API_PATH;

export const officeLocationCreate = async (
  token: string,
  data: z.infer<typeof CreateOfficeLocationSchema>,
) => {
  const payload = {
    ...data,
    lat: parseFloat(data.lat),
    lng: parseFloat(data.lng),
  };

  return await fetch(`${BASE_URL}/office-locations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(payload),
  });
};

export const officeLocationList = async (
  token: string | undefined,
  request: SearchOfficeLocationRequest,
): Promise<{ paging: Paging; data: OfficeLocation[] }> => {
  const url = new URL(`${BASE_URL}/office-locations`);

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
    throw new Error(err.message || "Failed to fetch office locations");
  }

  return response.json();
};

export const officeLocationDetail = async (
  token: string | undefined,
  officeLocationID: string,
): Promise<OfficeLocation> => {
  const url = new URL(`${BASE_URL}/office-locations/${officeLocationID}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch office location");
  }

  const data = await response.json();

  return data.data;
};

export const officeLocAssignEmploye = async (
  token: string,
  request: z.infer<typeof OfficeLocAssignEmployeeSchema>,
) => {
  return await fetch(`${BASE_URL}/office-locations/assign-employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(request),
  });
};
