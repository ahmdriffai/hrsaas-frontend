import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OwnPagination } from "@/components/ui/custom/ownpagination";
import { PageSelector } from "@/components/ui/custom/page-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Employee } from "@/lib/model/employee.model";
import type { PaginatedData } from "@/lib/types/types";
import { MoreHorizontal } from "lucide-react";
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
    <Card>
      <CardContent>
        <div className="rounded-md border mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Nomer Induk</TableHead>
                <TableHead>Tempat Lahir</TableHead>
                <TableHead>Tanggal Lahir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nomer Telepon</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.fullname}
                  </TableCell>
                  <TableCell>{employee.employee_number}</TableCell>
                  <TableCell>{employee.birth_place}</TableCell>
                  <TableCell>{employee.birth_date}</TableCell>
                  <TableCell>{employee.marital_status}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
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
                            navigator.clipboard.writeText(employee.id)
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
              ))}
            </TableBody>
          </Table>
        </div>
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
      </CardContent>
    </Card>
  );
}
