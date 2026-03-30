import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  icon?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  loading?: boolean;
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  icon = false,
  variant = "primary",
  size = "md",
  className,
  disabled,
  loading,
  asChild = false,
  ...props
}: Props) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || loading;

  const baseStyle =
    "rounded-xl px-6 py-3 font-semibold active:scale-[97%] cursor-pointer flex items-center justify-center gap-1";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-800 disabled:bg-gray-200",
    secondary: "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-200",
    outline: "border border-gray-300 text-gray-900 hover:bg-gray-100",
    ghost: "text-gray-900 hover:bg-gray-50 p-2!",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-md",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <Comp
      className={clsx(
        baseStyle,
        variants[variant],
        sizes[size],
        className,
        icon && "rounded-full!",
        {
          "w-fit": asChild,
        },
      )}
      {...(!asChild && { disabled: isDisabled })}
      {...props}
    >
      {children}
    </Comp>
  );
}
