import Button from "@/components/fragment/button/button";
import SearchForm from "@/components/fragment/search-form/search-form";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import type { FormEventHandler } from "react";
import { Link } from "react-router";
import PositionCreate from "./PositionCreate";

interface Props {
  handleSearch: FormEventHandler<HTMLFormElement>;
  searchKey: string;
  setKey: (value: string) => void;
}

export default function PositionSearch({
  handleSearch,
  searchKey,
  setKey,
}: Props) {
  return (
    <Card className="mb-5">
      <CardContent>
        <div className="mb-4 flex gap-4">
          <PositionCreate />
          <Button asChild size="sm" variant="secondary">
            <Link to="/positions/visual">
              <Eye size={20} />
              Lihat Visual
            </Link>
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
