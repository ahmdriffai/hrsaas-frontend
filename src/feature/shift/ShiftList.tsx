import { Card, CardContent } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Shift } from "@/lib/model/shift.model";
import type { PaginatedData } from "@/lib/types/types";

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
  const shifts = data?.data ?? [];
  const totalItems = data?.paging.total_item ?? 0;

  return (
    <Card>
      <CardContent>
        <div className="rounded-md border mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Shift</TableHead>
                <TableHead>Toleransi (Menit)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.length ? (
                shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">{shift.name}</TableCell>
                    <TableCell>{shift.late_tolerance}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-5 gap-3 flex-wrap">
          <p className="font-bold text-xs">
            Menampilkan {data?.data?.length ?? 0} dari {totalItems} total data.
          </p>

          <div className="flex items-center gap-2">
            <Select
              onValueChange={(value) => {
                setSize(value);
                setPage(1);
              }}
              value={size}
            >
              <SelectTrigger className="w-fit text-xs p-1 ps-2">
                <SelectValue placeholder="Pilih ukuran" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Total</SelectLabel>
                  {[1, 5, 10, 50].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
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
      </CardContent>
    </Card>
  );
}
