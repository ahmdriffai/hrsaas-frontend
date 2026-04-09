import Button from "@/components/fragment/button/button";
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

import type { Sanction } from "@/lib/model/sanction.model";
import type { PaginatedData } from "@/lib/types/types";
import toIDDate from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router";

interface Props {
  data: PaginatedData<Sanction> | undefined;
  page: number;
  size: string;
  setPage: (value: number) => void;
  setSize: (value: string) => void;
}

export default function SanctionList({
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
            header: "Nama karyawan",
            accessor: (row) => (
              <span className="font-medium">{row.employee.fullname}</span>
            ),
          },
          {
            header: "Jenis sanksi",
            accessor: (row) => <span>{row.sanction.name}</span>,
          },
          {
            header: "Masa berlaku",
            accessor: (row) => (
              <div className="text-xs flex flex-col font-medium w-fit min-w-30">
                <span className="flex items-start gap-2 justify-start">
                  <CalendarDays size={14} />
                  {toIDDate(new Date(row.start_date))}
                </span>
                <span className="flex justify-center">-</span>
                <span className="flex items-start gap-2 justify-start">
                  <CalendarDays size={14} />
                  {toIDDate(new Date(row.end_date))}
                </span>
              </div>
            ),
          },
          {
            header: "Action",
            accessor: () => (
              <div className="flex items-center justify-end gap-2">
                <Button variant="link" asChild>
                  <Link to="/employees/edit">Detail</Link>
                </Button>

                <Button variant="link" className="text-destructive! " asChild>
                  <Link to="/employees/edit">Delete</Link>
                </Button>
              </div>
            ),
            className: "text-right",
          },
        ]}
      />
      <div className="flex justify-between items-center mt-5">
        <p className="font-bold text-xs">
          Menampilkan {data?.data.length} dari {data?.paging.total_item} total
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
