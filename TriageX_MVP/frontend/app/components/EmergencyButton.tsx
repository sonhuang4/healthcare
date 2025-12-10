"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "../../i18n/routing";

export default function EmergencyButton() {
  const t = useTranslations("emergency");
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href="tel:112"
      aria-label={t("ariaLabel")}
      className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-200 flex items-center gap-2 font-semibold text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-red-300 shadow-lg hover:shadow-xl"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 99999,
        display: "flex",
        pointerEvents: "auto",
      }}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      {t("button")}
    </a>
  );
}
