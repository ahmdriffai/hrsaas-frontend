import { useGetPosition } from "@/hooks/feature/use-position";
import { useLocalStorage } from "react-use";
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
        {data && <PositionDiagram data={data.data} />}
      </div>
      {/* <UserAction /> */}
    </div>
  );
}
