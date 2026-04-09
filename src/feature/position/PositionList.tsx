import Table from "@/components/fragment/table/table";
import { OwnPagination } from "@/components/ui/custom/ownpagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Position } from "@/lib/types/position.type";
import type { PaginatedData } from "@/lib/types/types";
import { getLevel } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface Props {
  data: PaginatedData<Position> | undefined;
  page: number;
  size: string;
  setPage: (value: number) => void;
  setSize: (value: string) => void;
}

export default function PositionList({
  data,
  page,
  size,
  setPage,
  setSize,
}: Props) {
  return (
    <div>
      <Table
        data={data?.data || []}
        keyExtractor={(row) => row.id}
        columns={[
          {
            header: "Name",
            accessor: (row) => {
              const level = getLevel(row);
              return (
                <div className="flex items-center gap-3">
                  <span className="mr-2 text-gray-300 flex">
                    {Array.from({ length: level }).map((_, i) => (
                      <ArrowRight size={15} strokeWidth={3} key={i} />
                    ))}
                  </span>
                  <span className="font-medium">{row.name}</span>
                </div>
              );
            },
          },
          {
            header: "Action",
            accessor: () => (
              <button className="text-sm text-gray-500 hover:text-black">
                Edit
              </button>
            ),
            className: "text-right",
          },
        ]}
      />
      <div className="flex justify-between items-center mt-5">
        <p className="font-bold text-xs">
          Menampilkan {data?.data?.length} dari {data?.paging.total_item} total
          data.
        </p>
        <div className="flex items-center justify-center gap-x-1">
          <Select
            onValueChange={(value) => {
              setSize(value);
              setPage(1);
            }}
            value={size}
          >
            <SelectTrigger className="w-fit text-xs p-1 ps-2">
              <SelectValue placeholder="Select a religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Total</SelectLabel>
                {[1, 10, 50, 100].map((value, index) => (
                  <SelectItem key={index} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {data && (
            <OwnPagination
              currentPage={page}
              paging={data.paging}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
