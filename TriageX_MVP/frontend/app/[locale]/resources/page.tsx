"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Footer from "../../components/Footer";
import ConsentModal from "../../components/ConsentModal";
import MainHeader from "../../components/MainHeader";
import { ROUTES } from "../../constants";
import { hasConsent } from "../../lib/utils/consent";

export default function Resources() {
  const router = useRouter();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const t = useTranslations("resources");

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
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 leading-relaxed drop-shadow-md">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
            {/* Column 1: Implementation Guides */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-textPrimary mb-3 sm:mb-4">
                {t("columns.implementation.title")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-textSecondary mb-6 sm:mb-8 leading-relaxed">
                {t("columns.implementation.subtitle")}
              </p>
              <div className="space-y-3 sm:space-y-4">
                {/* Resource Card 1 */}
                <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
                  <h3 className="font-semibold text-textPrimary mb-2 text-sm sm:text-base md:text-lg">
                    {t("columns.implementation.cards.clinicalQuickStart.title")}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                    {t(
                      "columns.implementation.cards.clinicalQuickStart.description"
                    )}
                  </p>
                </div>

                {/* Resource Card 2 */}
                <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
                  <h3 className="font-semibold text-textPrimary mb-2 text-sm sm:text-base md:text-lg">
                    {t("columns.implementation.cards.apiSheet.title")}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                    {t("columns.implementation.cards.apiSheet.description")}
                  </p>
                </div>

                {/* Resource Card 3 */}
                <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
                  <h3 className="font-semibold text-textPrimary mb-2 text-sm sm:text-base md:text-lg">
                    {t("columns.implementation.cards.mdrChecklist.title")}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                    {t("columns.implementation.cards.mdrChecklist.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Product Sheets */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-textPrimary mb-3 sm:mb-4">
                {t("columns.product.title")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-textSecondary mb-6 sm:mb-8 leading-relaxed">
                {t("columns.product.subtitle")}
              </p>
              <div className="space-y-3 sm:space-y-4">
                {/* Resource Card 1 */}
                <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
                  <h3 className="font-semibold text-textPrimary mb-2 text-sm sm:text-base md:text-lg">
                    {t("columns.product.cards.investor.title")}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                    {t("columns.product.cards.investor.description")}
                  </p>
                </div>

                {/* Resource Card 2 */}
                <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
                  <h3 className="font-semibold text-textPrimary mb-2 text-sm sm:text-base md:text-lg">
                    {t("columns.product.cards.workflow.title")}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                    {t("columns.product.cards.workflow.description")}
                  </p>
                </div>

                {/* Resource Card 3 */}
                <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
                  <h3 className="font-semibold text-textPrimary mb-2 text-sm sm:text-base md:text-lg">
                    {t("columns.product.cards.tokens.title")}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                    {t("columns.product.cards.tokens.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Thought Leadership */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-textPrimary mb-3 sm:mb-4">
                {t("columns.thought.title")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-textSecondary mb-6 sm:mb-8 leading-relaxed">
                {t("columns.thought.subtitle")}
              </p>
              <div className="space-y-3 sm:space-y-4">
                {/* Resource Card 1 */}
                <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
                  <h3 className="font-semibold text-textPrimary mb-2 text-sm sm:text-base md:text-lg">
                    {t("columns.thought.cards.hybrid.title")}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                    {t("columns.thought.cards.hybrid.description")}
                  </p>
                </div>

                {/* Resource Card 2 */}
                <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
                  <h3 className="font-semibold text-textPrimary mb-2 text-sm sm:text-base md:text-lg">
                    {t("columns.thought.cards.literacy.title")}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                    {t("columns.thought.cards.literacy.description")}
                  </p>
                </div>

                {/* Resource Card 3 */}
                <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-triageCard-border shadow-mobile-card hover:shadow-tech-glow-sm transition-all duration-200 text-center">
                  <h3 className="font-semibold text-textPrimary mb-2 text-sm sm:text-base md:text-lg">
                    {t("columns.thought.cards.governance.title")}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
                    {t("columns.thought.cards.governance.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
