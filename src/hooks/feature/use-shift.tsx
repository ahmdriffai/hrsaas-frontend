import { shiftList } from "@/lib/api/shift.api";
import type { SearchShiftRequest, Shift } from "@/lib/model/shift.model";
import type { Paging } from "@/lib/types/paging-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetShift(
  token: string | undefined,
  search: SearchShiftRequest,
) {
  return useQuery<{
    paging: Paging;
    data: Shift[];
  }>({
    queryKey: ["shifts", search],
    queryFn: async () => shiftList(token, search),
    enabled: !!token,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}
