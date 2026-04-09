import SearchForm from "@/components/fragment/search-form/search-form";
import type { FormEventHandler } from "react";
import SanctionTypeCreate from "./SanctionTypeCreate";

interface Props {
  handleSearch: FormEventHandler<HTMLFormElement>;
  searchKey: string;
  setKey: (value: string) => void;
}

export default function SanctionTypeSearch({
  handleSearch,
  searchKey,
  setKey,
}: Props) {
  return (
    <div className="mb-4">
      <div className="mb-4 flex gap-4 flex-wrap">
        <SanctionTypeCreate />
      </div>
      <SearchForm
        onSearch={handleSearch}
        searchKey={searchKey}
        setKey={setKey}
      />
    </div>
  );
}
