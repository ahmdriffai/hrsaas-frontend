import Table from "@/components/fragment/table/table";
import { OwnPagination } from "@/components/ui/custom/ownpagination";
import { PageSelector } from "@/components/ui/custom/page-selector";
import type { Employee } from "@/lib/model/employee.model";
import type { PaginatedData } from "@/lib/types/types";
import type React from "react";

interface Props {
  data: PaginatedData<Employee> | undefined;
  page: number;
  size: string;
  setPage: (value: number) => void;
  setSize: (value: string) => void;
}

export default function EmployeeList({
  data,
  page,
  size,
  setPage,
  setSize,
}: Props): React.ReactNode {
  return (
    <div>
      <Table
        data={data?.data || []}
        keyExtractor={(row) => row.id}
        columns={[
          {
            header: "Name",
            accessor: (row) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gray-200 flex justify-center items-center">
                  {row.fullname.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{row.fullname}</span>
              </div>
            ),
          },
          {
            header: "Nomer Induk",
            accessor: "employee_number",
          },
          {
            header: "Tempat Lahir",
            accessor: "birth_place",
          },
          {
            header: "Tanggal Lahir",
            accessor: (row) => new Date(row.birth_date).toDateString(),
          },
          {
            header: "Status",
            accessor: "marital_status",
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
          Menampilkan {data?.data.length} dari {data?.paging.total_item} total
          data.
        </p>
        {data && (
          <div className="flex items-center justify-center gap-x-1">
            <PageSelector
              onValueChange={(value) => {
                setSize(value);
                setPage(1);
              }}
              value={size}
            />
            <OwnPagination
              currentPage={page}
              paging={data.paging}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
