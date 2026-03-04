import { Card, CardContent } from "@/components/ui/card";
import { OwnPagination } from "@/components/ui/custom/ownpagination";
import { PageSelector } from "@/components/ui/custom/page-selector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OfficeLocation } from "@/lib/types/officelocation-type";
import type { PaginatedData } from "@/lib/types/types";
import type React from "react";

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
    <Card>
      <CardContent>
        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lokasi</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Radius (m)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data && data.data.length > 0 ? (
                data.data.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>{location.address}</TableCell>
                    <TableCell>{location.lat}</TableCell>
                    <TableCell>{location.lng}</TableCell>
                    <TableCell>{location.radius_meters}</TableCell>
                    <TableCell>
                      {location.is_active ? "Aktif" : "Nonaktif"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs font-bold">
            Menampilkan {data?.data.length ?? 0} dari {data?.paging.total_item ?? 0} total
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
      </CardContent>
    </Card>
  );
}
