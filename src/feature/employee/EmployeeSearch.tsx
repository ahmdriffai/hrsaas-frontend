import Button from "@/components/fragment/button/button";
import SearchForm from "@/components/fragment/search-form/search-form";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="mb-5">
      <CardContent>
        <div className="mb-4">
          <Button asChild variant="secondary" size="sm">
            <Link to="/employees/create">Create Employee</Link>
          </Button>
        </div>

        <SearchForm
          onSearch={handleSearch}
          searchKey={searchKey}
          setKey={setKey}
        />
      </CardContent>
    </Card>
  );
}
