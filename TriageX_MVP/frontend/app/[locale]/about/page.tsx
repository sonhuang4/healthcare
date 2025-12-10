"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Footer from "../../components/Footer";
import ConsentModal from "../../components/ConsentModal";
import MainHeader from "../../components/MainHeader";
import { ROUTES } from "../../constants";
import { hasConsent } from "../../lib/utils/consent";

export default function About() {
  const router = useRouter();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const t = useTranslations("about");

  const handleStartClick = () => {
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
    <div className="min-h-screen bg-white">
      <ConsentModal
        isOpen={showConsentModal}
        onClose={handleConsentClose}
        onConsent={handleConsentGiven}
      />
      <MainHeader onStartAssessmentClick={handleStartClick} />

      {/* Hero Section */}
      <section className="relative hero-animated-bg text-white py-16 sm:py-20 md:py-24 lg:py-32 pb-20 sm:pb-24 md:pb-32 lg:pb-40 overflow-hidden">
        <div className="hero-pulse-glow"></div>
        <div className="hero-wave"></div>
        <div className="hero-wave"></div>
        <div className="hero-wave"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="particle"></div>
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight drop-shadow-lg">
              {t("hero.title")}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 sm:mb-12 leading-relaxed drop-shadow-md">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-soft flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-primary-DEFAULT"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-textPrimary mb-5 sm:mb-6 text-center">
                {t("mission.title")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-textSecondary text-center leading-relaxed">
                {t("mission.description")}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-soft flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-primary-DEFAULT"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-textPrimary mb-5 sm:mb-6 text-center">
                {t("vision.title")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-textSecondary text-center leading-relaxed">
                {t("vision.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-background-DEFAULT py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary mb-4 sm:mb-5">
              {t("team.title")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
              {t("team.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Team Card 1 */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-soft mx-auto mb-5 sm:mb-6 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-primary-DEFAULT"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-textPrimary mb-4">
                {t("team.cards.clinical.title")}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                {t("team.cards.clinical.description")}
              </p>
            </div>

            {/* Team Card 2 */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-soft mx-auto mb-5 sm:mb-6 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-primary-DEFAULT"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-textPrimary mb-4">
                {t("team.cards.ai.title")}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                {t("team.cards.ai.description")}
              </p>
            </div>

            {/* Team Card 3 */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-soft mx-auto mb-5 sm:mb-6 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-primary-DEFAULT"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-textPrimary mb-4">
                {t("team.cards.impact.title")}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                {t("team.cards.impact.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Trust Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-6">
          <div className="bg-primary-soft/30 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-triageCard-border shadow-mobile-card">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary mb-5 sm:mb-6">
                {t("compliance.title")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-textSecondary mb-6 sm:mb-8 leading-relaxed">
                {t("compliance.description")}
              </p>

              {/* Compliance Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-white rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-triageCard-border shadow-mobile-card">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-primary-DEFAULT"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="font-semibold text-textPrimary text-sm">
                        {t("compliance.badges.hipaa.title")}
                      </p>
                      <p className="text-textSecondary text-xs">
                        {t("compliance.badges.hipaa.subtitle")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg px-6 py-4 border border-triageCard-border shadow-sm">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-primary-DEFAULT"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="font-semibold text-textPrimary text-sm">
                        {t("compliance.badges.gdpr.title")}
                      </p>
                      <p className="text-textSecondary text-xs">
                        {t("compliance.badges.gdpr.subtitle")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg px-6 py-4 border border-triageCard-border shadow-sm">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-primary-DEFAULT"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="font-semibold text-textPrimary text-sm">
                        {t("compliance.badges.iso.title")}
                      </p>
                      <p className="text-textSecondary text-xs">
                        {t("compliance.badges.iso.subtitle")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg px-6 py-4 border border-triageCard-border shadow-sm">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-primary-DEFAULT"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="font-semibold text-textPrimary text-sm">
                        {t("compliance.badges.mdr.title")}
                      </p>
                      <p className="text-textSecondary text-xs">
                        {t("compliance.badges.mdr.subtitle")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                {t("compliance.footer")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background-DEFAULT py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary mb-4 sm:mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-textSecondary mb-6 sm:mb-8 leading-relaxed">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartClick}
              className="bg-primary-DEFAULT text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg shadow-md hover:bg-primary-dark hover:scale-[1.03] active:scale-100 focus:outline-none focus:ring-4 focus:ring-primary-soft focus:ring-offset-2 transition-all duration-100 cursor-pointer w-full sm:w-auto"
              style={{ backgroundColor: "#00A876" }}
            >
              <span className="hidden sm:inline">{t("cta.primaryButton")}</span>
              <span className="sm:hidden">{t("cta.primaryButtonMobile")}</span>
            </button>
            <Link
              href={ROUTES.CONTACT}
              className="bg-white text-primary-DEFAULT border-2 border-primary-DEFAULT px-8 py-4 rounded-xl font-semibold text-base sm:text-lg shadow-sm hover:bg-primary-soft hover:scale-[1.03] active:scale-100 focus:outline-none focus:ring-4 focus:ring-primary-soft focus:ring-offset-2 transition-all duration-200 cursor-pointer w-full sm:w-auto text-center"
            >
              {t("cta.secondaryButton")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
