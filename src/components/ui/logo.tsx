import { Briefcase } from "lucide-react";
import type React from "react";

export default function Logo(): React.ReactNode {
  return (
    <div className="flex justify-center gap-x-2 items-center">
      <div className="inline-block p-2 bg-primary text-white rounded-full">
        <Briefcase />
      </div>
      <h1 className="text-3xl font-bold">Makaryoo</h1>
    </div>
  );
}
