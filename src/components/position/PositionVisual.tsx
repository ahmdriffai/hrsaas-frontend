import { useGetPosition } from "@/hooks/feature/use-position";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useLocalStorage } from "react-use";
import { Button } from "../ui/button";
import PositionDiagram from "./PositioDiagram";

export default function PositionVisual() {
  const [token] = useLocalStorage("token", "");
  const { data } = useGetPosition(token, {
    page: 1,
    size: 100,
  });
  return (
    <div>
      <div className="w-full  overflow-x-auto py-10">
        <Button asChild className="mb-4">
          <Link to="/positions">
            <ArrowLeft /> Kembali
          </Link>
        </Button>
        {data && <PositionDiagram data={data.data} />}
      </div>
      {/* <UserAction /> */}
    </div>
  );
}
