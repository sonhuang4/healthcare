"use client";

import React from "react";

// AI Brain with Medical Cross Icon
export const AIPrecisionIcon: React.FC<{ className?: string }> = ({
  className = "w-20 h-20",
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      {/* Brain shape */}
      <path
        d="M50 15C35 15 20 25 20 40C20 45 22 50 25 53C22 56 20 61 20 66C20 80 30 85 35 88C32 90 30 93 30 96C30 97 31 98 32 98C33 98 34 97 35 96C35 95 36 94 37 93C40 95 45 96 50 96C55 96 60 95 63 93C64 94 65 95 65 96C66 97 67 98 68 98C69 98 70 97 70 96C70 93 68 90 65 88C70 85 80 80 80 66C80 61 78 56 75 53C78 50 80 45 80 40C80 25 65 15 50 15Z"
        fill="url(#brainGradient)"
        stroke="#00A876"
        strokeWidth="2"
      />
      {/* Medical cross in center */}
      <rect x="45" y="40" width="10" height="20" rx="2" fill="#00A876" />
      <rect x="40" y="45" width="20" height="10" rx="2" fill="#00A876" />
      {/* Neural network nodes */}
      <circle cx="35" cy="35" r="3" fill="#00A876" opacity="0.8" />
      <circle cx="65" cy="35" r="3" fill="#00A876" opacity="0.8" />
      <circle cx="35" cy="65" r="3" fill="#00A876" opacity="0.8" />
      <circle cx="65" cy="65" r="3" fill="#00A876" opacity="0.8" />
      {/* Connection lines */}
      <line
        x1="35"
        y1="35"
        x2="50"
        y2="50"
        stroke="#00A876"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="65"
        y1="35"
        x2="50"
        y2="50"
        stroke="#00A876"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="35"
        y1="65"
        x2="50"
        y2="50"
        stroke="#00A876"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="65"
        y1="65"
        x2="50"
        y2="50"
        stroke="#00A876"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A876" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00A876" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// 24/7 Clock with Heartbeat Icon
export const AvailabilityIcon: React.FC<{ className?: string }> = ({
  className = "w-20 h-20",
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      {/* Clock circle */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="4"
      />
      {/* Clock face gradient */}
      <circle cx="50" cy="50" r="36" fill="url(#clockGradient)" opacity="0.3" />
      {/* Clock hands */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="30"
        stroke="#3B82F6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="65"
        y2="50"
        stroke="#3B82F6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Heartbeat line */}
      <path
        d="M20 60 L30 50 L35 55 L40 45 L45 50 L50 45 L55 50 L60 45 L65 50 L70 45 L75 50 L80 60"
        stroke="#EF4444"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Heartbeat pulse dots */}
      <circle cx="30" cy="50" r="2" fill="#EF4444" />
      <circle cx="50" cy="45" r="2" fill="#EF4444" />
      <circle cx="70" cy="45" r="2" fill="#EF4444" />
      <defs>
        <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Evidence-Based: Medical Document with Checkmark
export const EvidenceBasedIcon: React.FC<{ className?: string }> = ({
  className = "w-20 h-20",
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      {/* Document/Clipboard */}
      <rect
        x="25"
        y="20"
        width="50"
        height="65"
        rx="3"
        fill="url(#documentGradient)"
        stroke="#EC4899"
        strokeWidth="2.5"
      />
      {/* Clipboard top */}
      <rect
        x="30"
        y="15"
        width="40"
        height="12"
        rx="2"
        fill="#EC4899"
        stroke="#EC4899"
        strokeWidth="2"
      />
      {/* Document lines */}
      <line
        x1="35"
        y1="35"
        x2="65"
        y2="35"
        stroke="#EC4899"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="35"
        y1="45"
        x2="65"
        y2="45"
        stroke="#EC4899"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="35"
        y1="55"
        x2="60"
        y2="55"
        stroke="#EC4899"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Checkmark */}
      <path
        d="M35 70 L42 77 L60 55"
        stroke="#10B981"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Medical cross badge */}
      <circle cx="70" cy="30" r="8" fill="#EC4899" />
      <rect x="68" y="26" width="4" height="8" rx="0.5" fill="white" />
      <rect x="66" y="28" width="8" height="4" rx="0.5" fill="white" />
      <defs>
        <linearGradient
          id="documentGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#EC4899" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
};
