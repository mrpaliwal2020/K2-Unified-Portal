import React from "react";
import { cn } from "../../../utils/cn";

export const PageTitle = ({ children, className }) => (
  <h1 className={cn("text-3xl md:text-4xl font-bold text-gray-900 font-serif", className)}>
    {children}
  </h1>
);

export const PageSubtitle = ({ children, className }) => (
  <p className={cn("text-gray-400 text-sm font-semibold", className)}>
    {children}
  </p>
);

export const SectionTitle = ({ children, className }) => (
  <h2 className={cn("text-xl md:text-2xl font-bold text-gray-800", className)}>
    {children}
  </h2>
);
