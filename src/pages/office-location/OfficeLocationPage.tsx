import Title from "@/components/layout/Title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LocationCreate from "@/feature/office-location/LocationCreate";
import LocationList from "@/feature/office-location/LocationList";
import { useGetOfficeLocation } from "@/hooks/feature/use-office-location";
import { useDocumentTitle } from "@/hooks/user-titledoc";
import type { SearchOfficeLocationRequest } from "@/lib/model/office-location.model";
import { Search } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useLocalStorage } from "react-use";

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Lokasi Kantor", href: "/office-locations" },
];

export default function OfficeLocationPage(): React.ReactNode {
  useDocumentTitle("Daftar Lokasi Kantor");
  const [token] = useLocalStorage("token", "");
  const [key, setKey] = useState<string>("");
  const [searchKey, setSearchKey] = useState<string>("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");

  const search: SearchOfficeLocationRequest = {
    key: searchKey,
    page,
    size: Number(size),
  };

  const { data } = useGetOfficeLocation(token ?? "", search);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchKey(key);
    setPage(1);
  }

  return (
    <div>
      <Title title="Data Lokasi Kantor" breadcrumbs={breadcrumbs} />
      <div className="mb-5 rounded-lg border bg-card p-4">
        <div className="mb-4 flex gap-4">
          <LocationCreate />
        </div>

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <Input
            id="office-location-search"
            placeholder="Cari lokasi kantor ..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />

          <div className="flex items-end gap-2">
            <Button type="submit" className="gap-2">
              <Search size={16} />
              Cari
            </Button>
          </div>
        </form>
      </div>

      <LocationList
        data={data}
        page={page}
        size={size}
        setPage={setPage}
        setSize={setSize}
      />
    </div>
  );
}
