import Title from "@/components/layout/Title";
import { Button } from "@/components/ui/button";
import PositionDiagram from "@/feature/position/PositioDiagram";
import { useGetPosition } from "@/hooks/feature/use-position";
import { useDocumentTitle } from "@/hooks/user-titledoc";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useLocalStorage } from "react-use";

export default function PositionVisualPage() {
  useDocumentTitle("Daftar Posisi Karyawan - Visual");
  const [token] = useLocalStorage("token", "");
  const { data } = useGetPosition(token, {
    page: 1,
    size: 100,
  });

  return (
    <div>
      <Title title="Data Posisi Karyawan" />
      <Button asChild className="mb-4">
        <Link to="/positions">
          <ArrowLeft /> Kembali
        </Link>
      </Button>
      <div className="w-full overflow-x-auto py-2">
        {data && <PositionDiagram data={data.data} />}
      </div>
    </div>
  );
}
