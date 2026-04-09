import Button from "@/components/fragment/button/button";
import Table from "@/components/fragment/table/table";
import { OwnPagination } from "@/components/ui/custom/ownpagination";
import { PageSelector } from "@/components/ui/custom/page-selector";
import type { OfficeLocation } from "@/lib/model/office-location.model";
import type { PaginatedData } from "@/lib/types/types";
import type React from "react";
import { Link } from "react-router";

interface Props {
  data: PaginatedData<OfficeLocation> | undefined;
  page: number;
  size: string;
  setPage: (value: number) => void;
  setSize: (value: string) => void;
}

export default function LocationList({
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
              <span className="font-semibold">{row.name}</span>
            ),
          },
          {
            header: "Alamat",
            accessor: (row) => (
              <span className="font-light text-xs">{row.address}</span>
            ),
          },
          {
            header: "Radius",
            accessor: (row) => <p>{row.radius_meters} m</p>,
          },
          {
            header: "Action",
            accessor: (row) => (
              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" size="sm" asChild>
                  <Link
                    to={`/attendances/office-locations/assign-employee/${row.id}`}
                  >
                    Tugaskan
                  </Link>
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
