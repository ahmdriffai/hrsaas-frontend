import Button from "@/components/fragment/button/button";
import Input from "@/components/fragment/input/input";
import InputDate from "@/components/fragment/input/input-date";
import Select from "@/components/fragment/select/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Spinner } from "@/components/ui/spinner";
import { employeeCreate } from "@/lib/api/employee.api";
import { blood_type, maritalStatus, religion } from "@/lib/data";
import { CreateEmployeeScheme } from "@/lib/model/employee.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";
import z from "zod";

export default function EmployeeCreate(): React.ReactNode {
  const [token] = useLocalStorage("token", "");
  const queryClient = useQueryClient();
  const [dateSelected, setDateSelected] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof CreateEmployeeScheme>>({
    resolver: zodResolver(CreateEmployeeScheme),
    defaultValues: {
      employee_number: "",
      fullname: "",
      email: "",
      password: "",
      birth_place: "",
      birth_date: "",
      blood_type: "",
      marital_status: "",
      phone: "",
      religion: "",
      timezone: "WIB",
    },
  });

  useEffect(() => {
    if (dateSelected) {
      form.setValue("birth_date", dateSelected.toISOString().split("T")[0]);
    }
  }, [dateSelected, form]);

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof CreateEmployeeScheme>) =>
      employeeCreate(token ?? "", data),
    onSuccess: async (response) => {
      const responseBody = await response.json();
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      if (response.status === 200) {
        toast.success("Employee created successfully");
        form.reset();
        navigate("/employees");
      } else {
        await toast.error(responseBody.error);
      }
    },
    onError: async (error) => {
      toast.error(error?.message || "Login failed");
    },
  });

  async function handleSubmit(values: z.infer<typeof CreateEmployeeScheme>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-3 space-y-6"
      >
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nama Lengkap <span className="text-red-900">*</span>
              </FormLabel>
              <FormControl>
                <Input label="Nama Lengkap" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employee_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomer Induk Karyawan</FormLabel>
              <FormControl>
                <Input label="Nomer Induk Karyawan" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input label="Email" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input label="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="birth_place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat Lahir</FormLabel>
                <FormControl>
                  <Input label="Tempat Lahir" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birth_date"
            render={() => (
              <FormItem>
                <FormLabel>Tanggal Lahir</FormLabel>
                <FormControl>
                  <InputDate
                    value={dateSelected}
                    onChange={(e) => setDateSelected(e)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="blood_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Golongan Darah</FormLabel>
                <FormControl>
                  <Select
                    label="Golongan Darah"
                    options={blood_type}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marital_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Pernikahan</FormLabel>
                <FormControl>
                  <Select
                    label="Status Pernikahan"
                    options={maritalStatus}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomer Telepopn</FormLabel>
                <FormControl>
                  <Input label="Nomer Telepon" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agama</FormLabel>
                <FormControl>
                  <Select
                    label="Agama"
                    options={religion}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end w-full">
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
  );
}
