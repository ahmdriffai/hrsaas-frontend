/* eslint-disable @typescript-eslint/no-explicit-any */
import { positionCreate, positionList } from "@/lib/api/position.api";
import type {
  CreatePositionSchema,
  SearchPositionRequest,
} from "@/lib/model/position.model";
import type { Paging } from "@/lib/types/paging-types";
import type { Position } from "@/lib/types/position.type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type z from "zod";

export function useCreatePosition(token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: z.infer<typeof CreatePositionSchema>) =>
      positionCreate(token ?? "", data),

    onSuccess: async (response) => {
      const responseBody = await response.json();

      if (response.status === 200) {
        toast.success("Position created successfully");

        // invalidate list sanction (sesuaikan key)
        queryClient.invalidateQueries({
          queryKey: ["positions"],
        });
      } else {
        toast.error(responseBody?.error ?? "Failed to create position");
      }
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
}

export function useGetPosition(
  token: string | undefined,
  search: SearchPositionRequest
) {
  return useQuery<{
    paging: Paging;
    data: Position[];
  }>({
    queryKey: ["positions", search],
    queryFn: async () => positionList(token, search),
    enabled: !!token,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}
