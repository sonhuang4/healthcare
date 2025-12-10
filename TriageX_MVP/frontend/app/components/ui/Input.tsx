"use client";

import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  infoButton?: {
    onClick: () => void;
  };
  icon?: React.ReactNode;
  normalRange?: string;
  isValid?: boolean;
  showValidation?: boolean;
  mask?: "blood_pressure" | "phone" | "date";
}

export default function Input({
  label,
  error,
  infoButton,
  icon,
  normalRange,
  isValid,
  showValidation = false,
  mask,
  className = "",
  onFocus,
  onBlur,
  onChange,
  ...props
}: InputProps) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!error) {
      e.target.style.boxShadow = "0 0 0 3px rgba(0,168,118,0.3)";
    }
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.boxShadow = "";
    onBlur?.(e);
  };

  const handleBloodPressureMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    let value = input.value;

    // Allow digits and "/" only
    value = value.replace(/[^\d/]/g, "");

    // Check if user manually typed a "/"
    const hasSlash = value.includes("/");

    let formatted = "";

    if (hasSlash) {
      // User typed "/" manually - allow manual editing
      const parts = value.split("/");
      const beforeSlash = parts[0].replace(/\D/g, "").slice(0, 3); // Max 3 digits
      const afterSlash = parts[1]
        ? parts[1].replace(/\D/g, "").slice(0, 2)
        : ""; // Max 2 digits

      if (afterSlash) {
        formatted = `${beforeSlash}/${afterSlash}`;
      } else if (value.endsWith("/")) {
        formatted = `${beforeSlash}/`;
      } else {
        formatted = beforeSlash;
      }
    } else {
      // No slash - auto-format when needed
      const digits = value.replace(/\D/g, "");

      if (digits.length === 0) {
        formatted = "";
      } else if (digits.length <= 3) {
        formatted = digits;
      } else if (digits.length <= 5) {
        formatted = `${digits.slice(0, 3)}/${digits.slice(3)}`;
      } else {
        // Limit to 5 digits total (3 before slash, 2 after)
        formatted = `${digits.slice(0, 3)}/${digits.slice(3, 5)}`;
      }
    }

    // Create a new event with the formatted value
    const newEvent = {
      ...e,
      target: {
        ...input,
        value: formatted,
        name: input.name,
      },
      currentTarget: {
        ...input,
        value: formatted,
        name: input.name,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    // Call onChange with the properly formatted event
    if (onChange) {
      onChange(newEvent);
    }
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={props.id}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
          {infoButton && (
            <button
              type="button"
              onClick={infoButton.onClick}
              className="w-5 h-5 rounded-full bg-primary-soft text-primary-DEFAULT flex items-center justify-center hover:bg-primary-light hover:text-white transition-colors"
            >
              <span className="text-xs font-bold">ℹ️</span>
            </button>
          )}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? "pl-10" : "px-4"} ${
            showValidation && (isValid === true || isValid === false || error)
              ? "pr-10"
              : "pr-4"
          } py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
            error || (showValidation && isValid === false)
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : showValidation && isValid === true
              ? "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
              : "border-triageCard-border hover:border-primary-DEFAULT focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-soft"
          } ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={
            mask === "blood_pressure" ? handleBloodPressureMask : onChange
          }
          maxLength={mask === "blood_pressure" ? 6 : undefined}
          {...props}
        />
        {showValidation &&
          isValid === true &&
          !error &&
          props.value &&
          String(props.value).trim() !== "" && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 z-10">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        {showValidation &&
          (error ||
            (isValid === false &&
              props.value &&
              String(props.value).trim() !== "")) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 z-10">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
      </div>
      {normalRange && !error && (
        <p className="mt-1 text-xs text-gray-500">
          Normal range: {normalRange}
        </p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
