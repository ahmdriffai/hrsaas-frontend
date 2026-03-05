/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useCreateShift } from "@/hooks/feature/use-shift";
import type { CreateShiftSchema } from "@/lib/model/shift.model";

import { Controller, useForm } from "react-hook-form";
import { useLocalStorage } from "react-use";
import type z from "zod";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const normalizeTime = (time: string) => {
  if (!time) return "";
  return time.length === 5 ? `${time}:00` : time;
};

export default function ShiftCreate() {
  const [token] = useLocalStorage("token", "");

  const form = useForm<z.infer<typeof CreateShiftSchema>>({
    defaultValues: {
      name: "",
      late_tolerance: 0,
      shift_days: days.map((_, index) => ({
        weekday: index + 1,
        day_type: "workday",
        check_in: "",
        check_out: "",
        break_start: "",
        break_end: "",
        max_break_minutes: 60,
      })),
    },
  });

  const mutation = useCreateShift(token ?? "");

  const onSubmit = async (values: z.infer<typeof CreateShiftSchema>) => {
    const request: z.infer<typeof CreateShiftSchema> = {
      name: values.name,
      late_tolerance: Number(values.late_tolerance),
      shift_days: values.shift_days.map((day) => ({
        ...day,
        max_break_minutes: Number(day.max_break_minutes ?? 0),
        check_in: normalizeTime(day.check_in ?? ""),
        check_out: normalizeTime(day.check_out ?? ""),
        break_start: normalizeTime(day.break_start ?? ""),
        break_end: normalizeTime(day.break_end ?? ""),
      })),
    };

    mutation.mutate(request, {
      onSuccess: (response) => {
        if (response.status === 200) {
          form.reset();
        }
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Buat Pola Kerja</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-210 sm:h-[90vh] my-2">
        <DialogHeader>
          <DialogTitle>Buat Pola Kerja</DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[90vh] overflow-y-auto overflow-x-auto px-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama Pola */}
            <div className="grid gap-2">
              <Label>Nama Pola Kerja *</Label>
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => <Input {...field} />}
              />
            </div>

            {/* Toleransi */}
            <div className="grid gap-2">
              <Label>Toleransi Keterlambatan (Menit)</Label>
              <Controller
                name="late_tolerance"
                control={form.control}
                render={({ field }) => <Input type="number" {...field} />}
              />
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Hari</th>
                    <th className="p-2">Pola Kerja</th>
                    <th className="p-2">Jam Masuk</th>
                    <th className="p-2">Jam Keluar</th>
                    <th className="p-2">Mulai Istirahat</th>
                    <th className="p-2">Selesai Istirahat</th>
                    <th className="p-2">Maks. Menit Istirahat</th>
                  </tr>
                </thead>

                <tbody>
                  {days.map((day, index) => {
                    const isOffday = form.watch(`shift_days.${index}.day_type`) === "offday";

                    return (
                      <tr key={day} className="border-t">
                        <td className="p-2">{day}</td>

                        {/* Pola Kerja */}
                        <td className="p-2">
                          <Controller
                            name={`shift_days.${index}.day_type`}
                            control={form.control}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="workday">
                                    Hari Kerja
                                  </SelectItem>
                                  <SelectItem value="offday">Libur</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </td>

                        {/* Jam fields */}
                        {[
                          "check_in",
                          "check_out",
                          "break_start",
                          "break_end",
                        ].map((fieldName) => (
                          <td key={fieldName} className="p-2">
                            <Controller
                              name={`shift_days.${index}.${fieldName}` as any}
                              control={form.control}
                              render={({ field }) => (
                                <Input type="time" {...field} disabled={isOffday} />
                              )}
                            />
                          </td>
                        ))}

                        {/* Max Break */}
                        <td className="p-2">
                          <Controller
                            name={`shift_days.${index}.max_break_minutes`}
                            control={form.control}
                            render={({ field }) => (
                              <Input type="number" {...field} disabled={isOffday} />
                            )}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <DialogFooter>
              {mutation.isPending ? (
                <Button disabled size="sm">
                  <Spinner />
                  Loading...
                </Button>
              ) : (
                <Button type="submit">Simpan</Button>
              )}
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
