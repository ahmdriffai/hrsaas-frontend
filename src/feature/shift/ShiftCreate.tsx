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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shiftCreate } from "@/lib/api/shift.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

type FormValues = {
  name: string;
  tolerance: number;
  scheduleType: "fixed" | "flexible";
  schedules: {
    day: string;
    type: string;
    checkIn: string;
    checkOut: string;
    breakStart: string;
    breakEnd: string;
    maxBreak: number;
  }[];
};

export default function ShiftCreate() {
  const [token] = useLocalStorage("token", "");
  const queryClient = useQueryClient();

  const { control, handleSubmit, watch, setValue, reset } = useForm<FormValues>(
    {
    defaultValues: {
      name: "",
      tolerance: 0,
      scheduleType: "fixed",
      schedules: days.map((day) => ({
        day,
        type: "Hari Kerja",
        checkIn: "",
        checkOut: "",
        breakStart: "",
        breakEnd: "",
        maxBreak: 60,
      })),
    },
  });
  
  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      shiftCreate(token ?? "", {
        ...data,
        tolerance: Number(data.tolerance),
        schedules: data.schedules.map((schedule) => ({
          ...schedule,
          maxBreak: Number(schedule.maxBreak),
        })),
      }),
    onSuccess: async (response) => {
      const responseBody = await response.json();
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      if (response.status === 200) {
        toast.success("Shift created successfully");
        reset();
      } else {
        toast.error(responseBody?.error ?? "Failed to create shift");
      }
    },
    onError: async (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const scheduleType = watch("scheduleType");

  const onSubmit = async (data: FormValues) => {
    mutation.mutate(data);
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama Pola */}
            <div className="grid gap-2">
              <Label>Nama Pola Kerja *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </div>

            {/* Toleransi */}
            <div className="grid gap-2">
              <Label>Toleransi Keterlambatan (Menit)</Label>
              <Controller
                name="tolerance"
                control={control}
                render={({ field }) => <Input type="number" {...field} />}
              />
            </div>

            {/* Tabs */}
            <div>
              <Label>Jadwal Kerja *</Label>

              <Tabs
                value={scheduleType}
                onValueChange={(val) =>
                  setValue("scheduleType", val as "fixed" | "flexible")
                }
                className="mt-2"
              >
                <TabsList>
                  <TabsTrigger value="fixed">Jadwal Jam Tetap</TabsTrigger>
                  <TabsTrigger value="flexible">
                    Jadwal Jam Fleksibel
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <p className="text-sm text-red-500 mt-1">
                *Hanya bisa pilih salah satu jadwal
              </p>
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
                  {days.map((day, index) => (
                    <tr key={day} className="border-t">
                      <td className="p-2">{day}</td>

                      {/* Pola Kerja */}
                      <td className="p-2">
                        <Controller
                          name={`schedules.${index}.type`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Hari Kerja">
                                  Hari Kerja
                                </SelectItem>
                                <SelectItem value="Libur">Libur</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </td>

                      {/* Jam fields */}
                      {["checkIn", "checkOut", "breakStart", "breakEnd"].map(
                        (fieldName) => (
                          <td key={fieldName} className="p-2">
                            <Controller
                              name={`schedules.${index}.${fieldName}` as any}
                              control={control}
                              render={({ field }) => (
                                <Input type="time" {...field} />
                              )}
                            />
                          </td>
                        ),
                      )}

                      {/* Max Break */}
                      <td className="p-2">
                        <Controller
                          name={`schedules.${index}.maxBreak`}
                          control={control}
                          render={({ field }) => (
                            <Input type="number" {...field} />
                          )}
                        />
                      </td>
                    </tr>
                  ))}
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
