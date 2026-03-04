/* eslint-disable @typescript-eslint/no-explicit-any */
import LocationPicker from "@/components/fragment/location-picker";
import MapView from "@/components/fragment/map-viewer";
import { Button } from "@/components/ui/button";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOfficeLocation } from "@/hooks/feature/use-office-location";
import { CreateOfficeLocationSchema } from "@/lib/model/office-location.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useLocalStorage } from "react-use";
import type z from "zod";

export default function LocationCreate() {
  const [token] = useLocalStorage("token", "");

  const [radius, setRadius] = useState<number>(100);
  const [location, setLocation] = useState<any>(null);

  const form = useForm<z.infer<typeof CreateOfficeLocationSchema>>({
    resolver: zodResolver(CreateOfficeLocationSchema),
    defaultValues: {
      name: "",
      address: "",
      lat: "",
      lng: "",
      radius: 50,
    },
  });

  // Get current location
  useEffect(() => {
    if (!form) return;
    form.setValue("address", location?.display_name);
    form.setValue("lat", location?.lat.toString());
    form.setValue("lng", location?.lng.toString());
  }, [location]);

  const mutation = useCreateOfficeLocation(token);

  function handleSubmit(values: z.infer<typeof CreateOfficeLocationSchema>) {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusSquare />
          Tambah Lokasi Kantor
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`${form.watch("lat") && form.watch("lng") ? "sm:max-w-210" : ""} `}
      >
        <DialogHeader>
          <DialogTitle>Tambah Lokasi Kantor</DialogTitle>

          <>
            <div
              className={`grid  ${form.watch("lat") && form.watch("lng") ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-6`}
            >
              {/* Form Section */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lokasi Kehadiran</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan nama lokasi"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <LocationPicker value={location} onChange={setLocation} />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Masukkan alamat" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Garis Lintang</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            step="any"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(",", "."))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lng"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Garis Bujur</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            step="any"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(",", "."))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="radius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Radius</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            const intVal = parseInt(val, 10);
                            field.onChange(intVal);
                            setRadius(intVal);
                          }}
                          value={field.value?.toString()} // sinkron dengan SelectItem
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jangkauan radius (m)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="50">50 m</SelectItem>
                            <SelectItem value="100">100 m</SelectItem>
                            <SelectItem value="200">200 m</SelectItem>
                            <SelectItem value="500">500 m</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-start gap-2">
                    <Button type="button" variant="destructive" asChild>
                      <Link to="/attendancespots">Batal</Link>
                    </Button>
                    {mutation.isPending ? (
                      <Button type="button" disabled>
                        <Loader2Icon className="animate-spin" />
                        Save
                      </Button>
                    ) : (
                      <Button type="submit">Save</Button>
                    )}
                  </div>
                </form>
              </Form>
              <div>
                {form.watch("lat") && form.watch("lng") && (
                  <MapView
                    lat={parseFloat(form.watch("lat")) ?? 0}
                    lng={parseFloat(form.watch("lng")) ?? 0}
                    radius={radius}
                    height="h-full"
                    zoom={16}
                    popupText={form.watch("address") ?? ""}
                  />
                )}
              </div>
            </div>
          </>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
