import { sanctionTypeCreate } from "@/lib/api/sanction.api";
import { sanctionLevel } from "@/lib/data";
import { CreateSanctionTypeSchema } from "@/lib/model/sanction.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

export default function SanctionTypeCreate() {
  const [token] = useLocalStorage("token", "");
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof CreateSanctionTypeSchema>>({
    resolver: zodResolver(CreateSanctionTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      level: "",
      note: "-",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof CreateSanctionTypeSchema>) =>
      sanctionTypeCreate(token ?? "", data),
    onSuccess: async (response) => {
      const responseBody = await response.json();
      queryClient.invalidateQueries({ queryKey: ["sanction-types"] });
      if (response.status === 200) {
        toast.success("Sanction type created successfully");
        form.reset();
      } else {
        await toast.error(responseBody.error);
      }
    },
    onError: async (error) => {
      toast.error(error?.message || "Login failed");
    },
  });

  async function handleSubmit(
    values: z.infer<typeof CreateSanctionTypeSchema>,
  ) {
    mutation.mutate(values);
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusSquare />
          Jenis Sanksi / Peringatan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Jenis Peringatan</DialogTitle>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mt-3 space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nama Sanksi <span className="text-red-900">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a religion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Level Sanksi</SelectLabel>
                            {sanctionLevel.map((value, index) => (
                              <SelectItem key={index} value={value.toString()}>
                                {value === 1
                                  ? "Ringan"
                                  : value === 2
                                    ? "Sedang"
                                    : "Berat"}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Deskripsi <span className="text-red-900">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
