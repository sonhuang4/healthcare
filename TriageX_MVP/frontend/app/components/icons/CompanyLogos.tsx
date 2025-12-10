"use client";

import React from "react";

// CalmCare Clinics Logo
export const CalmCareLogo: React.FC<{ className?: string }> = ({
  className = "w-24 h-auto",
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CalmCare Clinics logo"
      role="img"
    >
      {/* Medical cross icon */}
      <rect x="5" y="12" width="8" height="16" rx="1" fill="#00A876" />
      <rect x="2" y="18" width="14" height="4" rx="1" fill="#00A876" />
      {/* Text */}
      <text
        x="25"
        y="25"
        fontSize="14"
        fontWeight="700"
        fill="#00A876"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        CalmCare
      </text>
      <text
        x="25"
        y="35"
        fontSize="9"
        fontWeight="500"
        fill="#6B7280"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        CLINICS
      </text>
    </svg>
  );
};

// HealthFoundry Logo
export const HealthFoundryLogo: React.FC<{ className?: string }> = ({
  className = "w-28 h-auto",
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 140 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HealthFoundry logo"
      role="img"
    >
      {/* Building/Foundation icon */}
      <rect x="5" y="15" width="12" height="12" fill="#00A876" rx="1" />
      <rect x="5" y="20" width="12" height="7" fill="#00A876" opacity="0.7" />
      <rect x="20" y="12" width="12" height="15" fill="#00A876" rx="1" />
      <rect x="20" y="17" width="12" height="10" fill="#00A876" opacity="0.7" />
      <rect x="35" y="18" width="12" height="9" fill="#00A876" rx="1" />
      {/* Text */}
      <text
        x="52"
        y="25"
        fontSize="13"
        fontWeight="700"
        fill="#00A876"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        HealthFoundry
      </text>
      <line
        x1="52"
        y1="28"
        x2="130"
        y2="28"
        stroke="#00A876"
        strokeWidth="1.5"
        opacity="0.3"
      />
    </svg>
  );
};

// Northwind Health Logo
export const NorthwindHealthLogo: React.FC<{ className?: string }> = ({
  className = "w-32 h-auto",
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Northwind Health logo"
      role="img"
    >
      {/* Wind/Flow icon */}
      <path
        d="M5 25 Q15 20, 20 25 T30 25"
        stroke="#00A876"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M8 30 Q15 25, 20 30 T30 30"
        stroke="#00A876"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Medical pulse */}
      <path
        d="M35 20 L38 25 L41 22 L44 25 L47 20"
        stroke="#00A876"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Text */}
      <text
        x="55"
        y="25"
        fontSize="12"
        fontWeight="700"
        fill="#00A876"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Northwind
      </text>
      <text
        x="55"
        y="35"
        fontSize="11"
        fontWeight="600"
        fill="#6B7280"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Health
      </text>
    </svg>
  );
};
