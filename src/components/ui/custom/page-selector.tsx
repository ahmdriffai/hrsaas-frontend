import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

interface PageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  options?: number[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export function PageSelector({
  value,
  onValueChange,
  options = [1, 10, 25, 50, 100],
  label = "Rows per page",
  placeholder = "Select",
  className,
}: PageSelectorProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      {/* LABEL */}
      <span className="whitespace-nowrap">{label}</span>

      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger
          className={clsx(
            "h-9 rounded-full border border-gray-300 bg-white px-3",
            "text-sm text-gray-800",
            "hover:border-gray-400",
            "focus:ring-0 focus:outline-none",
            "transition",
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          className={clsx(
            "rounded-xl border border-gray-200 bg-white shadow-sm",
            "p-1",
          )}
        >
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option}
                value={option.toString()}
                className={clsx(
                  "rounded-lg px-3 py-2 text-sm text-gray-700",
                  "focus:bg-gray-100 cursor-pointer",
                )}
              >
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
