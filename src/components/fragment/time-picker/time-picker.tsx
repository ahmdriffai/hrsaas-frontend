import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Button from "../button/button";

type Props = {
  value?: string; // "HH:mm"
  onChange?: (time: string) => void;
  classname?: string;
  disabled?: boolean;
};

export default function TimePicker({ value, onChange, classname }: Props) {
  const [mode, setMode] = useState<"hour" | "minute">("hour");

  const [selectedHour, setSelectedHour] = useState<number>(
    value ? parseInt(value.split(":")[0]) : new Date().getHours(),
  );

  const [selectedMinute, setSelectedMinute] = useState<number>(
    value ? parseInt(value.split(":")[1]) : 0,
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleSelectHour = (h: number) => {
    setSelectedHour(h);
    setMode("minute");
  };

  const handleSelectMinute = (m: number) => {
    setSelectedMinute(m);
    const time = `${String(selectedHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    onChange?.(time);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          if (mode === "minute") setMode("hour");
        }}
      >
        <ChevronLeft size={20} />
      </Button>

      <div className="font-semibold cursor-pointer">
        {String(selectedHour).padStart(2, "0")}:
        {String(selectedMinute).padStart(2, "0")}
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          if (mode === "hour") setMode("minute");
        }}
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );

  const renderHours = () => (
    <div className="grid grid-cols-4 gap-2">
      {hours.map((h) => (
        <div
          key={h}
          onClick={() => handleSelectHour(h)}
          className={clsx(
            "p-3 text-center cursor-pointer rounded-xl text-sm font-medium",
            "hover:bg-gray-100",
            h === selectedHour && "bg-black text-white",
          )}
        >
          {String(h).padStart(2, "0")}
        </div>
      ))}
    </div>
  );

  const renderMinutes = () => (
    <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
      {minutes.map((m) => (
        <div
          key={m}
          onClick={() => handleSelectMinute(m)}
          className={clsx(
            "p-3 text-center cursor-pointer rounded-xl text-sm font-medium",
            "hover:bg-gray-100",
            m === selectedMinute && "bg-black text-white",
          )}
        >
          {String(m).padStart(2, "0")}
        </div>
      ))}
    </div>
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={clsx("w-xs p-4 rounded-2xl bg-white", classname)}
    >
      {renderHeader()}
      {mode === "hour" && renderHours()}
      {mode === "minute" && renderMinutes()}
    </div>
  );
}
