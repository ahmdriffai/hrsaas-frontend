import SearchForm from "@/components/fragment/search-form/search-form";
import Title from "@/components/layout/Title";
import LocationCreate from "@/feature/office-location/LocationCreate";
import LocationList from "@/feature/office-location/LocationList";
import { useGetOfficeLocation } from "@/hooks/feature/use-office-location";
import { useDocumentTitle } from "@/hooks/user-titledoc";
import type { SearchOfficeLocationRequest } from "@/lib/model/office-location.model";
import type React from "react";
import { useState } from "react";
import { useLocalStorage } from "react-use";

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
      <Title title="Pengaturan lokasi kantor" />
      <div className="mb-5">
        <div className="mb-4 flex gap-4">
          <LocationCreate />
        </div>
        <SearchForm onSearch={handleSearch} searchKey={key} setKey={setKey} />
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
