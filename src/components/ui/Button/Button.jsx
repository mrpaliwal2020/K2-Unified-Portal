import React from "react";
import { motion } from "framer-motion";
import { buttonStyles } from "./Button.styles";
import { cn } from "../../../utils/cn";

export const Button = React.forwardRef(
  ({ className, variant, size, fullWidth, asMotion = true, children, ...props }, ref) => {
    const Component = asMotion ? motion.button : "button";
    return (
      <Component
        ref={ref}
        className={cn(buttonStyles({ variant, size, fullWidth }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Button.displayName = "Button";
