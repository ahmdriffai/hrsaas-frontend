import Button from "@/components/fragment/button/button";
import Input from "@/components/fragment/input/input";
import type { Option } from "@/components/fragment/select/select";
import Select from "@/components/fragment/select/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form, FormField, FormMessage } from "@/components/ui/form";

import { Spinner } from "@/components/ui/spinner";
import {
  useCreatePosition,
  useGetPosition,
} from "@/hooks/feature/use-position";
import { CreatePositionSchema } from "@/lib/model/position.model";
import { getLevel } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "react-use";
import type z from "zod";

interface Props {
  parentId?: string | null;
}

export default function PositionCreate({ parentId }: Props) {
  console.log("PositionCreate rendered with parentId:", parentId);
  const [token] = useLocalStorage("token", "");
  const { data: positions } = useGetPosition(token, { size: 100 });

  const options: Option[] =
    positions?.data?.map((position) => {
      const level = getLevel(position);

      return {
        value: position.id,
        label: `${"→ ".repeat(level)} ${position.name}`,
      };
    }) ?? [];

  const form = useForm<z.infer<typeof CreatePositionSchema>>({
    resolver: zodResolver(CreatePositionSchema),
    defaultValues: {
      name: "",
      parent_id: parentId ?? null,
    },
  });

  const mutation = useCreatePosition(token);

  async function handleSubmit(values: z.infer<typeof CreatePositionSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {parentId ? (
          <div className="p-0 absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-primary rounded-full border border-white shadow-sm hover:bg-primary/80 cursor-pointer">
            <Plus className="w-4 h-4 text-white" />
          </div>
        ) : (
          <Button variant="secondary" className="gap-2">
            Tambah Jabatan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Jabatan</DialogTitle>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mt-3 space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>
                      Nama Jabatan <span className="text-red-900">*</span>
                    </FieldLabel>
                    <Input label="Jabatan" type="text" {...field} />
                  </Field>
                )}
              />

              {!parentId && (
                <FormField
                  control={form.control}
                  name="parent_id"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Induk</FieldLabel>
                      <Select
                        options={options}
                        label="Induk"
                        value={field.value || ""}
                        onChange={(val) => field.onChange(val)}
                      />
                      <FormMessage />
                    </Field>
                  )}
                />
              )}

              <div className="flex justify-end w-full">
                {mutation.isPending ? (
                  <Button variant="secondary" disabled>
                    <Spinner />
                    Loading...
                  </Button>
                ) : (
                  <Button variant="secondary" type="submit">
                    Simpan
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
