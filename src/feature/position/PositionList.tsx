import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OwnPagination } from "@/components/ui/custom/ownpagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { Position } from "@/lib/types/position.type";
import type { PaginatedData } from "@/lib/types/types";
import { getLevel } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

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
    <Card>
      <CardContent>
        <div className="rounded-md border mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jabatan</TableHead>

                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data ? (
                data?.data.map((position) => {
                  const level = getLevel(position);
                  return (
                    <TableRow>
                      <TableCell className="font-medium">
                        <span className="mr-2 text-gray-400">
                          {"→ ".repeat(level)}
                        </span>
                        <span className="font-medium">{position.name}</span>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(position.id)
                              }
                            >
                              Copy payment ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View customer</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
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
        <div className="flex justify-between items-center mt-5">
          <p className="font-bold text-xs">
            Menampilkan {data?.data?.length} dari {data?.paging.total_item}{" "}
            total data.
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
      </CardContent>
    </Card>
  );
}
