import Title from "@/components/layout/Title";
import ShiftList from "@/feature/shift/ShiftList";
import ShiftSearch from "@/feature/shift/ShiftSearch";
import { useGetShift } from "@/hooks/feature/use-shift";
import type { SearchShiftRequest } from "@/lib/model/shift.model";
import { useState } from "react";
import { useLocalStorage } from "react-use";

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Manajemen Shift", href: "/shifts" },
];

export default function ShiftPage() {
  const [token] = useLocalStorage("token", "");
  const [key, setKey] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");

  const search: SearchShiftRequest = {
    key: searchKey,
    page,
    size: Number(size), 
  };

  const { data } = useGetShift(token ?? "", search);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchKey(key);
    setPage(1);
  }

  return (
    <div>
      <Title title="Data Shift" breadcrumbs={breadcrumbs} />
      <ShiftSearch handleSearch={handleSearch} searchKey={key} setKey={setKey} />
      <ShiftList
        data={data}
        page={page}
        size={size}
        setPage={setPage}
        setSize={setSize}
      />
    </div>
  );
}
