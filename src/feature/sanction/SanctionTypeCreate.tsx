import Button from "@/components/fragment/button/button";
import Input from "@/components/fragment/input/input";
import Select from "@/components/fragment/select/select";
import Textarea from "@/components/fragment/textarea/text-area";
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

import { Spinner } from "@/components/ui/spinner";

import { sanctionTypeCreate } from "@/lib/api/sanction.api";
import { CreateSanctionTypeSchema } from "@/lib/model/sanction.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";
import type z from "zod";

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
        <Button variant="secondary">Tambah jenis peringatan</Button>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nama Sanksi <span className="text-red-900">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input label="Nama tipe sanksi" type="text" {...field} />
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
                        label="Level pelanggaran"
                        options={[
                          { label: "ringan", value: "Ringan" },
                          { label: "sedang", value: "Sedang" },
                          { label: "berat", value: "Berat" },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                      />
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
