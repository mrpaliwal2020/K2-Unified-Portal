import React from "react";
import Header from "../../../components/Common/Header";
import { cn } from "../../../utils/cn";

export const DashboardLayout = ({
  sidebar,
  children,
  onSwitchRole,
  className,
  contentClassName,
}) => {
  return (
    <div className={cn("h-screen bg-gray-50 flex flex-col", className)}>
      <Header onSwitchRole={onSwitchRole} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        {sidebar}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className={cn("p-6 w-full max-w-7xl mx-auto", contentClassName)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
