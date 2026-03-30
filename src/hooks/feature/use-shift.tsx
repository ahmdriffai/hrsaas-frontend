import { shiftList } from "@/lib/api/shift.api";
import type { SearchShiftRequest, Shift } from "@/lib/model/shift.model";
import type { PaginatedData } from "@/lib/types/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// export function useCreateShift(token?: string) {
//   // const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: z.infer<typeof CreateShiftSchema>) =>
//       shiftCreate(token ?? "", data),
//     // onSuccess: async (response) => {
//     //   const responseBody = await response.json();

//     //   if (response.status === 200) {
//     //     toast.success("Shift created successfully");

//     //     queryClient.invalidateQueries({
//     //       queryKey: ["shifts"],
//     //     });
//     //   } else {
//     //     toast.error(responseBody?.error ?? "Failed to create shift");
//     //   }
//     // },
//     onError: (error: any) => {
//       toast.error(error?.message || "Something went wrong");
//     },
//   });
// }

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
