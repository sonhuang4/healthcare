"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "../../i18n/routing";
import { Link } from "../../i18n/routing";
import { motion } from "framer-motion";
import MainHeader from "../components/MainHeader";
import Footer from "../components/Footer";
import ConsentModal from "../components/ConsentModal";
import { ROUTES } from "../constants";
import Button from "../components/ui/Button";
import StarRating from "../components/ui/StarRating";
import Accordion from "../components/ui/Accordion";
import { saveConsent, hasConsent } from "../lib/utils/consent";
import {
  AIPrecisionIcon,
  AvailabilityIcon,
  EvidenceBasedIcon,
} from "../components/icons/MedicalIcons";
import {
  CalmCareLogo,
  HealthFoundryLogo,
  NorthwindHealthLogo,
} from "../components/icons/CompanyLogos";

export default function Home() {
  const t = useTranslations();
  const tHome = useTranslations("home");
  const tCommon = useTranslations("common");
  const tFeatures = useTranslations("home.features");
  const tStats = useTranslations("home.stats.items");
  const tHow = useTranslations("home.howItWorks");
  const tFour = useTranslations("home.fourStep");
  const tTestimonials = useTranslations("home.testimonials");
  const tTeam = useTranslations("home.team");
  const tPartners = useTranslations("home.partners");
  const tConsentSection = useTranslations("home.consentSection");
  const tNewsletter = useTranslations("home.newsletter");

  const teamMembers = [
    {
      key: "hassan",
      photo: "/team/Dr_Hassan.png",
    },
    {
      key: "feysal",
      photo: "/team/Dr_Feysal.png",
    },
    {
      key: "muna",
      photo: "/team/Muna_Nuur.png",
    },
  ] as const;

  const partnerBenefitKeys = ["item1", "item2", "item3"] as const;
  const partnerUseCaseKeys = ["item1", "item2", "item3", "item4"] as const;
  const partnerStats = [
    { key: "hospitals", value: "30+" },
    { key: "wait", value: "28%" },
    { key: "adoption", value: "92%" },
    { key: "pathways", value: "150+" },
  ] as const;

  const consentAccordionItems = [
    {
      id: "no-diagnosis",
      key: "noDiagnosis",
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "higher-care",
      key: "higherCare",
      icon: (
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      id: "emergency",
      key: "emergency",
      icon: (
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      id: "medical-judgment",
      key: "judgment",
      icon: (
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ] as const;
  const [consent, setConsent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (hasConsent()) {
      setConsent(true);
    }
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Handle hash navigation when page loads with hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Remove the # symbol
      const id = hash.substring(1);
      // Small delay to ensure page is rendered
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
    }
  }, [scrollToSection]);

  const handleStart = () => {
    if (consent) {
      saveConsent();
      router.push(ROUTES.INPUT);
    }
  };

  const handleStartAssessmentClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowConsentModal(true);
  };

  const handleConsentGiven = () => {
    setConsent(true);
    setShowConsentModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-background-DEFAULT"
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-DEFAULT focus:text-white focus:rounded-lg focus:font-semibold"
      >
        {tCommon("skipToContent")}
      </a>
      <ConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConsent={handleConsentGiven}
      />
      <MainHeader onStartAssessmentClick={handleStartAssessmentClick} />

      {/* Hero Section - Dark Green Animated Background */}
      <section
        id="main-content"
        role="main"
        aria-label="Hero section"
        className="relative hero-animated-bg py-12 sm:py-16 md:py-20 lg:py-24"
      >
        {/* Pulsing center glow */}
        <div className="hero-pulse-glow"></div>

        {/* Flowing waves */}
        <div className="hero-wave"></div>
        <div className="hero-wave"></div>
        <div className="hero-wave"></div>

        {/* Floating data particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight sm:leading-tight md:leading-tight drop-shadow-lg">
              {tHome("hero.title")}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed sm:leading-relaxed px-4 drop-shadow-md">
              {tHome("hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleStartAssessmentClick}
                className="bg-primary-DEFAULT text-white px-8 py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-primary-dark hover:scale-[1.03] active:scale-100 focus:outline-none focus:ring-4 focus:ring-primary-soft focus:ring-offset-2 transition-all duration-100 cursor-pointer"
                style={{ backgroundColor: "#00A876" }}
              >
                {tHome("hero.startAssessment")}
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="bg-white text-primary-DEFAULT border-2 border-primary-DEFAULT px-8 py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-primary-soft hover:scale-[1.03] active:scale-100 focus:outline-none focus:ring-4 focus:ring-primary-soft focus:ring-offset-2 transition-all duration-100 cursor-pointer"
              >
                {tHome("hero.learnHow")}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-primary-DEFAULT shadow-md"
              >
                <span className="text-lg font-bold text-primary-DEFAULT">
                  CE
                </span>
                <span className="text-xs text-gray-600">Marked</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-primary-DEFAULT shadow-md"
              >
                <span className="text-sm font-semibold text-primary-DEFAULT">
                  GDPR
                </span>
                <span className="text-xs text-gray-600">Compliant</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-primary-DEFAULT shadow-md"
              >
                <span className="text-sm font-semibold text-primary-DEFAULT">
                  ISO
                </span>
                <span className="text-xs text-gray-600">27001</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-primary-DEFAULT shadow-md"
              >
                <span className="text-sm font-semibold text-primary-DEFAULT">
                  HIPAA
                </span>
                <span className="text-xs text-gray-600">Compliant</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center text-textPrimary mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {tFeatures("title")}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1: Precision AI */}
            <motion.div
              className="text-center bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-mobile-card hover:shadow-tech-glow hover:scale-[1.02] transition-all duration-200 border border-triageCard-border hover:border-primary-DEFAULT/30 relative overflow-hidden"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 40px rgba(0, 168, 118, 0.2)",
              }}
            >
              {/* Futuristic glow effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 pointer-events-none"
                whileHover={{ opacity: 1 }}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(0, 168, 118, 0.1) 0%, transparent 70%)",
                }}
              />
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center mb-6 relative z-10"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <AIPrecisionIcon className="w-16 h-16 sm:w-20 sm:h-20" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold text-textPrimary mb-3 relative z-10">
                {tFeatures("cards.precision.title")}
              </h3>
              <p className="text-sm sm:text-base text-textSecondary text-center leading-relaxed relative z-10">
                {tFeatures("cards.precision.description")}
              </p>
            </motion.div>

            {/* Feature 2: 24/7 Availability */}
            <motion.div
              className="text-center bg-primary-soft/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-mobile-card hover:shadow-tech-glow hover:scale-[1.02] transition-all duration-200 border border-triageCard-border hover:border-primary-DEFAULT/30 relative overflow-hidden"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 40px rgba(0, 168, 118, 0.2)",
              }}
            >
              {/* Futuristic glow effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 pointer-events-none"
                whileHover={{ opacity: 1 }}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(0, 168, 118, 0.1) 0%, transparent 70%)",
                }}
              />
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center mb-6 relative z-10"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <AvailabilityIcon className="w-16 h-16 sm:w-20 sm:h-20" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold text-textPrimary mb-3 relative z-10">
                {tFeatures("cards.availability.title")}
              </h3>
              <p className="text-sm sm:text-base text-textSecondary text-center leading-relaxed relative z-10">
                {tFeatures("cards.availability.description")}
              </p>
            </motion.div>

            {/* Feature 3: Professional and Evidence-Based */}
            <motion.div
              className="text-center bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-mobile-card hover:shadow-tech-glow hover:scale-[1.02] transition-all duration-200 border border-triageCard-border hover:border-primary-DEFAULT/30 relative overflow-hidden"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 40px rgba(0, 168, 118, 0.2)",
              }}
            >
              {/* Futuristic glow effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 pointer-events-none"
                whileHover={{ opacity: 1 }}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(0, 168, 118, 0.1) 0%, transparent 70%)",
                }}
              />
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center mb-6 relative z-10"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <EvidenceBasedIcon className="w-16 h-16 sm:w-20 sm:h-20" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold text-textPrimary mb-3 relative z-10">
                {tFeatures("cards.evidence.title")}
              </h3>
              <p className="text-sm sm:text-base text-textSecondary text-center leading-relaxed relative z-10">
                {tFeatures("cards.evidence.description")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-gradient-to-b from-primary-soft/20 to-background-DEFAULT py-12 sm:py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-primary-DEFAULT mb-12">
            {tHow("title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto relative">
            {/* Visual Flow Lines - Connecting the numbered circles */}
            {/* Enhanced futuristic flow lines from Step 1 to Step 3 */}
            <div
              className="hidden md:flex absolute top-[64px] left-0 right-0 pointer-events-none z-0"
              style={{ top: "calc(2rem + 2rem)" }}
            >
              <div className="flex-1"></div>
              {/* First flow line with glow and particles */}
              <motion.div
                className="w-[calc(33.333%-1.5rem)] h-[3px] relative overflow-visible"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Main line with gradient */}
                <div
                  className="absolute inset-0 h-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #006B4E 0%, #00A876 50%, #006B4E 100%)",
                    boxShadow:
                      "0 0 10px rgba(0, 168, 118, 0.5), 0 0 20px rgba(0, 168, 118, 0.3)",
                  }}
                />
                {/* Animated glow pulse */}
                <motion.div
                  className="absolute inset-0 h-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(0, 168, 118, 0.6) 50%, transparent 100%)",
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                {/* Animated particles */}
                {[0, 0.3, 0.6].map((delay, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                    style={{
                      background: "#00A876",
                      boxShadow: "0 0 8px rgba(0, 168, 118, 0.8)",
                    }}
                    initial={{ left: "0%", opacity: 0 }}
                    animate={{
                      left: ["0%", "100%"],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: delay,
                    }}
                  />
                ))}
                {/* Enhanced arrow with glow */}
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full"
                  animate={{
                    x: [0, 5, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className="w-0 h-0 border-l-[12px] border-l-[#00A876] border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(0, 168, 118, 0.8))",
                    }}
                  />
                </motion.div>
              </motion.div>
              <div className="flex-1"></div>
              {/* Second flow line with glow and particles */}
              <motion.div
                className="w-[calc(33.333%-1.5rem)] h-[3px] relative overflow-visible"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
              >
                {/* Main line with gradient */}
                <div
                  className="absolute inset-0 h-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #006B4E 0%, #00A876 50%, #006B4E 100%)",
                    boxShadow:
                      "0 0 10px rgba(0, 168, 118, 0.5), 0 0 20px rgba(0, 168, 118, 0.3)",
                  }}
                />
                {/* Animated glow pulse */}
                <motion.div
                  className="absolute inset-0 h-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(0, 168, 118, 0.6) 50%, transparent 100%)",
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.3,
                  }}
                />
                {/* Animated particles */}
                {[0, 0.3, 0.6].map((delay, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                    style={{
                      background: "#00A876",
                      boxShadow: "0 0 8px rgba(0, 168, 118, 0.8)",
                    }}
                    initial={{ left: "0%", opacity: 0 }}
                    animate={{
                      left: ["0%", "100%"],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: delay + 0.3,
                    }}
                  />
                ))}
                {/* Enhanced arrow with glow */}
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full"
                  animate={{
                    x: [0, 5, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <div
                    className="w-0 h-0 border-l-[12px] border-l-[#00A876] border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(0, 168, 118, 0.8))",
                    }}
                  />
                </motion.div>
              </motion.div>
              <div className="flex-1"></div>
            </div>

            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="text-center relative z-10 bg-white rounded-3xl p-6 sm:p-8 shadow-mobile-card border-2 border-primary-DEFAULT/30 hover:border-primary-DEFAULT w-full"
              >
                <motion.div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-DEFAULT border-4 border-primary-DEFAULT text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative z-20"
                  style={{
                    backgroundColor: "#00A876",
                    boxShadow:
                      "0 0 20px rgba(0, 168, 118, 0.5), 0 0 40px rgba(0, 168, 118, 0.3)",
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 20px rgba(0, 168, 118, 0.5), 0 0 40px rgba(0, 168, 118, 0.3)",
                      "0 0 30px rgba(0, 168, 118, 0.7), 0 0 60px rgba(0, 168, 118, 0.5)",
                      "0 0 20px rgba(0, 168, 118, 0.5), 0 0 40px rgba(0, 168, 118, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.span
                    className="drop-shadow-sm relative z-10"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    1
                  </motion.span>
                  {/* Pulsing ring effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary-DEFAULT"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold text-primary-DEFAULT mb-3">
                  {tHow("steps.describe.title")}
                </h3>
                <p className="text-sm sm:text-base text-textSecondary text-center leading-relaxed">
                  {tHow("steps.describe.description")}
                </p>
              </motion.div>
              <div className="md:hidden flex justify-center w-full">
                <div className="w-1 h-10 bg-[#006B4E] rounded-full mt-4 mb-4"></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center relative z-10 bg-white rounded-3xl p-6 sm:p-8 shadow-mobile-card border-2 border-primary-DEFAULT/30 hover:border-primary-DEFAULT w-full"
              >
                <motion.div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-DEFAULT border-4 border-primary-DEFAULT text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative z-20"
                  style={{
                    backgroundColor: "#00A876",
                    boxShadow:
                      "0 0 20px rgba(0, 168, 118, 0.5), 0 0 40px rgba(0, 168, 118, 0.3)",
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 20px rgba(0, 168, 118, 0.5), 0 0 40px rgba(0, 168, 118, 0.3)",
                      "0 0 30px rgba(0, 168, 118, 0.7), 0 0 60px rgba(0, 168, 118, 0.5)",
                      "0 0 20px rgba(0, 168, 118, 0.5), 0 0 40px rgba(0, 168, 118, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <motion.span
                    className="drop-shadow-sm relative z-10"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    2
                  </motion.span>
                  {/* Pulsing ring effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary-DEFAULT"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.5,
                    }}
                  />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold text-primary-DEFAULT mb-3">
                  {tHow("steps.analyze.title")}
                </h3>
                <p className="text-sm sm:text-base text-textSecondary text-center leading-relaxed">
                  {tHow("steps.analyze.description")}
                </p>
              </motion.div>
              <div className="md:hidden flex justify-center w-full relative">
                {/* Enhanced mobile vertical line with glow */}
                <motion.div
                  className="w-1 h-10 rounded-full relative overflow-visible"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background:
                        "linear-gradient(180deg, #006B4E 0%, #00A876 50%, #006B4E 100%)",
                      boxShadow: "0 0 8px rgba(0, 168, 118, 0.5)",
                    }}
                  />
                  {/* Animated glow pulse */}
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(0, 168, 118, 0.6) 50%, transparent 100%)",
                    }}
                    animate={{
                      y: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.3,
                    }}
                  />
                  {/* Animated particle */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                    style={{
                      background: "#00A876",
                      boxShadow: "0 0 6px rgba(0, 168, 118, 0.8)",
                    }}
                    initial={{ top: "0%", opacity: 0 }}
                    animate={{
                      top: ["0%", "100%"],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.3,
                    }}
                  />
                </motion.div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center relative z-10 bg-white rounded-3xl p-6 sm:p-8 shadow-mobile-card border-2 border-primary-DEFAULT/30 hover:border-primary-DEFAULT w-full"
              >
                <motion.div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-DEFAULT border-4 border-primary-DEFAULT text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative z-20"
                  style={{
                    backgroundColor: "#00A876",
                    boxShadow:
                      "0 0 20px rgba(0, 168, 118, 0.5), 0 0 40px rgba(0, 168, 118, 0.3)",
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 20px rgba(0, 168, 118, 0.5), 0 0 40px rgba(0, 168, 118, 0.3)",
                      "0 0 30px rgba(0, 168, 118, 0.7), 0 0 60px rgba(0, 168, 118, 0.5)",
                      "0 0 20px rgba(0, 168, 118, 0.5), 0 0 40px rgba(0, 168, 118, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <motion.span
                    className="drop-shadow-sm relative z-10"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    3
                  </motion.span>
                  {/* Pulsing ring effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary-DEFAULT"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 1,
                    }}
                  />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold text-primary-DEFAULT mb-3">
                  {tHow("steps.recommend.title")}
                </h3>
                <p className="text-sm sm:text-base text-textSecondary text-center leading-relaxed">
                  {tHow("steps.recommend.description")}
                </p>
              </motion.div>
            </div>

            {/* CTA Button */}
            <div className="col-span-1 md:col-span-3 flex justify-center mt-8">
              <button
                type="button"
                onClick={handleStartAssessmentClick}
                className="bg-primary-DEFAULT text-white px-8 py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-primary-dark hover:scale-[1.03] active:scale-100 focus:outline-none focus:ring-4 focus:ring-primary-soft focus:ring-offset-2 transition-all duration-100 cursor-pointer"
                style={{ backgroundColor: "#00A876" }}
              >
                {tHow("cta")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Four-Step Model Section */}
      <section
        id="four-step-model"
        className="bg-white py-12 sm:py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-textPrimary mb-3">
            {tFour("title")}
          </h2>
          <p className="text-center text-textSecondary mb-10 sm:mb-12 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
            {tFour("subtitle")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {/* Self-Care Card */}
            <div className="bg-triageCard-selfCare border-l-4 border-primary-DEFAULT p-5 sm:p-6 rounded-3xl relative shadow-mobile-card border border-triageCard-border text-center hover:shadow-tech-glow-sm transition-all duration-200">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-tech-glow-sm mx-auto mb-4"
                style={{ backgroundColor: "#00A876" }}
              ></div>
              <h3 className="font-bold text-primary-DEFAULT mb-2 text-base sm:text-lg">
                {tFour("cards.selfCare.title")}
              </h3>
              <p className="text-xs sm:text-sm text-primary-DEFAULT leading-relaxed">
                {tFour("cards.selfCare.description")}
              </p>
            </div>

            {/* Primary Care Card */}
            <div className="bg-triageCard-primaryCare border-l-4 border-warning-DEFAULT p-5 sm:p-6 rounded-3xl relative shadow-mobile-card border border-triageCard-border text-center hover:shadow-tech-glow-sm transition-all duration-200">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-md mx-auto mb-4"
                style={{ backgroundColor: "#FACC15" }}
              ></div>
              <h3 className="font-bold text-warning-DEFAULT mb-2 text-base sm:text-lg">
                {tFour("cards.primaryCare.title")}
              </h3>
              <p className="text-xs sm:text-sm text-warning-DEFAULT leading-relaxed">
                {tFour("cards.primaryCare.description")}
              </p>
            </div>

            {/* Semi-Emergency Card */}
            <div className="bg-triageCard-semiEmergency border-l-4 border-risk-DEFAULT p-5 sm:p-6 rounded-3xl relative shadow-mobile-card border border-triageCard-border text-center hover:shadow-tech-glow-sm transition-all duration-200">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-md mx-auto mb-4"
                style={{ backgroundColor: "#FB923C" }}
              ></div>
              <h3 className="font-bold text-risk-DEFAULT mb-2 text-base sm:text-lg">
                {tFour("cards.semiEmergency.title")}
              </h3>
              <p className="text-xs sm:text-sm text-risk-DEFAULT leading-relaxed">
                {tFour("cards.semiEmergency.description")}
              </p>
            </div>

            {/* Emergency Card */}
            <div className="bg-triageCard-emergency border-l-4 border-critical-DEFAULT p-5 sm:p-6 rounded-3xl relative shadow-mobile-card border border-triageCard-border text-center hover:shadow-tech-glow-sm transition-all duration-200">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-md mx-auto mb-4"
                style={{ backgroundColor: "#EF4444" }}
              ></div>
              <h3 className="font-bold text-critical-DEFAULT mb-2 text-base sm:text-lg">
                {tFour("cards.emergency.title")}
              </h3>
              <p className="text-xs sm:text-sm text-critical-DEFAULT leading-relaxed">
                {tFour("cards.emergency.description")}
              </p>
            </div>
          </div>

          {/* More about this model link */}
          <div className="text-center mt-8">
            <button
              onClick={() => scrollToSection("consent-section")}
              className="text-primary-DEFAULT hover:text-primary-dark font-medium text-sm underline-offset-4 hover:underline transition-all duration-200"
            >
              {tHome("modelLink")}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative bg-gradient-to-b from-primary-soft/20 to-background-DEFAULT py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Testimonials Hero */}
          <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-DEFAULT mb-4 sm:mb-6 leading-tight">
              {tTestimonials("title")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-textSecondary leading-relaxed">
              {tTestimonials("subtitle")}
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-mobile-card border-2 border-primary-DEFAULT/30 hover:border-primary-DEFAULT p-6 sm:p-8 hover:shadow-tech-glow-sm"
            >
              {/* Avatar and Quote Icon */}
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-md"
                    style={{ backgroundColor: "#00A876" }}
                  >
                    LS
                  </div>
                </div>
                <div className="flex-1">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-primary-DEFAULT"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10z" />
                  </svg>
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-4">
                <StarRating rating={5} size="md" showNumber={false} />
              </div>

              {/* Testimonial Text */}
              <p className="text-textSecondary text-sm sm:text-base leading-relaxed mb-5">
                {tTestimonials("cards.laura.quote")}
              </p>

              {/* Author Info */}
              <div className="border-t border-primary-DEFAULT/20 pt-4">
                <p className="font-bold text-primary-DEFAULT text-sm sm:text-base mb-1">
                  {tTestimonials("cards.laura.name")}
                </p>
                <p className="text-textSecondary text-xs sm:text-sm mb-3">
                  {tTestimonials("cards.laura.role")}
                </p>
                {/* Company Logo */}
                <div className="flex items-center gap-2">
                  <CalmCareLogo className="w-20 h-auto" />
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white rounded-3xl shadow-mobile-card border-2 border-primary-DEFAULT/30 hover:border-primary-DEFAULT p-6 sm:p-8 hover:shadow-tech-glow-sm"
            >
              {/* Avatar and Quote Icon */}
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-md"
                    style={{ backgroundColor: "#00A876" }}
                  >
                    MO
                  </div>
                </div>
                <div className="flex-1">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-primary-DEFAULT"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10z" />
                  </svg>
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-4">
                <StarRating rating={5} size="md" showNumber={false} />
              </div>

              {/* Testimonial Text */}
              <p className="text-textSecondary text-sm sm:text-base leading-relaxed mb-5">
                {tTestimonials("cards.marcus.quote")}
              </p>

              {/* Author Info */}
              <div className="border-t border-primary-DEFAULT/20 pt-4">
                <p className="font-bold text-primary-DEFAULT text-sm sm:text-base mb-1">
                  {tTestimonials("cards.marcus.name")}
                </p>
                <p className="text-textSecondary text-xs sm:text-sm mb-3">
                  {tTestimonials("cards.marcus.role")}
                </p>
                {/* Company Logo */}
                <div className="flex items-center gap-2">
                  <HealthFoundryLogo className="w-28 h-auto" />
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white rounded-3xl shadow-mobile-card border-2 border-primary-DEFAULT/30 hover:border-primary-DEFAULT p-6 sm:p-8 hover:shadow-tech-glow-sm"
            >
              {/* Avatar and Quote Icon */}
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-md"
                    style={{ backgroundColor: "#00A876" }}
                  >
                    PN
                  </div>
                </div>
                <div className="flex-1">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-primary-DEFAULT"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10z" />
                  </svg>
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-4">
                <StarRating rating={5} size="md" showNumber={false} />
              </div>

              {/* Testimonial Text */}
              <p className="text-textSecondary text-sm sm:text-base leading-relaxed mb-5">
                {tTestimonials("cards.priya.quote")}
              </p>

              {/* Author Info */}
              <div className="border-t border-primary-DEFAULT/20 pt-4">
                <p className="font-bold text-primary-DEFAULT text-sm sm:text-base mb-1">
                  {tTestimonials("cards.priya.name")}
                </p>
                <p className="text-textSecondary text-xs sm:text-sm mb-3">
                  {tTestimonials("cards.priya.role")}
                </p>
                {/* Company Logo */}
                <div className="flex items-center gap-2">
                  <NorthwindHealthLogo className="w-32 h-auto" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        id="team"
        className="emerald-gradient-bg text-white py-16 sm:py-20 md:py-24 border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-[0.2em] text-primary-light uppercase mb-3">
              {tTeam("label")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {tTeam("title")}
            </h2>
            <p className="text-white/80 max-w-3xl mx-auto">
              {tTeam("subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-3xl shadow-mobile-card border border-primary-DEFAULT/20 p-6 flex flex-col gap-4 hover:shadow-tech-glow-sm hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-white">
                  <img
                    src={member.photo}
                    alt={tTeam(`members.${member.key}.name`)}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-primary-dark font-semibold">
                    {tTeam(`members.${member.key}.title`)}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">
                    {tTeam(`members.${member.key}.name`)}
                  </h3>
                  <p className="text-sm text-textSecondary mt-3 leading-relaxed">
                    {tTeam(`members.${member.key}.bio`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Sales Section */}
      <section
        id="partners"
        className="bg-white py-16 sm:py-20 md:py-24 border-t border-gray-100"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-primary-dark uppercase mb-3">
                {tPartners("label")}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-5">
                {tPartners("title")}
              </h2>
              <p className="text-textSecondary text-base sm:text-lg mb-6">
                {tPartners("description")}
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tPartners("whyTitle")}
                  </h3>
                  <ul className="space-y-2 text-textSecondary text-sm sm:text-base">
                    {partnerBenefitKeys.map((key) => (
                      <li key={key} className="flex items-start gap-2">
                        <span className="text-primary-DEFAULT mt-1">•</span>
                        <span>{tPartners(`whyList.${key}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tPartners("useCasesTitle")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {partnerUseCaseKeys.map((key) => (
                      <div
                        key={key}
                        className="bg-primary-soft border border-primary-DEFAULT/20 rounded-2xl px-4 py-3 text-sm font-medium text-primary-dark"
                      >
                        {tPartners(`useCases.${key}`)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <Link href={ROUTES.CONTACT}>
                    <Button size="lg" className="w-full sm:w-auto">
                      {tPartners("cta")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="emerald-gradient-bg rounded-3xl p-8 md:p-10 text-white shadow-tech-glow-lg border border-white/10"
            >
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-primary-light/80 mb-2">
                    {tPartners("whatTitle")}
                  </p>
                  <p className="text-lg leading-relaxed text-primary-light">
                    {tPartners("whatDescription")}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {partnerStats.map((stat) => (
                    <div
                      key={stat.key}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
                    >
                      <p className="text-2xl font-extrabold text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-primary-light/80">
                        {tPartners(`stats.${stat.key}`)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-primary-light/20 pt-6">
                  <p className="text-sm text-primary-light/90 mb-4">
                    {tPartners("quote.text")}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {tPartners("quote.author")}, {tPartners("quote.role")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Consent Section */}
      <section
        id="consent-section"
        className="bg-background-DEFAULT py-12 sm:py-16 md:py-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-mobile-card border border-triageCard-border">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              {tConsentSection("title")}
            </h2>

            {/* Important to Know - Accordion */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-4">
                <svg
                  className="h-6 w-6 text-amber-500 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-base sm:text-lg font-semibold text-amber-900">
                  {tConsentSection("important")}
                </h3>
              </div>
              <Accordion
                items={consentAccordionItems.map((item) => ({
                  id: item.id,
                  title: tConsentSection(`items.${item.key}.title`),
                  content: tConsentSection(`items.${item.key}.content`),
                  icon: item.icon,
                }))}
                allowMultiple={true}
                className="mb-4"
              />
            </div>

            {/* Consent Checkbox and Button Group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-start space-x-4 flex-1">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-6 w-6 text-primary-DEFAULT border-triageCard-border rounded focus:ring-primary-DEFAULT cursor-pointer hover:border-primary-DEFAULT hover:ring-2 hover:ring-primary-soft transition-all duration-200"
                />
                <label
                  htmlFor="consent"
                  className="text-base text-gray-700 cursor-pointer"
                >
                  {tConsentSection("checkbox")}
                </label>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStart}
                disabled={!consent}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 ${
                  consent
                    ? "bg-primary-DEFAULT text-white hover:bg-primary-dark hover:scale-[1.03] active:scale-100 focus:outline-none focus:ring-4 focus:ring-primary-soft focus:ring-offset-2 cursor-pointer transition-all duration-100"
                    : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                }`}
                style={consent ? { backgroundColor: "#00A876" } : {}}
              >
                {tConsentSection("button")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section - Above Footer */}
      <section className="bg-background-DEFAULT border-t border-gray-200 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center mb-6">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {tNewsletter("title")}
          </h3>
          <p className="text-base sm:text-lg text-gray-600">
            {tNewsletter("subPrefix")}{" "}
            <span className="text-primary-DEFAULT underline underline-offset-4 decoration-2">
              {tNewsletter("subHighlight")}
            </span>
          </p>
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="relative bg-white border border-gray-300 rounded-2xl p-1 overflow-hidden shadow-mobile-card">
            <form className="relative flex flex-row">
              <input
                type="email"
                placeholder={tNewsletter("placeholder")}
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm sm:text-base rounded-l-2xl"
              />
              <button
                type="submit"
                className="px-4 sm:px-8 py-3 sm:py-4 bg-primary-DEFAULT text-white font-semibold rounded-r-2xl hover:bg-primary-dark hover:scale-[1.02] active:scale-100 transition-all duration-100 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2"
                style={{ backgroundColor: "#00A876" }}
              >
                <span className="hidden sm:inline">
                  {tNewsletter("buttonFull")}
                </span>
                <span className="sm:hidden">{tNewsletter("buttonShort")}</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
