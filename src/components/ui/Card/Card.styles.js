import { cva } from "class-variance-authority";

export const cardStyles = cva(
  "bg-white rounded-xl transition duration-300",
  {
    variants: {
      variant: {
        default: "shadow-md hover:shadow-2xl",
        outlined: "border border-green-200 shadow-sm hover:shadow",
        flat: "border-2 border-gray-200 shadow-none",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "lg",
    },
  }
);
