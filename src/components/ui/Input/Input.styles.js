import { cva } from "class-variance-authority";

export const inputStyles = cva(
  "w-full transition duration-300 outline-none focus:ring-2",
  {
    variants: {
      variant: {
        default: "border border-green-700 bg-mauve-50 focus:ring-green-800",
        ghost: "bg-transparent border-b border-green-700 focus:border-green-800 rounded-none",
      },
      size: {
        sm: "px-2 py-1 text-sm rounded-sm",
        md: "px-3 py-2 text-base rounded-md",
        lg: "px-4 py-3 text-lg rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
