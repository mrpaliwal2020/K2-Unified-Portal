import React from "react";
import { motion } from "framer-motion";
import { cardStyles } from "./Card.styles";
import { cn } from "../../../utils/cn";

export const Card = React.forwardRef(
  ({ className, variant, padding, asMotion = true, children, ...props }, ref) => {
    const Component = asMotion ? motion.div : "div";
    return (
      <Component
        ref={ref}
        className={cn(cardStyles({ variant, padding }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Card.displayName = "Card";
