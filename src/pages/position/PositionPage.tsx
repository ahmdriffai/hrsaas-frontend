import Title from "@/components/layout/Title";
import PositionList from "@/feature/position/PositionList";
import PositionSearch from "@/feature/position/PositionSearch";
import { useGetPosition } from "@/hooks/feature/use-position";
import { useDocumentTitle } from "@/hooks/user-titledoc";
import type { SearchPositionRequest } from "@/lib/model/position.model";
import type React from "react";
import { useState } from "react";
import { useLocalStorage } from "react-use";

export default function PositionPage(): React.ReactNode {
  useDocumentTitle("Daftar Posisi Karyawan");
  const [token] = useLocalStorage("token", "");
  const [key, setKey] = useState<string>("");
  const [searchKey, setSearchKey] = useState<string>("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");
  const search: SearchPositionRequest = {
    name: searchKey,
    page,
    size: Number(size),
  };
  const { data } = useGetPosition(token, search);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchKey(key);
    setPage(1);
  }

  return (
    <div>
      <Title title="Data posisi paryawan" />
      <PositionSearch
        handleSearch={handleSearch}
        searchKey={key}
        setKey={setKey}
      />
      <PositionList
        data={data}
        page={page}
        size={size}
        setPage={setPage}
        setSize={setSize}
      />
    </div>
  );
}
