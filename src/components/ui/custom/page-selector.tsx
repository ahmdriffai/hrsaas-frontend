import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  options = [1, 10, 50, 100],
  label = "Total",
  placeholder = "Pilih jumlah data",
  className = "w-fit text-xs p-1 ps-2",
}: PageSelectorProps) {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
