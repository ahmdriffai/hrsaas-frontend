/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  shiftAssignEmploye,
  shiftCreate,
  shiftDetail,
  shiftList,
} from "@/lib/api/shift.api";
import type {
  CreateShiftSchema,
  SearchShiftRequest,
  Shift,
  ShiftAssignEmployeeSchema,
} from "@/lib/model/shift.model";
import type { PaginatedData } from "@/lib/types/types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type z from "zod";

export function useCreateShift(token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: z.infer<typeof CreateShiftSchema>) =>
      shiftCreate(token ?? "", data),
    onSuccess: async (response) => {
      const responseBody = await response.json();

      if (response.status === 200) {
        toast.success("Shift created successfully");

        queryClient.invalidateQueries({
          queryKey: ["shifts"],
        });
      } else {
        toast.error(responseBody?.error ?? "Failed to create shift");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
}

export function useGetShift(
  token: string | undefined,
  search: SearchShiftRequest,
) {
  return useQuery<PaginatedData<Shift>>({
    queryKey: ["shifts", search],
    queryFn: async () => shiftList(token, search),
    enabled: !!token,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}

export function useGetDetailShift(token: string | undefined, shiftID: string) {
  return useQuery<Shift>({
    queryKey: ["shifts", shiftID],
    queryFn: async () => shiftDetail(token, shiftID),
    enabled: !!token,
    retry: 2,
  });
}

export function useShiftAssignEmployee(token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: z.infer<typeof ShiftAssignEmployeeSchema>) =>
      shiftAssignEmploye(token ?? "", data),
    onSuccess: async (response) => {
      const responseBody = await response.json();

      if (response.status === 200) {
        toast.success("Berhasil menugaskan karyawan");

        queryClient.invalidateQueries({
          queryKey: ["shifts"],
        });
      } else {
        toast.error(responseBody?.error ?? "Failed to create shift");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
}
