import { PulseLoader } from "react-spinners";

interface Props {
  position?: "left" | "center" | "right";
}
export default function Loader({ position = "left" }: Props) {
  return (
    <div className={`w-full flex justify-${position} p-5`}>
      <PulseLoader size={10} />
    </div>
  );
}
