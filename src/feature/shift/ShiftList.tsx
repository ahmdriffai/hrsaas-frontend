import Title from "@/components/layout/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useGetShift } from "@/hooks/feature/use-shift";
import type { SearchShiftRequest } from "@/lib/model/shift.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";
import ShiftCreate from "./ShiftCreate";

type ShiftDay = {
  weekday: number;
  day_type: string;
  check_in?: string;
  check_out?: string;
};

type ShiftWithDays = {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  late_tolerance: number;
  status?: "Aktif" | "Nonaktif";
  shift_days?: ShiftDay[];
};

const BASE_URL = import.meta.env.VITE_API_PATH;
const WEEKDAY_LABEL: Record<number, string> = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
  7: "Minggu",
};

export default function ShiftList() {
  const [token] = useLocalStorage("token", "");
  const [key, setKey] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const search: SearchShiftRequest = {
    key: searchKey,
    page,
    size: Number(size),
  };

  const { data } = useGetShift(token ?? "", search);
  const shifts = (data?.data ?? []) as ShiftWithDays[];
  const selectedShift = shifts.find((shift) => shift.id === selectedShiftId);

  const refreshShifts = async () => {
    await queryClient.invalidateQueries({ queryKey: ["shifts"] });
  };

  const updateShiftMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      name: string;
      late_tolerance: number;
    }) => {
      const response = await fetch(`${BASE_URL}/shifts/${payload.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + (token ?? ""),
        },
        body: JSON.stringify({
          name: payload.name,
          late_tolerance: payload.late_tolerance,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || "Failed to update shift");
      }

      return response;
    },
    onSuccess: async () => {
      toast.success("Shift updated successfully");
      await refreshShifts();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update shift");
    },
  });

  const deleteShiftMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/shifts/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + (token ?? ""),
        },
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || "Failed to delete shift");
      }

      return response;
    },
    onSuccess: async () => {
      toast.success("Shift deleted successfully");
      setSelectedShiftId(null);
      await refreshShifts();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete shift");
    },
  });

  const deleteShiftDayMutation = useMutation({
    mutationFn: async (payload: { shiftId: string; weekday: number }) => {
      const response = await fetch(
        `${BASE_URL}/shifts/${payload.shiftId}/days/${payload.weekday}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + (token ?? ""),
          },
        },
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || "Failed to delete shift day");
      }

      return response;
    },
    onSuccess: async () => {
      toast.success("Shift day deleted successfully");
      await refreshShifts();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete shift day");
    },
  });

  const currentPage = data?.paging.page ?? 1;
  const totalPages = data?.paging.total_page ?? 1;
  const totalItems = data?.paging.total_item ?? 0;

  const formatTime = (value: string) => {
    if (!value) return "-";
    if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchKey(key);
    setPage(1);
  }

  function handleUpdateShift(shift: {
    id: string;
    name: string;
    late_tolerance: number;
  }) {
    const nextName = window.prompt("Nama shift", shift.name ?? "");
    if (nextName === null) return;

    const nextToleranceRaw = window.prompt(
      "Toleransi keterlambatan (menit)",
      String(shift.late_tolerance ?? 0),
    );
    if (nextToleranceRaw === null) return;

    const nextTolerance = Number(nextToleranceRaw);
    if (Number.isNaN(nextTolerance) || nextTolerance < 0) {
      toast.error("Toleransi harus berupa angka >= 0");
      return;
    }

    updateShiftMutation.mutate({
      id: shift.id,
      name: nextName.trim() || shift.name,
      late_tolerance: nextTolerance,
    });
  }

  function handleDeleteShift(id: string) {
    const isConfirmed = window.confirm("Hapus shift ini?");
    if (!isConfirmed) return;
    deleteShiftMutation.mutate(id);
  }

  function handleDeleteShiftDay(shiftId: string, weekday: number) {
    const dayLabel = WEEKDAY_LABEL[weekday] ?? `Hari ${weekday}`;
    const isConfirmed = window.confirm(`Hapus shift day ${dayLabel}?`);
    if (!isConfirmed) return;
    deleteShiftDayMutation.mutate({ shiftId, weekday });
  }

  return (
    <div>
      <Title title="Data Shift" />

      <Card className="mb-5">
        <CardContent>
          <div className="mb-4 flex gap-4">
            <ShiftCreate />
          </div>
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-4 md:grid-cols-4"
          >
            <div className="space-y-1">
              <Input
                id="shift-search"
                placeholder="Cari shift ..."
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
                  <TableHead>Nama Shift</TableHead>
                  <TableHead>Toleransi (Menit)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.length ? (
                  shifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell className="font-medium">
                        {shift.name}
                      </TableCell>
                      <TableCell>{shift.late_tolerance}</TableCell>
                      <TableCell>{shift.status ?? "Aktif"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={
                              selectedShiftId === shift.id
                                ? "default"
                                : "outline"
                            }
                            onClick={() => setSelectedShiftId(shift.id)}
                          >
                            Detail
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={updateShiftMutation.isPending}
                            onClick={() =>
                              handleUpdateShift({
                                id: shift.id,
                                name: shift.name,
                                late_tolerance: shift.late_tolerance,
                              })
                            }
                          >
                            Update
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={deleteShiftMutation.isPending}
                            onClick={() => handleDeleteShift(shift.id)}
                          >
                            Delete
                          </Button>
                        </div>
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

          <div className="flex justify-between items-center mt-5 gap-3 flex-wrap">
            <p className="font-bold text-xs">
              Menampilkan {data?.data?.length ?? 0} dari {totalItems} total
              data.
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

              <Button
                type="button"
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </Button>
              <p className="text-xs min-w-20 text-center">
                {currentPage} / {totalPages}
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedShift && (
        <Card className="mt-5">
          <CardContent>
            <h3 className="text-sm font-semibold mt-6 mb-3">
              Detail Shift: {selectedShift.name}
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hari</TableHead>
                    <TableHead>Tipe Hari</TableHead>
                    <TableHead>Jam Masuk</TableHead>
                    <TableHead>Jam Pulang</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(selectedShift.shift_days ?? []).length ? (
                    [...(selectedShift.shift_days ?? [])]
                      .sort((a, b) => a.weekday - b.weekday)
                      .map((day) => (
                        <TableRow key={`${selectedShift.id}-${day.weekday}`}>
                          <TableCell>
                            {WEEKDAY_LABEL[day.weekday] ?? "-"}
                          </TableCell>
                          <TableCell>{day.day_type}</TableCell>
                          <TableCell>
                            {formatTime(day.check_in ?? "")}
                          </TableCell>
                          <TableCell>
                            {formatTime(day.check_out ?? "")}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              disabled={deleteShiftDayMutation.isPending}
                              onClick={() =>
                                handleDeleteShiftDay(
                                  selectedShift.id,
                                  day.weekday,
                                )
                              }
                            >
                              Delete Day
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Detail shift belum tersedia
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
