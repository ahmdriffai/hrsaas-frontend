import Title from "@/components/layout/Title";
import SanctionList from "@/feature/sanction/SanctionList";
import SanctionSearch from "@/feature/sanction/SanctionSearch";
import { useGetSanction } from "@/hooks/feature/use-sanction";
import { useDocumentTitle } from "@/hooks/user-titledoc";
import type { SearchSanctionRequest } from "@/lib/model/sanction.model";
import { useState } from "react";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sanksi Karyawan", href: "/employee-sanctions" },
];

export default function SanctionPage() {
  useDocumentTitle("Daftar Sanksi Karyawan");
  const [key, setKey] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");
  const [searchKey, setSearchKey] = useState("");
  const [token] = useLocalStorage("token", "");
  const search: SearchSanctionRequest = {
    reason: searchKey,
    start_date: "",
    end_date: "",
    sanction_id: "",
    status: "",
    page,
    size: Number(size),
  };

  const { data, isError, error } = useGetSanction(token, search);
  if (isError) {
    toast.error((error as Error).message);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchKey(key);
    setPage(1);
  }

  return (
    <div>
      <Title title="Data Sanksi Karyawan" breadcrumbs={breadcrumbs} />
      <SanctionSearch
        handleSearch={handleSearch}
        searchKey={key}
        setKey={setKey}
      />
      <SanctionList
        data={data}
        page={page}
        size={size}
        setPage={setPage}
        setSize={setSize}
      />
    </div>
  );
}
