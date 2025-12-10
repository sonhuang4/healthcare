"use client";

import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  infoButton?: {
    onClick: () => void;
  };
  isValid?: boolean;
  showValidation?: boolean;
}

export default function Textarea({
  label,
  error,
  infoButton,
  isValid,
  showValidation = false,
  className = "",
  onFocus,
  onBlur,
  ...props
}: TextareaProps) {
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!error) {
      e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.3)";
    }
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.boxShadow = "";
    onBlur?.(e);
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
        <textarea
          className={`w-full ${
            showValidation && (isValid === true || isValid === false || error)
              ? "pr-10"
              : "pr-4"
          } px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
            error || (showValidation && isValid === false)
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : showValidation && isValid === true
              ? "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
              : "border-triageCard-border hover:border-primary-DEFAULT focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-soft"
          } ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {showValidation &&
          isValid === true &&
          !error &&
          props.value &&
          String(props.value).trim() !== "" && (
            <div className="absolute right-3 top-3 text-green-500 z-10">
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
            <div className="absolute right-3 top-3 text-red-500 z-10">
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
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
