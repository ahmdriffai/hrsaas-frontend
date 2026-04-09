/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/fragment/button/button";
import Input from "@/components/fragment/input/input";
import InputTime from "@/components/fragment/input/input-time";
import Select from "@/components/fragment/select/select";
import Table from "@/components/fragment/table/table";
import Title from "@/components/layout/Title";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { useCreateShift } from "@/hooks/feature/use-shift";
import { CreateShiftSchema } from "@/lib/model/shift.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useLocalStorage } from "react-use";
import type z from "zod";

export default function ShiftCreatePage(): React.ReactNode {
  const [token] = useLocalStorage("token", "");
  const form = useForm<z.infer<typeof CreateShiftSchema>>({
    resolver: zodResolver(CreateShiftSchema),
    defaultValues: {
      name: "",
      late_tolerance: 0,
      shift_days: [
        {
          weekday: 1,
          day_type: "offday",
          check_in: undefined,
          check_out: undefined,
          break_start: undefined,
          break_end: undefined,
          max_break_minutes: 0,
        },
        {
          weekday: 2,
          day_type: "offday",
          check_in: undefined,
          check_out: undefined,
          break_start: undefined,
          break_end: undefined,
          max_break_minutes: 0,
        },
        {
          weekday: 3,
          day_type: "offday",
          check_in: undefined,
          check_out: undefined,
          break_start: undefined,
          break_end: undefined,
          max_break_minutes: 0,
        },
        {
          weekday: 4,
          day_type: "offday",
          check_in: undefined,
          check_out: undefined,
          break_start: undefined,
          break_end: undefined,
          max_break_minutes: 0,
        },
        {
          weekday: 5,
          day_type: "offday",
          check_in: undefined,
          check_out: undefined,
          break_start: undefined,
          break_end: undefined,
          max_break_minutes: 0,
        },
        {
          weekday: 6,
          day_type: "offday",
          check_in: undefined,
          check_out: undefined,
          break_start: undefined,
          break_end: undefined,
          max_break_minutes: 0,
        },
        {
          weekday: 7,
          day_type: "offday",
          check_in: undefined,
          check_out: undefined,
          break_start: undefined,
          break_end: undefined,
          max_break_minutes: 0,
        },
      ],
    },
  });

  const mutation = useCreateShift(token);

  function handleSubmit(values: z.infer<typeof CreateShiftSchema>) {
    const data = { ...values, late_tolerance: Number(values.late_tolerance) };
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  const updateShiftDay = (index: number, changes: any) => {
    const current = form.getValues("shift_days");

    const updated = current.map((item, i) =>
      i === index ? { ...item, ...changes } : item,
    );

    form.setValue("shift_days", updated);
  };

  return (
    <div>
      <Button asChild variant="third">
        <Link to="/attendances/shifts">
          <ArrowLeft />
        </Link>
      </Button>
      <Title title="Tambah shift" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-3 space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nama shift <span className="text-red-900">*</span>
                </FormLabel>
                <FormControl>
                  <Input label="Nama shift" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="late_tolerance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Toleransi kerterlambatan{" "}
                  <span className="text-red-900">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    label="Toleransi keterlambatan"
                    type="number"
                    value={field.value ?? 0}
                    onChange={(event) => field.onChange(Number(event))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Table
            data={form.watch("shift_days").map((item, index) => ({
              ...item,
              index,
            }))}
            columns={[
              {
                header: "Hari",
                accessor: "weekday",
              },
              {
                header: "Pola kerja",
                accessor: (row) => (
                  <div className="min-w-30">
                    <Select
                      label="Pola kerja"
                      options={[
                        { label: "Workday", value: "workday" },
                        { label: "Offday", value: "offday" },
                      ]}
                      value={row.day_type}
                      onChange={(value) => {
                        if (value === "offday") {
                          updateShiftDay(row.index, {
                            day_type: value,
                            check_in: undefined,
                            check_out: undefined,
                            break_start: undefined,
                            break_end: undefined,
                            max_break_minutes: 0,
                          });
                        } else if (value === "workday") {
                          updateShiftDay(row.index, {
                            day_type: value,
                            check_in: "00:00",
                            check_out: "00:00",
                            break_start: "00:00",
                            break_end: "00:00",
                            max_break_minutes: 0,
                          });
                        } else {
                          updateShiftDay(row.index, { day_type: value });
                        }
                      }}
                    />
                  </div>
                ),
              },
              {
                header: "Jam masuk",
                accessor: (row) => (
                  <div className="min-w-30">
                    <InputTime
                      disabled={row.day_type === "offday"}
                      label="Jam masuk"
                      value={row.check_in ?? ""}
                      onChange={(value) => {
                        if (value === "offday") {
                          updateShiftDay(row.index, {
                            day_type: value,
                            check_in: undefined,
                            check_out: undefined,
                            break_start: undefined,
                            break_end: undefined,
                            max_break_minutes: 0,
                          });
                        } else {
                          updateShiftDay(row.index, { check_in: value });
                        }
                      }}
                    />
                  </div>
                ),
              },
              {
                header: "Jam keluar",
                accessor: (row) => (
                  <div className="min-w-30">
                    <InputTime
                      disabled={row.day_type === "offday"}
                      label="Jam Keluar"
                      value={row.check_out ?? ""}
                      onChange={(value) => {
                        const current = form.getValues("shift_days");

                        const updated = current.map((item, i) =>
                          i === row.index
                            ? { ...item, check_out: value }
                            : item,
                        );

                        form.setValue("shift_days", updated);
                      }}
                    />
                  </div>
                ),
              },
              {
                header: "Mulai istirahat",
                accessor: (row) => (
                  <div className="min-w-30">
                    <InputTime
                      disabled={row.day_type === "offday"}
                      label="Mulai istirahat"
                      value={row.break_start ?? ""}
                      onChange={(value) => {
                        const current = form.getValues("shift_days");

                        const updated = current.map((item, i) =>
                          i === row.index
                            ? { ...item, break_start: value }
                            : item,
                        );

                        form.setValue("shift_days", updated);
                      }}
                    />
                  </div>
                ),
              },
              {
                header: "Selasai istirahat",
                accessor: (row) => (
                  <div className="min-w-30">
                    <InputTime
                      disabled={row.day_type === "offday"}
                      label="Selasai istirahat"
                      value={row.break_end ?? ""}
                      onChange={(value) => {
                        const current = form.getValues("shift_days");
                        current[row.index].break_end = value;

                        form.setValue("shift_days", current);
                      }}
                    />
                  </div>
                ),
              },
              {
                header: "Maks. Istirahat",
                accessor: (row) => (
                  <div className="min-w-30">
                    <Input
                      disabled={row.day_type === "offday"}
                      label="Maks istirahat"
                      value={row.max_break_minutes}
                      onChange={(value) => {
                        const current = form.getValues("shift_days");
                        current[row.index].max_break_minutes = Number(value);

                        form.setValue("shift_days", current);
                      }}
                    />
                  </div>
                ),
              },
            ]}
          />

          <div className="flex justify-end px-6 py-5">
            {mutation.isPending ? (
              <Button disabled size="sm">
                <Spinner />
                Loading...
              </Button>
            ) : (
              <Button type="submit">Simpan</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
