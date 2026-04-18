import React from "react";
import { cn } from "../../../utils/cn";

export const FieldGroup = ({ icon: Icon, children, className, error, label, required }) => {
  return (
    <div className={cn("mb-4", className)}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 block mb-1.5">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div
        className={cn(
          "flex items-center border-2 rounded-xl overflow-hidden transition-colors focus-within:border-green-500 bg-white shadow-sm",
          error ? "border-red-400" : "border-gray-200"
        )}
      >
        {Icon && (
          <div className="flex items-center gap-2 px-4 py-2.5 border-r border-gray-200 shrink-0 bg-gray-50">
            <Icon size={18} className="text-green-500" />
          </div>
        )}
        {children}
      </div>
      {error && <FormError error={error} className="mt-1 mb-0" />}
    </div>
  );
};

export const InfoBadge = ({ label, value, action, actionText, actionIcon: ActionIcon, className }) => {
  return (
    <div className={cn("bg-green-50 rounded-xl p-4 mb-9 flex items-center justify-between", className)}>
      <div>
        <p className="text-gray-400 text-xs font-semibold">{label}</p>
        <p className="text-gray-800 text-xl font-bold">{value}</p>
      </div>
      {action && (
        <button
          onClick={action}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1 active:scale-95 shadow-sm"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          <span className="text-sm font-semibold">{actionText}</span>
        </button>
      )}
    </div>
  );
};

export const PhoneInputGroup = ({ countryCode = "+91", children, className, error }) => {
  return (
    <div className={cn("mb-4", className)}>
      <div
        className={cn(
          "flex items-center border-2 rounded-xl overflow-hidden transition-colors focus-within:border-green-600 bg-white shadow-sm",
          error ? "border-red-400" : "border-gray-200"
        )}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-r border-gray-200 shrink-0 bg-gray-50">
          <span className="text-sm font-bold text-gray-700">{countryCode}</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export const FormError = ({ error, prefix = "⚠", className }) => {
  if (!error) return null;
  return (
    <p className={cn("text-red-500 text-xs mt-1 mb-3 flex items-center gap-1 font-semibold", className)}>
      <span>{prefix}</span> {error}
    </p>
  );
};
