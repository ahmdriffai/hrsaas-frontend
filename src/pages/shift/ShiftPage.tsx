import Button from "@/components/fragment/button/button";
import Title from "@/components/layout/Title";
import ShiftList from "@/feature/shift/ShiftList";
import { useGetShift } from "@/hooks/feature/use-shift";
import type { SearchShiftRequest } from "@/lib/model/shift.model";
import { useState } from "react";
import { Link } from "react-router";
import { useLocalStorage } from "react-use";

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
      <Title title="Pengaturan shift" />
      <Button asChild variant="secondary" size="md">
        <Link to="/attendances/shifts/create">Tambah shift</Link>
      </Button>
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
