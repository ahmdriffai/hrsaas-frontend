import Button from "@/components/fragment/button/button";
import SearchForm from "@/components/fragment/search-form/search-form";
import { Settings, Settings2 } from "lucide-react";
import type { FormEventHandler } from "react";
import { Link } from "react-router";
import SanctionCreate from "./SanctionCreate";

interface Props {
  handleSearch: FormEventHandler<HTMLFormElement>;
  searchKey: string;
  setKey: (value: string) => void;
}

export default function SanctionSearch({
  handleSearch,
  searchKey,
  setKey,
}: Props) {
  return (
    <div className="mb-4">
      <div className="mb-4 flex gap-4 flex-wrap">
        <SanctionCreate />
        <Button asChild variant="outline">
          <Link to="/employee-sanctions/types">
            <Settings />
            Jenis sanksi / peringatan
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/employee-sanctions/types">
            <Settings2 />
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
