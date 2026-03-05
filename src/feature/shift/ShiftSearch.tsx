import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { FormEventHandler } from "react";
import ShiftCreate from "./ShiftCreate";

interface Props {
  handleSearch: FormEventHandler<HTMLFormElement>;
  searchKey: string;
  setKey: (value: string) => void;
}

export default function ShiftSearch({
  handleSearch,
  searchKey,
  setKey,
}: Props) {
  return (
    <Card className="mb-5">
      <CardContent>
        <div className="mb-4 flex gap-4">
          <ShiftCreate />
        </div>
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <div className="space-y-1">
            <Input
              id="shift-search"
              placeholder="Cari shift ..."
              value={searchKey}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button type="submit" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
