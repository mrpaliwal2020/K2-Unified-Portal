import React from "react";
import { loaderStyles } from "./Loader.styles";
import { cn } from "../../../utils/cn";
import { CONTENT } from "../../../constants/content";

export const Loader = ({ className, size, ...props }) => {
  return (
    <div
      className={cn(loaderStyles({ size }), className)}
      {...props}
    />
  );
};

export const FullScreenLoader = ({ title = CONTENT.common.loading }) => (
  <div className="min-h-screen flex items-center justify-center bg-fpo-cream">
    <div className="flex flex-col items-center gap-4">
      <Loader size="md" />
      <p className="text-fpo-green font-bold text-xl tracking-wide">
        {CONTENT.common.brandName}
      </p>
      <p className="text-gray-500 text-sm">{title}</p>
    </div>
  </div>
);
