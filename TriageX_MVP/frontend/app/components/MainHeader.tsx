"use client";

import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "../../i18n/routing";
import LanguageToggle from "./LanguageToggle";
import Logo from "./Logo";
import { ROUTES } from "../constants";

interface MainHeaderProps {
  onStartAssessmentClick?: () => void;
}

export default function MainHeader({
  onStartAssessmentClick,
}: MainHeaderProps) {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnchorNavigation = useCallback(
    (sectionId: string) => {
      if (pathname === ROUTES.HOME && typeof window !== "undefined") {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(`${ROUTES.HOME}#${sectionId}`);
      }
      setMobileMenuOpen(false);
    },
    [pathname, router]
  );

  const handleNavLink = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: t("home"), href: ROUTES.HOME, type: "link" as const },
    { label: t("features"), section: "features", type: "anchor" as const },
    {
      label: t("howItWorks"),
      section: "how-it-works",
      type: "anchor" as const,
    },
    { label: t("about"), href: ROUTES.ABOUT, type: "link" as const },
    { label: t("resources"), href: ROUTES.RESOURCES, type: "link" as const },
    { label: t("contact"), href: ROUTES.CONTACT, type: "link" as const },
  ];

  return (
    <header
      role="banner"
      className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 flex-shrink-0 min-w-0 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            aria-label="Go to home page"
          >
            <Logo
              height={40}
              width={160}
              className="h-4 sm:h-5 md:h-6 lg:h-8 w-16 sm:w-20 md:w-24 lg:w-32 max-w-full"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-4 lg:gap-5 ml-6 lg:ml-8 mr-8 lg:mr-12"
          >
            {navItems.map((item) => {
              const isActive = item.href ? pathname === item.href : false;
              return item.type === "anchor" ? (
                <button
                  key={item.label}
                  onClick={() => handleAnchorNavigation(item.section)}
                  className="text-base font-medium text-gray-700 hover:text-primary-DEFAULT focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2 transition-all duration-100 cursor-pointer relative group whitespace-nowrap"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-DEFAULT transition-all duration-100 group-hover:w-full"></span>
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2 transition-all duration-100 cursor-pointer relative group ${
                    isActive
                      ? "text-primary-DEFAULT"
                      : "text-gray-700 hover:text-primary-DEFAULT"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-primary-DEFAULT transition-all duration-100 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 flex-shrink-0 ml-2 sm:ml-4 lg:ml-6">
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <button
              type="button"
              onClick={onStartAssessmentClick}
              className="bg-primary-DEFAULT text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium hover:bg-primary-dark hover:scale-[1.03] active:scale-100 focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 transition-all duration-100 cursor-pointer text-xs sm:text-sm md:text-base whitespace-nowrap"
              style={{ backgroundColor: "#00A876" }}
            >
              <span className="hidden sm:inline">{t("startAssessment")}</span>
              <span className="sm:hidden">{t("start")}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-gray-700 hover:text-primary-DEFAULT focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md transition-all duration-100 flex-shrink-0"
              aria-label={t("toggleMenu")}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
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
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-3">
              {navItems.map((item) =>
                item.type === "anchor" ? (
                  <button
                    key={item.label}
                    onClick={() => handleAnchorNavigation(item.section)}
                    className="text-left text-base font-medium text-gray-700 hover:text-primary-DEFAULT focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2.5 transition-all duration-100 cursor-pointer"
                  >
                    {item.label}
                  </button>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => handleNavLink(item.href)}
                    className={`text-left text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2.5 transition-all duration-100 cursor-pointer ${
                      pathname === item.href
                        ? "text-primary-DEFAULT"
                        : "text-gray-700 hover:text-primary-DEFAULT"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}

              <div className="sm:hidden px-4 py-2.5 border-t border-gray-100 mt-2 pt-4">
                <LanguageToggle />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
