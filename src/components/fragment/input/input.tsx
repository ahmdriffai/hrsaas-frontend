/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { useState } from "react";

type Props = {
  label: string;
  value: any;
  onChange?: (val: string) => void;
  className?: string;
  type?: "number" | "text" | "password" | "date";
  prefix?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function Input({
  label,
  value,
  onChange,
  className,
  type = "text",
  onFocus,
  onBlur,
  prefix,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const isActive = isFocused || (value !== null && value !== "" && value !== 0);

  return (
    <div className={clsx("relative w-full", className)}>
      {/* Wrapper */}
      <div
        className={clsx(
          "flex items-center rounded-xl border px-4 pt-6 pb-2 transition-all",
          isFocused ? "border-black" : "border-gray-300",
        )}
      >
        {/* Prefix */}
        {prefix && isActive && (
          <span className="mr-2 text-gray-500">{prefix}</span>
        )}

        {/* Input */}
        <input
          value={value === 0 ? "" : value}
          type={type}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          className="text-md appearance-none w-full bg-transparent outline-none"
        />
      </div>

      {/* Label */}
      <label
        className={clsx(
          "pointer-events-none absolute left-4 text-gray-500 transition-all duration-200",
          {
            "top-2 text-xs": isActive,
            "text-md top-1/2 -translate-y-1/2": !isActive,
          },
        )}
      >
        {label}
      </label>
    </div>
  );
}
