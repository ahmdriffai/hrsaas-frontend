import {
  useCreatePosition,
  useGetPosition,
} from "@/hooks/feature/use-position";
import { CreatePositionSchema } from "@/lib/model/position.model";
import { getLevel } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "react-use";
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

export default function PositionCreate() {
  const [token] = useLocalStorage("token", "");
  const { data: positions } = useGetPosition(token, { size: 100 });

  const form = useForm<z.infer<typeof CreatePositionSchema>>({
    resolver: zodResolver(CreatePositionSchema),
    defaultValues: {
      name: "",
      parent_id: null,
    },
  });

  const mutation = useCreatePosition(token);

  async function handleSubmit(values: z.infer<typeof CreatePositionSchema>) {
    mutation.mutate(values);
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusSquare />
          Tambah Jabatan
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
                      Nama Jabatan <span className="text-red-900">*</span>
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
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Induk</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(value) =>
                          field.onChange(value === "" ? null : value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a parent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Induk </SelectLabel>

                            {positions?.data.map((position, index) => {
                              const level = getLevel(position);
                              return (
                                <SelectItem key={index} value={position.id}>
                                  <span className="mr-2 text-gray-400">
                                    {"→ ".repeat(level)}
                                  </span>
                                  <span className="font-medium">
                                    {position.name}
                                  </span>
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
