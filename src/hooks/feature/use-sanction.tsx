/* eslint-disable @typescript-eslint/no-explicit-any */
import { sanctionCreate, sanctionTypeList } from "@/lib/api/sanction.api";
import type {
  CreateSanctionSchema,
  SanctionType,
  SearchSanctionTypeReq,
} from "@/lib/model/sanction.model";
import type { Paging } from "@/lib/types/paging-types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type z from "zod";

export function useGetSanctionType(
  token: string | undefined,
  search: SearchSanctionTypeReq
) {
  return useQuery<{
    paging: Paging;
    data: SanctionType[];
  }>({
    queryKey: ["sanction-types", search],
    queryFn: async () => sanctionTypeList(token, search),
    enabled: !!token,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}

export function useCreateSanction(token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: z.infer<typeof CreateSanctionSchema>) =>
      sanctionCreate(token ?? "", data),

    onSuccess: async (response) => {
      const responseBody = await response.json();

      if (response.status === 200) {
        toast.success("Sanction created successfully");

        // invalidate list sanction (sesuaikan key)
        queryClient.invalidateQueries({
          queryKey: ["sanctions"],
        });
      } else {
        toast.error(responseBody?.error ?? "Failed to create sanction");
      }
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
}
