"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../i18n/routing";
import { ROUTES } from "../constants";

const LOCALE_PREFIX_REGEX = /^\/(en|sv)(\/|$)/;

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const t = useTranslations("breadcrumbs");

  const normalizedPath = (() => {
    if (!pathname) return ROUTES.HOME;
    if (LOCALE_PREFIX_REGEX.test(pathname)) {
      const stripped = pathname.replace(LOCALE_PREFIX_REGEX, "/");
      return stripped === "" ? ROUTES.HOME : stripped;
    }
    return pathname;
  })();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t("home"), href: ROUTES.HOME },
    ];

    if (normalizedPath === ROUTES.INPUT) {
      breadcrumbs.push({ label: t("input"), href: ROUTES.INPUT });
    } else if (normalizedPath === ROUTES.PROCESSING) {
      breadcrumbs.push({ label: t("input"), href: ROUTES.INPUT });
      breadcrumbs.push({ label: t("analyzing"), href: ROUTES.PROCESSING });
    } else if (normalizedPath === ROUTES.RESULTS) {
      breadcrumbs.push({ label: t("input"), href: ROUTES.INPUT });
      breadcrumbs.push({ label: t("analyzing"), href: ROUTES.PROCESSING });
      breadcrumbs.push({ label: t("results") });
    } else if (normalizedPath === ROUTES.ABOUT) {
      breadcrumbs.push({ label: t("about"), href: ROUTES.ABOUT });
    } else if (normalizedPath === ROUTES.RESOURCES) {
      breadcrumbs.push({ label: t("resources"), href: ROUTES.RESOURCES });
    } else if (normalizedPath === ROUTES.CONTACT) {
      breadcrumbs.push({ label: t("contact"), href: ROUTES.CONTACT });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav
      className="flex items-center gap-2 text-sm text-gray-600 mb-4"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {item.href && index < breadcrumbs.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-primary-DEFAULT transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
