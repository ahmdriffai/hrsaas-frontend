import Button from "@/components/fragment/button/button";
import Title from "@/components/layout/Title";
import SanctionTypeList from "@/feature/sanction/SanctionTypeList";
import SanctionTypeSearch from "@/feature/sanction/SanctionTypeSearch";
import { useGetSanctionType } from "@/hooks/feature/use-sanction";
import { useDocumentTitle } from "@/hooks/user-titledoc";
import type { SearchSanctionTypeReq } from "@/lib/model/sanction.model";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";

export default function SanctionTypePage() {
  useDocumentTitle("Daftar Sanksi Karyawan");
  const [key, setKey] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");
  const [searchKey, setSearchKey] = useState("");
  const [token] = useLocalStorage("token", "");
  const search: SearchSanctionTypeReq = {
    key: searchKey,
    page,
    size: Number(size),
  };

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchKey(key);
    setPage(1);
  }

  const { data, isError, error } = useGetSanctionType(token, search);
  if (isError) {
    toast.error((error as Error).message);
  }

  return (
    <div>
      <Button asChild variant="third">
        <Link to="/employee-sanctions">
          <ArrowLeft />
        </Link>
      </Button>
      <Title title="Pengaturan jenis sanksi" />
      <SanctionTypeSearch
        handleSearch={handleSearch}
        searchKey={key}
        setKey={setKey}
      />
      <SanctionTypeList
        data={data}
        page={page}
        size={size}
        setPage={setPage}
        setSize={setSize}
      />
    </div>
  );
}
