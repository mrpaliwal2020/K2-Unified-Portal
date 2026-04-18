import { cva } from "class-variance-authority";

export const accordionStyles = {
  container: cva("bg-white p-5 rounded-xl shadow-md transition duration-300"),
  button: cva("w-full text-left flex justify-between items-center text-lg md:text-xl font-medium text-gray-800"),
  content: cva("mt-4 text-gray-600 text-sm leading-relaxed"),
  icon: cva("fa-solid fa-chevron-down text-gray-500 transition-transform duration-300", {
    variants: {
      isOpen: {
        true: "rotate-180",
        false: "",
      }
    },
    defaultVariants: {
      isOpen: false,
    }
  })
};
