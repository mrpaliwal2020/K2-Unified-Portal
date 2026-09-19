import { cva } from "class-variance-authority";

export const buttonStyles = cva(
  "inline-flex items-center justify-center font-semibold rounded-xl transition duration-300",
  {
    variants: {
      variant: {
        primary: "bg-green-700 text-white hover:bg-green-800",
        secondary: "bg-white text-black shadow hover:bg-green-700 hover:text-white",
        ghost: "text-green-900 hover:bg-green-800 hover:text-white",
        outline: "border border-green-700 text-green-700 hover:bg-green-700 hover:text-white",
        leaf: "bg-custom-leaf text-white hover:bg-custom-leafDark",
        bark: "bg-custom-bark text-white hover:bg-custom-barkSoft",
      },
      size: {
        sm: "text-sm px-5 py-1",
        md: "text-base px-6 py-2",
        lg: "text-lg px-8 py-3",
        icon: "p-2 rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
