"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ROUTES } from "../constants";
import ConsentModal from "./ConsentModal";
import Logo from "./Logo";
import { hasConsent } from "../lib/utils/consent";

export default function Footer() {
  const router = useRouter();
  const tFooter = useTranslations("home.footer");
  const tNav = useTranslations("nav");

  const pageLinks = [
    { href: ROUTES.ABOUT, label: "about" },
    { href: ROUTES.RESOURCES, label: "resources" },
    { href: ROUTES.CONTACT, label: "contact" },
  ] as const;

  const anchorLinks = [
    { href: `${ROUTES.HOME}#features`, label: "features" },
    { href: `${ROUTES.HOME}#how-it-works`, label: "howItWorks" },
  ] as const;

  const [showConsentModal, setShowConsentModal] = useState(false);
  const handleSymptomCheckerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasConsent()) {
      router.push(ROUTES.INPUT);
    } else {
      setShowConsentModal(true);
    }
  };

  const handleConsentClose = () => {
    setShowConsentModal(false);
  };

  const handleConsentGiven = () => {
    setShowConsentModal(false);
  };

  return (
    <>
      <ConsentModal
        isOpen={showConsentModal}
        onClose={handleConsentClose}
        onConsent={handleConsentGiven}
      />
      <footer className="emerald-gradient-bg border-t border-white/10 text-white relative overflow-hidden">
        {/* Floating particles overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="particle"></div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Main Footer Content - 4 Columns */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
            {/* Column 1 - TriageX Information */}
            <div className="flex flex-col items-center md:items-start lg:items-center text-center md:text-left lg:text-center col-span-2 md:col-span-1">
              <div className="mb-3 sm:mb-4 footer-logo-wrapper">
                <Logo
                  height={32}
                  width={112}
                  className="h-5 sm:h-6 md:h-8 w-auto mb-2 sm:mb-4"
                  noShadow={true}
                />
              </div>
              {/* Hide description on mobile */}
              <p className="hidden md:block text-sm mb-4 sm:mb-6 leading-relaxed text-white/80">
                {tFooter("description")}
              </p>
              {/* Social Media Links */}
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2 - Page Links */}
            <div className="flex flex-col items-center md:items-start lg:items-center text-center md:text-left lg:text-center">
              <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base text-white">
                {tFooter("columns.pages")}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
                {pageLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-primary-light transition-colors duration-100"
                    >
                      {tNav(item.label)}
                    </Link>
                  </li>
                ))}
                {anchorLinks.map((item) => (
                  <li key={item.label} className="hidden sm:block">
                    <a
                      href={item.href}
                      className="hover:text-primary-light transition-colors duration-100"
                    >
                      {tNav(item.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Link (Legal) */}
            <div className="flex flex-col items-center md:items-start lg:items-center text-center md:text-left lg:text-center">
              <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base text-white">
                {tFooter("columns.links")}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-light transition-colors duration-100"
                  >
                    {tFooter("links.terms")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-light transition-colors duration-100"
                  >
                    {tFooter("links.privacy")}
                  </a>
                </li>
                <li className="hidden md:block">
                  <a
                    href="#"
                    className="hover:text-primary-light transition-colors duration-100"
                  >
                    {tFooter("links.use")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - Contact */}
            <div className="flex flex-col items-center md:items-start lg:items-center text-center md:text-left lg:text-center col-span-2 md:col-span-1">
              <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base text-white">
                {tFooter("columns.contact")}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-primary-light mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="break-words">
                    {tFooter("contact.address")}
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-primary-light flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href="tel:0123456789101"
                    className="hover:text-primary-light transition-colors duration-200 break-all"
                  >
                    <span className="hidden sm:inline">
                      {tFooter("contact.phoneFull")}
                    </span>
                    <span className="sm:hidden">
                      {tFooter("contact.phoneShort")}
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-primary-light flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:contact@triagx.com"
                    className="hover:text-primary-light transition-colors duration-200 break-all text-xs sm:text-sm"
                  >
                    {tFooter("contact.email")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
              {/* Compliance Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/20 text-white">
                  {tFooter("badges.hipaa")}
                </span>
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/20 text-white">
                  {tFooter("badges.gdpr")}
                </span>
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/20 text-white">
                  {tFooter("badges.iso")}
                </span>
              </div>

              {/* Separator */}
              <div className="hidden sm:block w-px h-4 bg-white/20"></div>

              {/* Copyright */}
              <span className="text-xs sm:text-sm text-white/80">
                {tFooter("copyright")}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
