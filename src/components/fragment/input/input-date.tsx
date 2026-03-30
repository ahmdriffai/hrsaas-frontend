import { useState } from "react";
import DatePicker from "../date-picker/date-picker";
import Input from "./input";

interface Props {
  label?: string;
  value?: Date;
  onChange?: (val: Date) => void;
}

export default function InputDate({ label = "Date", value, onChange }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  return (
    <div className="relative">
      <Input
        label={label}
        value={formatDate(value)}
        onFocus={() => setOpen(true)}
      />

      {open && (
        <div className="absolute z-10 mt-2 ">
          <DatePicker
            classname="shadow-xl"
            value={value}
            onChange={(date: Date) => {
              onChange?.(date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
