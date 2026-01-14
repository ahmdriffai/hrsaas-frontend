import { useDocumentTitle } from "@/hooks/user-titledoc";
import { sanctionTypeList } from "@/lib/api/sanction.api";
import type {
  SanctionType,
  SearchSanctionTypeReq,
} from "@/lib/model/sanction.model";
import type { Paging } from "@/lib/types/paging-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";
import Title from "../layout/Title";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { OwnPagination } from "../ui/custom/ownpagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import SanctionTypeCreate from "./SanctionTypeCreate";

export default function SanctionTypeList() {
  useDocumentTitle("Daftar Employee");

  const [key, setKey] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");
  const [searchKey, setSearchKey] = useState("");
  const [token] = useLocalStorage("token", "");
  const search: SearchSanctionTypeReq = {
    key: searchKey,
    page,
    size: Number(size),
  };

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchKey(key);
    setPage(1);
  }

  const { data, isError, error } = useQuery<{
    paging: Paging;
    data: SanctionType[];
  }>({
    queryKey: ["sanction-types", search],
    queryFn: async () => sanctionTypeList(token ?? "", search),
    enabled: !!token,
    placeholderData: keepPreviousData,
  });

  if (isError) {
    toast.error((error as Error).message);
  }
  return (
    <div>
      <Title title="Data Sanksi Karyawan" />
      <Card className="mb-5">
        <CardContent className="flex items-center gap-x-6">
          <SanctionTypeCreate />

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-4 items-center md:grid-cols-4"
          >
            <div className="space-y-1">
              <Input
                id="name"
                placeholder="Cari ..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="rounded-md border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Penyetuju</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((sanctionType) => (
                  <TableRow>
                    <TableCell className="font-medium">
                      {sanctionType.name}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{sanctionType.description}</TableCell>

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
                              navigator.clipboard.writeText(sanctionType.id)
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
              Menampilkan {data?.data.length} dari {data?.paging.total_item}{" "}
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
                    {[1, 5, 10, 50, 100].map((value, index) => (
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
    </div>
  );
}
