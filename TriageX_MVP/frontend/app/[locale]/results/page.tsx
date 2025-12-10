"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import LanguageToggle from "../../components/LanguageToggle";
import Footer from "../../components/Footer";
import Logo from "../../components/Logo";
import Breadcrumbs from "../../components/Breadcrumbs";
import { TriageResult } from "../../types";
import { ROUTES, TRIAGE_LEVELS } from "../../constants";
import Button from "../../components/ui/Button";
import { API_ENDPOINTS } from "../../lib/api/client";
import Toast from "../../components/ui/Toast";
import { generateCacheKey, getCached, setCached } from "../../lib/cache";

export default function Results() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [progress, setProgress] = useState(66);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tResults = useTranslations("results");

  useEffect(() => {
    // Animate progress bar from 66% to 100% (Step 3 of 3)
    setProgress(66); // Start from 66% (Step 2 completion)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Get form data from sessionStorage
    if (typeof window === "undefined") return;

    const formDataStr = sessionStorage.getItem("formData");
    if (!formDataStr) {
      router.push(ROUTES.INPUT);
      return;
    }

    // Call API to analyze
    const analyzeHealth = async () => {
      try {
        const formData = JSON.parse(formDataStr);
        const payload = {
          symptom: formData.symptom,
          heart_rate: formData.heart_rate
            ? parseInt(formData.heart_rate)
            : null,
          temperature: formData.temperature
            ? parseFloat(formData.temperature)
            : null,
          spo2: formData.spo2 ? parseInt(formData.spo2) : null,
          blood_pressure: formData.blood_pressure || null,
          // Include all form data for logging
          age: formData.age || null,
          gender: formData.gender || null,
          respiratory_rate: formData.respiratory_rate || null,
          level_of_consciousness: formData.level_of_consciousness || null,
          duration: formData.duration || null,
          onset: formData.onset || null,
          pain_level: formData.pain_level || null,
          leg_redness: formData.leg_redness || null,
          leg_warmth: formData.leg_warmth || null,
          leg_duration: formData.leg_duration || null,
          head_dizziness: formData.head_dizziness || null,
          head_vomiting: formData.head_vomiting || null,
          head_loss_consciousness: formData.head_loss_consciousness || null,
          chest_radiation: formData.chest_radiation || null,
          chest_shortness_breath: formData.chest_shortness_breath || null,
          chest_nausea: formData.chest_nausea || null,
          // Medical history
          has_medical_conditions:
            formData.has_medical_conditions === "yes"
              ? true
              : formData.has_medical_conditions === "no"
              ? false
              : null,
          medical_conditions:
            formData.medical_conditions?.length > 0
              ? formData.medical_conditions
              : null,
          medical_conditions_other: formData.medical_conditions_other || null,
          has_medications:
            formData.has_medications === "yes"
              ? true
              : formData.has_medications === "no"
              ? false
              : null,
          medications:
            formData.medications?.length > 0 ? formData.medications : null,
          medications_other: formData.medications_other || null,
          is_pregnant:
            formData.is_pregnant === "yes"
              ? true
              : formData.is_pregnant === "no"
              ? false
              : null,
          pregnancy_trimester: formData.pregnancy_trimester || null,
          pregnancy_weeks:
            formData.pregnancy_weeks && formData.pregnancy_weeks.trim()
              ? parseInt(formData.pregnancy_weeks)
              : null,
          is_trauma_related:
            formData.is_trauma_related === "yes"
              ? true
              : formData.is_trauma_related === "no"
              ? false
              : null,
          trauma_type: formData.trauma_type || null,
          trauma_description: formData.trauma_description || null,
        };

        // Check frontend cache first
        const cacheKey = generateCacheKey(payload);
        const cachedData = getCached(cacheKey);
        if (cachedData) {
          setResult({
            level: cachedData.level,
            confidence: cachedData.confidence,
            message: cachedData.message,
            recommendations: cachedData.recommendations || [],
            safety_note:
              cachedData.safety_note ||
              "If symptoms worsen, contact emergency services immediately.",
            key_factors: cachedData.key_factors || [],
            explanation_tags: cachedData.explanation_tags || [],
            data_quality: cachedData.data_quality,
            low_confidence_warning: cachedData.low_confidence_warning || false,
            ai_enabled: cachedData.ai_enabled || false,
          });
          return;
        }

        // Make API call if not cached
        const response = await fetch(API_ENDPOINTS.ANALYZE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze");
        }

        const data = await response.json();

        // Cache the response
        setCached(cacheKey, data);

        setResult({
          level: data.level,
          confidence: data.confidence,
          message: data.message,
          recommendations: data.recommendations || [],
          safety_note:
            data.safety_note ||
            "If symptoms worsen, contact emergency services immediately.",
          key_factors: data.key_factors || [],
          explanation_tags: data.explanation_tags || [],
          data_quality: data.data_quality,
          low_confidence_warning: data.low_confidence_warning || false,
          ai_enabled: data.ai_enabled || false,
        });
      } catch (error) {
        // Fallback to mock result for demo
        setResult({
          level: "primary_care",
          confidence: 0.85,
          message: tResults("fallback.message"),
          recommendations: [
            tResults("fallback.recommendations.0"),
            tResults("fallback.recommendations.1"),
          ],
          safety_note: tResults("fallback.safety"),
        });
        showToast(tResults("toasts.apiFallback"), "error");
      }
    };

    analyzeHealth();
  }, [router, tResults]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const getTriageConfig = (level: string) => {
    return (
      TRIAGE_LEVELS[level as keyof typeof TRIAGE_LEVELS] ||
      TRIAGE_LEVELS.primary_care
    );
  };

  const getShareSummary = () => {
    if (!result) {
      return tResults("shareSummary.title");
    }
    const confidencePercent = (result.confidence * 100).toFixed(0);
    return `${tResults("shareSummary.title")}
${tResults("shareSummary.risk", { level: result.level || "N/A" })}
${tResults("shareSummary.confidence", { value: confidencePercent })}`;
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    showToast(tResults("toasts.print"), "info");
    window.print();
  };

  const handleShare = () => {
    if (!result || typeof window === "undefined") return;
    const summary = getShareSummary();
    const shareData = {
      title: tResults("shareSummary.title"),
      text: summary,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => showToast(tResults("toasts.shareSuccess"), "success"))
        .catch(() => showToast(tResults("toasts.shareCanceled"), "info"));
      return;
    }

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`${summary}\n${window.location.href}`)
        .then(() => showToast(tResults("toasts.copySuccess"), "success"))
        .catch(() => showToast(tResults("toasts.copyFail"), "error"));
      return;
    }

    showToast(tResults("toasts.shareUnsupported"), "error");
  };

  const handleEmail = () => {
    if (!result || typeof window === "undefined") return;
    const subject = encodeURIComponent(tResults("shareSummary.title"));
    const body = encodeURIComponent(`${getShareSummary()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    showToast(tResults("toasts.email"), "info");
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background-DEFAULT flex items-center justify-center">
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={handleToastClose}
        />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-DEFAULT mx-auto mb-4"></div>
          <p className="text-gray-600">{tResults("loading")}</p>
        </div>
      </div>
    );
  }

  const config = getTriageConfig(result.level);
  const supportedLevels = [
    "self_care",
    "primary_care",
    "semi_emergency",
    "emergency",
  ] as const;
  const triageKey = supportedLevels.includes(
    result.level as (typeof supportedLevels)[number]
  )
    ? (result.level as (typeof supportedLevels)[number])
    : "primary_care";
  const triageTitle = tResults(`triage.${triageKey}.title`);
  const triageDescription = tResults(`triage.${triageKey}.description`);
  const triageRecommendationCounts: Record<typeof triageKey, number> = {
    self_care: 4,
    primary_care: 4,
    semi_emergency: 4,
    emergency: 4,
  };
  const localizedTriageMessage = tResults(`triageContent.${triageKey}.message`);
  const localizedTriageSafety = tResults(`triageContent.${triageKey}.safety`);
  const localizedTriageRecommendations = Array.from(
    { length: triageRecommendationCounts[triageKey] },
    (_, index) =>
      tResults(`triageContent.${triageKey}.recommendations.${index}`)
  );
  const shouldUseLocalizedTriage = locale === "sv";
  const messageToShow = shouldUseLocalizedTriage
    ? localizedTriageMessage
    : result.message;
  const recommendationsToShow = shouldUseLocalizedTriage
    ? localizedTriageRecommendations
    : result.recommendations;
  const safetyNoteToShow = shouldUseLocalizedTriage
    ? localizedTriageSafety
    : result.safety_note;

  return (
    <div className="min-h-screen bg-background-DEFAULT print-results">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleToastClose}
      />
      {/* Header - Sticky */}
      <header
        role="banner"
        className="no-print w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm overflow-visible"
      >
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <Link href={ROUTES.HOME}>
                <Logo
                  height={32}
                  width={112}
                  className="h-4 sm:h-5 md:h-6 lg:h-8 w-16 sm:w-20 md:w-24 lg:w-32 max-w-full cursor-pointer"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links - Positioned near logo */}
            <nav
              role="navigation"
              aria-label="Main navigation"
              className="hidden lg:flex items-center gap-4 lg:gap-5 ml-6 lg:ml-8 mr-8 lg:mr-12"
            >
              <Link
                href={ROUTES.HOME}
                className={`text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2 transition-all duration-200 cursor-pointer relative group ${
                  pathname === ROUTES.HOME
                    ? "text-primary-DEFAULT"
                    : "text-gray-700 hover:text-primary-DEFAULT"
                }`}
              >
                {tNav("home")}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary-DEFAULT transition-all duration-200 ${
                    pathname === ROUTES.HOME
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
              <Link
                href={`${ROUTES.HOME}#features`}
                className="text-base sm:text-lg font-medium text-gray-700 hover:text-primary-DEFAULT focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2 transition-all duration-200 cursor-pointer relative group"
              >
                {tNav("features")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-DEFAULT transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href={`${ROUTES.HOME}#how-it-works`}
                className="text-base sm:text-lg font-medium text-gray-700 hover:text-primary-DEFAULT focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2 transition-all duration-200 cursor-pointer relative group whitespace-nowrap"
              >
                {tNav("howItWorks")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-DEFAULT transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href={ROUTES.ABOUT}
                className={`text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2 transition-all duration-200 cursor-pointer relative group ${
                  pathname === ROUTES.ABOUT
                    ? "text-primary-DEFAULT"
                    : "text-gray-700 hover:text-primary-DEFAULT"
                }`}
              >
                {tNav("about")}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary-DEFAULT transition-all duration-200 ${
                    pathname === ROUTES.ABOUT
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
              <Link
                href={ROUTES.RESOURCES}
                className={`text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2 transition-all duration-200 cursor-pointer relative group ${
                  pathname === ROUTES.RESOURCES
                    ? "text-primary-DEFAULT"
                    : "text-gray-700 hover:text-primary-DEFAULT"
                }`}
              >
                {tNav("resources")}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary-DEFAULT transition-all duration-200 ${
                    pathname === ROUTES.RESOURCES
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
              <Link
                href={ROUTES.CONTACT}
                className={`text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2 transition-all duration-200 cursor-pointer relative group ${
                  pathname === ROUTES.CONTACT
                    ? "text-primary-DEFAULT"
                    : "text-gray-700 hover:text-primary-DEFAULT"
                }`}
              >
                {tNav("contact")}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary-DEFAULT transition-all duration-200 ${
                    pathname === ROUTES.CONTACT
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            </nav>

            {/* Right Side - Language Toggle & Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 flex-shrink-0 ml-2 sm:ml-4 lg:ml-6">
              <div className="hidden sm:block">
                <LanguageToggle />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 text-gray-700 hover:text-primary-DEFAULT focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md transition-all duration-200 flex-shrink-0"
                aria-label="Toggle menu"
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
                <Link
                  href={ROUTES.HOME}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 text-left text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2.5 transition-all duration-200 cursor-pointer ${
                    pathname === ROUTES.HOME
                      ? "text-primary-DEFAULT"
                      : "text-gray-700 hover:text-primary-DEFAULT"
                  }`}
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  {tNav("home")}
                </Link>
                <Link
                  href={`${ROUTES.HOME}#features`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-base font-medium text-gray-700 hover:text-primary-DEFAULT focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2.5 transition-all duration-200 cursor-pointer"
                >
                  {tNav("features")}
                </Link>
                <Link
                  href={`${ROUTES.HOME}#how-it-works`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-base font-medium text-gray-700 hover:text-primary-DEFAULT focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2.5 transition-all duration-200 cursor-pointer"
                >
                  {tNav("howItWorks")}
                </Link>
                <Link
                  href={ROUTES.ABOUT}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2.5 transition-all duration-200 cursor-pointer ${
                    pathname === ROUTES.ABOUT
                      ? "text-primary-DEFAULT"
                      : "text-gray-700 hover:text-primary-DEFAULT"
                  }`}
                >
                  {tNav("about")}
                </Link>
                <Link
                  href={ROUTES.RESOURCES}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2.5 transition-all duration-200 cursor-pointer ${
                    pathname === ROUTES.RESOURCES
                      ? "text-primary-DEFAULT"
                      : "text-gray-700 hover:text-primary-DEFAULT"
                  }`}
                >
                  {tNav("resources")}
                </Link>
                <Link
                  href={ROUTES.CONTACT}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 rounded-md px-4 py-2.5 transition-all duration-200 cursor-pointer ${
                    pathname === ROUTES.CONTACT
                      ? "text-primary-DEFAULT"
                      : "text-gray-700 hover:text-primary-DEFAULT"
                  }`}
                >
                  {tNav("contact")}
                </Link>
                {/* Language Toggle for Mobile */}
                <div className="sm:hidden px-4 py-2.5 border-t border-gray-100 mt-2 pt-4">
                  <LanguageToggle />
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Print-only header */}
      <div className="hidden print:block mb-6">
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {tResults("shareSummary.title")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Generated on {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        {/* Breadcrumbs - Below Header */}
        <Breadcrumbs />
        {/* Progress Indicator */}
        <div className="no-print mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-DEFAULT">
              {tResults("progress.step", { current: 3, total: 3 })}
            </span>
            <span className="text-sm text-gray-500">
              {tResults("progress.label")}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
            <motion.div
              className="h-2 rounded-full"
              style={{ backgroundColor: "#00A876" }}
              initial={{ width: "66%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            ></motion.div>
          </div>
          <motion.p
            className="text-sm text-gray-600 text-center font-medium mt-2"
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.p>
        </div>

        {/* Large Risk Badge with Glow Effect */}
        <div className="flex justify-center mb-8 no-break">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`risk-badge relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center rounded-full ${config.bgColor} border-4 ${config.borderColor} shadow-tech-glow-lg`}
            style={{
              boxShadow:
                config.color === "triage-emergency"
                  ? "0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.3)"
                  : config.color === "triage-semiEmergency"
                  ? "0 0 40px rgba(249, 115, 22, 0.6), 0 0 80px rgba(249, 115, 22, 0.3)"
                  : config.color === "triage-primaryCare"
                  ? "0 0 40px rgba(234, 179, 8, 0.6), 0 0 80px rgba(234, 179, 8, 0.3)"
                  : "0 0 40px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.3)",
            }}
          >
            <div className="text-6xl sm:text-7xl md:text-8xl">
              {config.icon}
            </div>
            {/* Pulsing glow effect */}
            <motion.div
              className={`absolute inset-0 rounded-full ${config.bgColor} opacity-50`}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">
          {triageTitle}
        </h2>
        <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
          {triageDescription}
        </p>

        {/* Result Card */}
        <div
          className={`no-break rounded-3xl p-6 sm:p-8 md:p-10 mb-6 border-2 ${config.borderColor} ${config.bgColor} shadow-mobile-card`}
        >
          {/* Confidence with Tooltip */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  {tResults("confidence.label")}
                </span>
                <div className="group relative">
                  <button
                    type="button"
                    className="w-5 h-5 rounded-full bg-primary-soft text-primary-DEFAULT flex items-center justify-center hover:bg-primary-light hover:text-white transition-colors text-xs font-bold cursor-help"
                    aria-label={tResults("confidence.tooltipTitle")}
                  >
                    ℹ️
                  </button>
                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <p className="mb-1 font-semibold">
                      {tResults("confidence.tooltipTitle")}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>{tResults("confidence.tooltipItems.0")}</li>
                      <li>{tResults("confidence.tooltipItems.1")}</li>
                      <li>{tResults("confidence.tooltipItems.2")}</li>
                      <li>{tResults("confidence.tooltipItems.3")}</li>
                    </ul>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
              <span className={`text-lg font-bold ${config.textColor}`}>
                {(result.confidence * 100).toFixed(0)}%
              </span>
            </div>
            {/* Visual Risk Meter */}
            <div className="relative w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
              <motion.div
                className="h-3 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${result.confidence * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  background:
                    result.confidence >= 0.8
                      ? "linear-gradient(to right, #00A876, #26C99A)"
                      : result.confidence >= 0.6
                      ? "linear-gradient(to right, #A3E635, #00A876)"
                      : "linear-gradient(to right, #FCD34D, #A3E635)",
                }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              {result.confidence >= 0.8
                ? tResults("confidence.high")
                : result.confidence >= 0.6
                ? tResults("confidence.moderate")
                : tResults("confidence.low")}
            </p>
          </div>

          {/* Low Confidence Fallback Message */}
          {result.confidence < 0.6 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-5 sm:p-6 rounded-r-lg shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-amber-600"
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
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-bold text-amber-900 mb-2">
                    {tResults("lowConfidence.title")}
                  </h4>
                  <p className="text-sm sm:text-base text-amber-800 leading-relaxed mb-4">
                    {tResults("lowConfidence.description")}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
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
                      <p className="text-sm sm:text-base text-amber-800">
                        {tResults("lowConfidence.items.0")}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
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
                      <p className="text-sm sm:text-base text-amber-800">
                        {tResults("lowConfidence.items.1")}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
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
                      <p className="text-sm sm:text-base text-amber-800">
                        {tResults("lowConfidence.items.2")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <a
                      href="tel:1177"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm sm:text-base transition-colors"
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {tResults("lowConfidence.actions.call1177")}
                    </a>
                    <a
                      href="tel:112"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm sm:text-base transition-colors"
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
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      {tResults("lowConfidence.actions.call112")}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Message */}
          <div className="mb-6">
            <p className={`text-lg ${config.textColor} leading-relaxed`}>
              {messageToShow}
            </p>
          </div>

          {/* Explanation Tags - Key Factors */}
          {result.explanation_tags && result.explanation_tags.length > 0 && (
            <div className="mb-6">
              <h4 className={`font-semibold ${config.textColor} mb-3 text-lg`}>
                {tResults("explanation.title")}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {tResults("explanation.subtitle")}
              </p>
              <div className="flex flex-wrap gap-2">
                {result.explanation_tags.map((tag, index) => {
                  const isIncreased = tag.impact === "increased_risk";
                  const impactColor = isIncreased
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-green-50 border-green-200 text-green-800";
                  const impactIcon = isIncreased ? "↑" : "↓";
                  const categoryLabel =
                    tResults(`explanation.category.${tag.category}` as any) ||
                    tag.category;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${impactColor} text-sm font-medium shadow-sm`}
                    >
                      <span className="font-bold">{impactIcon}</span>
                      <span>{tag.factor}</span>
                      <span className="text-xs opacity-75">
                        ({categoryLabel})
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations as Visual Cards */}
          {recommendationsToShow.length > 0 && (
            <div className="mb-6">
              <h4 className={`font-semibold ${config.textColor} mb-4 text-lg`}>
                {tResults("recommendations")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendationsToShow.map((rec, index) => {
                  // Determine icon based on recommendation content
                  const getIcon = (text: string) => {
                    const lowerText = text.toLowerCase();
                    if (
                      lowerText.includes("doctor") ||
                      lowerText.includes("physician") ||
                      lowerText.includes("clinic")
                    ) {
                      return (
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      );
                    }
                    if (
                      lowerText.includes("hospital") ||
                      lowerText.includes("emergency") ||
                      lowerText.includes("urgent")
                    ) {
                      return (
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
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      );
                    }
                    if (
                      lowerText.includes("rest") ||
                      lowerText.includes("home") ||
                      lowerText.includes("monitor")
                    ) {
                      return (
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
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      );
                    }
                    if (
                      lowerText.includes("medication") ||
                      lowerText.includes("medicine") ||
                      lowerText.includes("drug")
                    ) {
                      return (
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
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                      );
                    }
                    // Default icon
                    return (
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    );
                  };

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-2xl p-4 border-2 ${config.borderColor} hover:shadow-tech-glow-sm transition-all duration-200`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`${config.textColor} flex-shrink-0 mt-0.5`}
                        >
                          {getIcon(rec)}
                        </div>
                        <p
                          className={`text-sm ${config.textColor} leading-relaxed`}
                        >
                          {rec}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Safety Note */}
          <div
            className={`mt-6 pt-6 border-t-2 ${config.borderColor} opacity-60`}
          >
            <p className={`text-sm font-medium ${config.textColor}`}>
              ⚠️ {safetyNoteToShow}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-4 sm:gap-6 mb-8">
          <Button
            onClick={() => router.push(ROUTES.INPUT)}
            variant="primary"
            size="sm"
            className="text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5"
          >
            {tResults("actions.checkAnother")}
          </Button>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <Button
              onClick={handlePrint}
              variant="secondary"
              size="sm"
              className="text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-2"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              {tResults("share.print")}
            </Button>
            <Button
              onClick={handleShare}
              variant="secondary"
              size="sm"
              className="text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-2"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              {tResults("share.share")}
            </Button>
            <Button
              onClick={handleEmail}
              variant="secondary"
              size="sm"
              className="text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-2"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
              {tResults("share.email")}
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
          <p className="text-sm text-amber-800">
            <strong>{tResults("disclaimer.title")}</strong>{" "}
            {tResults("disclaimer.body")}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
