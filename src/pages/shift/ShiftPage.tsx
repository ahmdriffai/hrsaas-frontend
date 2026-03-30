import Title from "@/components/layout/Title";
import ShiftList from "@/feature/shift/ShiftList";
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
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");

  const search: SearchShiftRequest = {
    key: "",
    page,
    size: Number(size),
  };

  const { data } = useGetShift(token ?? "", search);

  return (
    <div>
      <Title title="Data Shift" breadcrumbs={breadcrumbs} />
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
