import Button from "@/components/fragment/button/button";
import Table from "@/components/fragment/table/table";
import { OwnPagination } from "@/components/ui/custom/ownpagination";
import { PageSelector } from "@/components/ui/custom/page-selector";
import type { Shift } from "@/lib/model/shift.model";
import type { PaginatedData } from "@/lib/types/types";
import { Link } from "react-router";

interface Props {
  data: PaginatedData<Shift> | undefined;
  page: number;
  size: string;
  setPage: (value: number) => void;
  setSize: (value: string) => void;
}

export default function ShiftList({
  data,
  page,
  size,
  setPage,
  setSize,
}: Props) {
  return (
    <div className="mt-5">
      <Table
        data={data?.data || []}
        keyExtractor={(row) => row.id}
        columns={[
          {
            header: "Name",
            accessor: "name",
          },
          {
            header: "Toleransi keterlambatan",
            accessor: (row) => <p>{row.late_tolerance} menit</p>,
          },
          {
            header: "Action",
            accessor: (row) => (
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" asChild>
                  <Link to={`/attendances/shifts/assign-employee/${row.id}`}>
                    Tugaskan
                  </Link>
                </Button>

                <Button variant="ghost" className="text-destructive! " asChild>
                  <Link to="/delete">Delete</Link>
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
