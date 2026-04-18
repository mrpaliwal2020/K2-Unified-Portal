import React from "react";
import { inputStyles } from "./Input.styles";
import { cn } from "../../../utils/cn";

export const Input = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputStyles({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
