"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "../../i18n/routing";

type LanguageCode = "en" | "sv";

interface Language {
  code: string;
  display: string;
  name: string;
  available: boolean; // true for functional languages, false for placeholders
}

const languages: Language[] = [
  { code: "en", display: "EN", name: "English", available: true },
  { code: "sv", display: "SV", name: "Svenska", available: true },
  { code: "ar", display: "AR", name: "العربية", available: false }, // Arabic
  { code: "zh", display: "ZH", name: "中文", available: false }, // Chinese
  { code: "es", display: "ES", name: "Español", available: false }, // Spanish
  { code: "fr", display: "FR", name: "Français", available: false }, // French
  { code: "de", display: "DE", name: "Deutsch", available: false }, // German
];

const LanguageToggle: React.FC = () => {
  const locale = useLocale() as LanguageCode;
  const router = useRouter();
  const pathname = usePathname();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (langCode: string) => {
    const selectedLang = languages.find((l) => l.code === langCode);

    // Only allow switching to available languages
    if (!selectedLang || !selectedLang.available) {
      // Placeholder language - just close dropdown
      setIsLanguageDropdownOpen(false);
      return;
    }

    // Save preference
    if (typeof window !== "undefined") {
      localStorage.setItem("triagex-language", langCode);
      // Dispatch custom event for Logo component
      const langDisplay = selectedLang.display || "EN";
      window.dispatchEvent(
        new CustomEvent("languageChange", { detail: langDisplay })
      );
    }

    // Switch locale using next-intl router
    router.replace(pathname, { locale: langCode as LanguageCode });
    setIsLanguageDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

  const currentLanguage =
    languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className="relative" ref={languageDropdownRef}>
      <button
        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary-DEFAULT hover:bg-primary-soft rounded-lg transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 cursor-pointer"
      >
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
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm font-medium">{currentLanguage.display}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-100 ${
            isLanguageDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Language Dropdown */}
      {isLanguageDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border-2 border-triageCard-border rounded-xl shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto">
          {languages.map((lang, index) => {
            const isAvailable = lang.available;
            const isSelected = locale === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={!isAvailable}
                className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-100 ${
                  index > 0 ? "border-t border-gray-100" : ""
                } ${
                  isSelected
                    ? "bg-primary-soft text-primary-DEFAULT"
                    : isAvailable
                    ? "text-gray-700 hover:bg-gray-50"
                    : "text-gray-400 cursor-not-allowed opacity-60"
                } focus:outline-none focus:bg-primary-soft disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span>{lang.name}</span>
                    <span className="text-xs text-gray-500 mt-0.5">
                      {lang.display}
                      {!isAvailable && (
                        <span className="ml-1 text-xs text-gray-400">
                          (Coming soon)
                        </span>
                      )}
                    </span>
                  </div>
                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-primary-DEFAULT"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
