import Button from "@/components/fragment/button/button";
import Table from "@/components/fragment/table/table";
import { OwnPagination } from "@/components/ui/custom/ownpagination";
import { PageSelector } from "@/components/ui/custom/page-selector";
import type { Employee } from "@/lib/model/employee.model";
import type { PaginatedData } from "@/lib/types/types";
import { BadgeCheck, FileText } from "lucide-react";
import type React from "react";
import { Link } from "react-router";

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
              <div className="flex items-center justify-start gap-3 min-w-50">
                <div className="h-9 w-9 rounded-full bg-gray-200 flex justify-center items-center">
                  {row.fullname.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium ">{row.fullname}</span>
                <span>
                  <BadgeCheck size={15} color="green" />
                </span>
              </div>
            ),
          },
          {
            header: "Identitas",
            accessor: "employee_number",
          },

          {
            header: "Dokumen",
            accessor: () => (
              <Button variant="ghost">
                <Link to="/employee/files">
                  <FileText strokeWidth={1.25} size={20} />
                </Link>
              </Button>
            ),
          },

          {
            header: "Action",
            accessor: () => (
              <div className="flex items-center gap-2">
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
      {data && (
        <div className="flex flex-col w-full gap-5 justify-cente items-end mt-5">
          <div className="flex w-full items-center justify-between gap-x-1">
            <p className="font-bold text-xs">
              Menampilkan {data?.data.length} dari {data?.paging.total_item}{" "}
              total data.
            </p>
            <PageSelector
              onValueChange={(value) => {
                setSize(value);
                setPage(1);
              }}
              value={size}
            />
          </div>
          <OwnPagination
            currentPage={page}
            paging={data.paging}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
