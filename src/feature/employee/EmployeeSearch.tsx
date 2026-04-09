import Button from "@/components/fragment/button/button";
import SearchForm from "@/components/fragment/search-form/search-form";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import type { FormEventHandler } from "react";
import { Link } from "react-router";

interface Props {
  handleSearch: FormEventHandler<HTMLFormElement>;
  searchKey: string;
  setKey: (value: string) => void;
}

export default function EmployeeSearch({
  handleSearch,
  searchKey,
  setKey,
}: Props): React.ReactNode {
  return (
    <div className="mb-4">
      <div className="mb-3 flex gap-3 flex-wrap">
        <Button asChild variant="secondary" size="md">
          <Link to="/employees/create">Tambah karyawan</Link>
        </Button>
        <Button asChild variant="outline" size="md">
          <Link to="/employees/create">
            <ArrowUpToLine size={20} />
            Import data
          </Link>
        </Button>
        <Button asChild variant="outline" size="md">
          <Link to="/employees/create">
            <ArrowDownToLine size={20} />
            Download
          </Link>
        </Button>
      </div>
      <SearchForm
        onSearch={handleSearch}
        searchKey={searchKey}
        setKey={setKey}
      />
    </div>
  );
}
