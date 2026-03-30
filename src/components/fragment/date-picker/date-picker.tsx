import clsx from "clsx";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Button from "../button/button";

type Props = {
  value?: Date;
  onChange?: (date: Date) => void;
  classname?: string;
};

const days = ["Min", "Sn", "Sl", "R", "Km", "J", "Sb"];

export default function DatePicker({ value, onChange, classname }: Props) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);

  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handleSelect = (day: Date) => {
    setSelectedDate(day);
    onChange?.(day);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <Button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="px-3 py-1 rounded hover:bg-gray-100"
        variant="ghost"
      >
        <ChevronLeft size={20} />
      </Button>

      <div className="font-semibold">{format(currentMonth, "MMMM yyyy")}</div>

      <Button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        variant="ghost"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-3">
      {days.map((day, i) => (
        <div key={i}>{day}</div>
      ))}
    </div>
  );

  const renderCells = () => {
    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const daysRow = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = day;

        daysRow.push(
          <div
            key={day.toString()}
            onClick={() => handleSelect(cloneDay)}
            className={clsx(
              "h-10 w-10 flex text-sm font-medium items-center justify-center cursor-pointer rounded-lg",
              !isSameMonth(day, monthStart) && "text-gray-300",
              isSameDay(day, selectedDate || new Date(0)) &&
                "bg-black text-white",
              "hover:border hover:border-gray-900",
            )}
          >
            {format(day, "d")}
          </div>,
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {daysRow}
        </div>,
      );
    }

    return <div>{rows}</div>;
  };

  return (
    <div
      className={clsx("w-full max-w-sm p-4 rounded-2xl bg-white ", classname)}
    >
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
