import { cva } from "class-variance-authority";

export const loaderStyles = cva(
  "border-fpo-green border-t-transparent rounded-full animate-spin",
  {
    variants: {
      size: {
        sm: "w-8 h-8 border-2",
        md: "w-14 h-14 border-4",
        lg: "w-20 h-20 border-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);
