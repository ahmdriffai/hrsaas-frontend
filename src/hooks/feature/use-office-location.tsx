/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  officeLocationCreate,
  officeLocationList,
} from "@/lib/api/office-location.api";
import type {
  CreateOfficeLocationSchema,
  SearchOfficeLocationRequest,
} from "@/lib/model/office-location.model";
import type { Paging } from "@/lib/types/paging-types";
import type { OfficeLocation } from "@/lib/types/officelocation-type";
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
