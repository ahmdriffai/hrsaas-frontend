import { employeeList } from "@/lib/api/employee.api";
import type {
  Employee,
  SearchEmployeeRequest,
} from "@/lib/model/employee.model";
import type { PaginatedData } from "@/lib/types/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetEmployee(
  token: string | undefined,
  search: SearchEmployeeRequest,
) {
  return useQuery<PaginatedData<Employee>>({
    queryKey: ["employees", search],
    queryFn: async () => employeeList(token, search),
    enabled: !!token,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}
