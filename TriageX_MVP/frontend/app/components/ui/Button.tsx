"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type BaseButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

export interface ButtonProps extends BaseButtonProps {
  variant?: "primary" | "secondary" | "disabled";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  disabled,
  loading = false,
  ...props
}: ButtonProps) {
  const baseClasses =
    "rounded-xl font-semibold transition-all duration-100 focus:outline-none focus:ring-4 focus:ring-primary-soft focus:ring-offset-2 cursor-pointer";

  const sizeClasses = {
    sm: "px-3 sm:px-4 py-2 text-sm sm:text-base",
    md: "px-6 py-3 text-base sm:text-lg",
    lg: "px-8 py-4 text-base sm:text-lg",
  };

  const variantClasses = {
    primary: disabled
      ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
      : "bg-primary-DEFAULT text-white hover:bg-primary-dark",
    secondary: disabled
      ? "bg-gray-300 text-gray-500 border-2 border-gray-300 cursor-not-allowed"
      : "bg-white text-primary-DEFAULT border-2 border-primary-DEFAULT hover:bg-primary-soft hover:border-primary-light",
    disabled: "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const isDisabled = disabled || variant === "disabled" || loading;

  const buttonContent = loading ? (
    <div className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Loading...</span>
    </div>
  ) : (
    children
  );

  if (isDisabled) {
    return (
      <button
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
        disabled={true}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={isDisabled}
      style={
        !isDisabled && variant === "primary"
          ? { backgroundColor: "#00A876" }
          : undefined
      }
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring" as const, stiffness: 600, damping: 25 }}
      {...(props as any)}
    >
      {buttonContent}
    </motion.button>
  );
}
