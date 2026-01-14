import type z from "zod";
import type {
  CreateEmployeeScheme,
  Employee,
  SearchEmployeeRequest,
} from "../model/employee.model";
import type { Paging } from "../types/paging-types";

const BASE_URL = import.meta.env.VITE_API_PATH;

export const employeeCreate = async (
  token: string,
  data: z.infer<typeof CreateEmployeeScheme>
) => {
  return await fetch(`${BASE_URL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
};

export const employeeList = async (
  token: string | undefined,
  request: SearchEmployeeRequest
): Promise<{ paging: Paging; data: Employee[] }> => {
  const url = new URL(`${BASE_URL}/employees`);

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
    throw new Error(err.message || "Failed to fetch employees");
  }

  return response.json();
};
