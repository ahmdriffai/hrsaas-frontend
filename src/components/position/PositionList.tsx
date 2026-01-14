import { useGetPosition } from "@/hooks/feature/use-position";
import type { SearchPositionRequest } from "@/lib/model/position.model";
import { getLevel } from "@/lib/utils";
import { Eye, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useLocalStorage } from "react-use";
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
import PositionCreate from "./PositionCreate";

const PositionList: React.FC = () => {
  const [token] = useLocalStorage("token", "");
  const [key, setKey] = useState("");
  const [size, setSize] = useState("10");
  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(1);
  const search: SearchPositionRequest = {
    name: searchKey,
    page,
    size: Number(size),
  };
  const { data } = useGetPosition(token, search);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchKey(key);
    setPage(1);
  }

  return (
    <div>
      <Title title="Data Sanksi Karyawan" />
      <Card className="mb-5">
        <CardContent>
          <div className="mb-4 flex gap-4">
            <PositionCreate />
            <Button asChild>
              <Link to="/positions/visual">
                <Eye />
                Lihat Visual
              </Link>
            </Button>
          </div>
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-4 md:grid-cols-4"
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
                  <TableHead>Jabatan</TableHead>

                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((position) => {
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
                })}
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
    </div>
  );
};

export default PositionList;
