import React from "react";
import { cn } from "../../../utils/cn";
import Header from "../../Common/Header";

export const AuthLayout = ({ children, className }) => {
  return (
    <div className={cn("h-screen flex flex-col overflow-hidden", className)}>
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 bg-gradient-to-br bg-gray-50 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export const AuthHeader = ({ title, subtitle, icon: Icon, className }) => {
  return (
    <div className={cn("flex flex-col items-center mb-10", className)}>
      {Icon && (
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md bg-green-500">
          <Icon size={36} className="text-white" />
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center font-serif">{title}</h1>
      {subtitle && <p className="text-gray-400 text-sm mt-1 font-semibold text-center">{subtitle}</p>}
    </div>
  );
};
