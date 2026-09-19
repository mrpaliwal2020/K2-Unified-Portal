import React from "react";
import { cn } from "../../../utils/cn";

export const K2PortalPageLayout = ({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}) => {
  return (
    <main className={cn("min-w-0", className)}>
      {(title || description || actions) && (
        <header className="flex flex-col gap-[var(--k2-space-md)] border-b border-[color:var(--k2-color-border-default)] pb-[var(--k2-space-lg)] sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-semibold text-[color:var(--k2-color-text-primary)]">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-[var(--k2-space-xs)] text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap gap-[var(--k2-space-sm)]">
              {actions}
            </div>
          )}
        </header>
      )}
      <div
        className={cn(
          "py-[var(--k2-space-xl)]",
          contentClassName,
        )}
      >
        {children}
      </div>
    </main>
  );
};
