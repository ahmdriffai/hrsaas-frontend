/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  officeLocAssignEmploye,
  officeLocationCreate,
  officeLocationDetail,
  officeLocationList,
} from "@/lib/api/office-location.api";
import type {
  CreateOfficeLocationSchema,
  OfficeLocAssignEmployeeSchema,
  OfficeLocation,
  SearchOfficeLocationRequest,
} from "@/lib/model/office-location.model";
import type { Paging } from "@/lib/types/paging-types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type z from "zod";

export function useCreateOfficeLocation(token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: z.infer<typeof CreateOfficeLocationSchema>) =>
      officeLocationCreate(token ?? "", data),

    onSuccess: async (response) => {
      const responseBody = await response.json();

      if (response.status === 200) {
        toast.success("Office location created successfully");

        queryClient.invalidateQueries({
          queryKey: ["office-locations"],
        });
      } else {
        toast.error(responseBody?.error ?? "Failed to create office location");
      }
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
}

export function useGetOfficeLocation(
  token: string | undefined,
  search: SearchOfficeLocationRequest,
) {
  return useQuery<{
    paging: Paging;
    data: OfficeLocation[];
  }>({
    queryKey: ["office-locations", search],
    queryFn: async () => officeLocationList(token, search),
    enabled: !!token,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}

export function useGetDetailOfficeLoc(
  token: string | undefined,
  officeLocationID: string,
) {
  return useQuery<OfficeLocation>({
    queryKey: ["office-location", officeLocationID],
    queryFn: async () => officeLocationDetail(token, officeLocationID),
    enabled: !!token,
    retry: 2,
  });
}

export function useOfficeLocAssignEmployee(token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: z.infer<typeof OfficeLocAssignEmployeeSchema>) =>
      officeLocAssignEmploye(token ?? "", data),
    onSuccess: async (response) => {
      const responseBody = await response.json();

      if (response.status === 200) {
        toast.success("Berhasil menugaskan karyawan");

        queryClient.invalidateQueries({
          queryKey: ["office-location"],
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
