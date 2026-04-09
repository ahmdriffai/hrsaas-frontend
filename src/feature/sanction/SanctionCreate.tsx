import Button from "@/components/fragment/button/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useGetEmployee } from "@/hooks/feature/use-employee";
import {
  useCreateSanction,
  useGetSanctionType,
} from "@/hooks/feature/use-sanction";
import { CreateSanctionSchema } from "@/lib/model/sanction.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "react-use";
import type z from "zod";

export default function SanctionCreate() {
  const [token] = useLocalStorage("token", "");
  const { data: employees } = useGetEmployee(token, { size: 100 });
  const { data: sanctionTypes } = useGetSanctionType(token, {
    size: 100,
  });

  const form = useForm<z.infer<typeof CreateSanctionSchema>>({
    resolver: zodResolver(CreateSanctionSchema),
    defaultValues: {
      employee_id: "",
      sanction_id: "",
      reason: "",
      start_date: "",
      end_date: "",
      document_url: "http://google.com",
    },
  });

  const mutation = useCreateSanction(token);

  async function handleSubmit(values: z.infer<typeof CreateSanctionSchema>) {
    mutation.mutate(values);
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Tambah pelanggaran</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah jenis peringatan</DialogTitle>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mt-3 space-y-6"
            >
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Karyawan</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a religion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Karyawan</SelectLabel>
                            {employees?.data.map((employee, index) => (
                              <SelectItem key={index} value={employee.id}>
                                {employee.fullname}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sanction_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Pelanggaran</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a religion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tipe Pelanggaran</SelectLabel>
                            {sanctionTypes?.data.map((sanction, index) => (
                              <SelectItem key={index} value={sanction.id}>
                                {sanction.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pelanggaran <span className="text-red-900">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Mulai</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Selssai</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
