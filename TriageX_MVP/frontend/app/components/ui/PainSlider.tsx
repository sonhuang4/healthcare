"use client";

import React from "react";
import { motion } from "framer-motion";

export interface PainSliderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  infoButton?: {
    onClick: () => void;
  };
}

export default function PainSlider({
  value,
  onChange,
  label = "Pain Level (1-10)",
  error,
  infoButton,
}: PainSliderProps) {
  const painValue = value ? parseInt(value) : 1;
  const isValidValue = painValue >= 1 && painValue <= 10;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const getPainColor = (level: number) => {
    if (level <= 3) return "bg-green-500";
    if (level <= 6) return "bg-yellow-500";
    if (level <= 8) return "bg-orange-500";
    return "bg-red-600";
  };

  const getPainLabel = (level: number) => {
    if (level <= 3) return "Mild";
    if (level <= 6) return "Moderate";
    if (level <= 8) return "Severe";
    return "Very Severe";
  };

  return (
    <div>
      {label && (
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          {label}
          {infoButton && (
            <button
              type="button"
              onClick={infoButton.onClick}
              className="w-5 h-5 rounded-full bg-primary-soft text-primary-DEFAULT flex items-center justify-center hover:bg-primary-light hover:text-white transition-colors text-xs font-bold cursor-help"
              aria-label="More information"
            >
              ℹ️
            </button>
          )}
        </label>
      )}

      <div className="space-y-4">
        {/* Visual Slider */}
        <div className="relative">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={painValue}
            onChange={handleSliderChange}
            className={`w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
              error ? "border-red-400" : ""
            }`}
            style={{
              background: `linear-gradient(to right, ${getPainColor(
                painValue
              )} 0%, ${getPainColor(painValue)} ${
                ((painValue - 1) / 9) * 100
              }%, #e5e7eb ${((painValue - 1) / 9) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {/* Current Value Display */}
        {isValidValue && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getPainColor(
              painValue
            )} text-white font-semibold`}
          >
            <span className="text-lg">{painValue}</span>
            <span className="text-sm">- {getPainLabel(painValue)}</span>
          </motion.div>
        )}

        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  );
}
