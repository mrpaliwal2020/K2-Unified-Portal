import React from "react";
import { cn } from "../../../utils/cn";
import { CONTENT } from "../../../constants/content";

const FieldFrame = ({ children, error, hint, id, label, required }) => {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-red-500">*</span>}
      </label>
      {children({ hintId, errorId })}
      {hint && !error && <p className="mt-1 text-xs text-gray-500" id={hintId}>{hint}</p>}
      {error && <p className="mt-1 text-xs font-semibold text-red-500" id={errorId}>{error}</p>}
    </div>
  );
};

const fieldClassName =
  "w-full rounded-[var(--k2-radius-md)] border bg-white px-[var(--k2-space-md)] py-[var(--k2-space-sm)] text-sm text-gray-900 outline-none transition focus:border-[color:var(--k2-color-primary)] focus:ring-2 focus:ring-[color:var(--k2-color-primary)]/20 disabled:cursor-not-allowed disabled:bg-gray-100";

export const K2DateField = React.forwardRef(
  (
    {
      className,
      error,
      hint,
      id,
      label,
      onChange,
      onValueChange,
      required = false,
      ...inputProps
    },
    ref,
  ) => {
    const handleChange = (event) => {
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    return (
      <FieldFrame error={error} hint={hint} id={id} label={label} required={required}>
        {({ hintId, errorId }) => (
          <input
            {...inputProps}
            aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
            aria-invalid={Boolean(error)}
            className={cn(fieldClassName, className)}
            id={id}
            onChange={handleChange}
            ref={ref}
            required={required}
            type="date"
          />
        )}
      </FieldFrame>
    );
  },
);
K2DateField.displayName = "K2DateField";

export const K2ReferenceSelect = React.forwardRef(
  (
    {
      className,
      disabled = false,
      emptyMessage = CONTENT.common.form.emptyOptions,
      error,
      hint,
      id,
      label,
      loading = false,
      onChange,
      onValueChange,
      options = [],
      placeholder = CONTENT.common.form.selectPlaceholder,
      required = false,
      ...selectProps
    },
    ref,
  ) => {
    const isUnavailable = loading || options.length === 0;
    const statusMessage = loading
      ? CONTENT.common.form.loadingOptions
      : options.length === 0
        ? emptyMessage
        : placeholder;
    const handleChange = (event) => {
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    return (
      <FieldFrame error={error} hint={hint} id={id} label={label} required={required}>
        {({ hintId, errorId }) => (
          <select
            {...selectProps}
            aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
            aria-invalid={Boolean(error)}
            className={cn(fieldClassName, className)}
            disabled={disabled || isUnavailable}
            id={id}
            onChange={handleChange}
            ref={ref}
            required={required}
          >
            <option value="">{statusMessage}</option>
            {options.map(({ disabled: optionDisabled, label: optionLabel, value }) => (
              <option disabled={optionDisabled} key={value} value={value}>
                {optionLabel}
              </option>
            ))}
          </select>
        )}
      </FieldFrame>
    );
  },
);
K2ReferenceSelect.displayName = "K2ReferenceSelect";
