"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LanguageToggle from "../../components/LanguageToggle";
import Footer from "../../components/Footer";
import Logo from "../../components/Logo";
import Breadcrumbs from "../../components/Breadcrumbs";
import { ROUTES } from "../../constants";
import Button from "../../components/ui/Button";

export default function Processing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepProgress, setStepProgress] = useState(33);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tProcessing = useTranslations("processing");

  const steps = useMemo(
    () => [
      { id: 1, text: tProcessing("steps.collecting"), icon: "✓" },
      { id: 2, text: tProcessing("steps.analyzing"), icon: "⏳" },
      { id: 3, text: tProcessing("steps.evaluating"), icon: "⏳" },
      { id: 4, text: tProcessing("steps.generating"), icon: "⏳" },
    ],
    [tProcessing]
  );

  useEffect(() => {
    // Animate step progress bar from 33% to 66% (Step 2 of 3)
    setStepProgress(33); // Start from 33% (Step 1 completion)
    const stepProgressInterval = setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 66) {
          clearInterval(stepProgressInterval);
          return 66;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(stepProgressInterval);
  }, []);

  useEffect(() => {
    // Progress animation - Smooth and visible
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Mark all steps as completed when progress reaches 100%
          setCompletedSteps([0, 1, 2, 3]);
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    // Step animation - Staggered completion
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          // Mark the last step as completed
          setCompletedSteps((prevCompleted) => {
            if (!prevCompleted.includes(steps.length - 1)) {
              return [...prevCompleted, steps.length - 1];
            }
            return prevCompleted;
          });
          return steps.length - 1;
        }
        const nextStep = prev + 1;
        // Mark previous step as completed
        setCompletedSteps((prevCompleted) => [...prevCompleted, prev]);
        return nextStep;
      });
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [steps.length]);

  const handleViewResults = () => {
    router.push(ROUTES.RESULTS);
  };

  return (
    <div className="min-h-screen bg-background-DEFAULT flex flex-col">
      {/* Header - Sticky */}
      <header
        role="banner"
        className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm overflow-visible"
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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="max-w-2xl w-full">
          {/* Breadcrumbs - Below Header */}
          <Breadcrumbs />
          {/* Progress Stepper */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary-DEFAULT">
                {tProcessing("progress.step", { current: 2, total: 3 })}
              </span>
            </div>

            {/* Progress Stepper with Connecting Line */}
            <div className="relative flex items-center justify-between mb-2">
              {/* Background Progress Line - Full Width */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

              {/* Filled Progress Line */}
              <motion.div
                className="absolute top-4 left-0 h-0.5 z-0"
                style={{ backgroundColor: "#00A876" }}
                initial={{ width: "33%" }}
                animate={{ width: `${stepProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              ></motion.div>

              {/* Step 1 - Completed */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center"></div>
                <span className="text-xs text-gray-500 font-medium mt-1">
                  {tProcessing("progress.labels.input")}
                </span>
              </div>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Step 2 - Active */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center"></div>
                <span className="text-xs text-gray-500 font-medium mt-1">
                  {tProcessing("progress.labels.analyzing")}
                </span>
              </div>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Step 3 - Pending */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center"></div>
                <span className="text-xs text-gray-500 font-medium mt-1">
                  {tProcessing("progress.labels.results")}
                </span>
              </div>
            </div>

            {/* Progress Percentage */}
            <motion.p
              className="text-sm text-gray-600 text-center font-medium mt-2"
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {Math.round(stepProgress)}%
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg"
          >
            {/* Animated Spinner - Enhanced Interactive Design */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
                {/* Outer Glow Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0, 168, 118, 0.2) 0%, transparent 70%)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Outer Rotating Ring - Emerald */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "4px solid transparent",
                    borderTopColor: "#00A876",
                    borderRightColor: "#00A876",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Middle Rotating Ring - Lime (Counter-clockwise) */}
                <motion.div
                  className="absolute inset-2 sm:inset-3 rounded-full"
                  style={{
                    border: "3px solid transparent",
                    borderBottomColor: "#84CC16",
                    borderLeftColor: "#84CC16",
                  }}
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Inner Rotating Ring - Light Green */}
                <motion.div
                  className="absolute inset-4 sm:inset-5 md:inset-6 rounded-full"
                  style={{
                    border: "2px solid transparent",
                    borderTopColor: "#34D399",
                    borderRightColor: "#34D399",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Pulsing Center Dot */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #00A876 0%, #84CC16 100%)",
                      boxShadow: "0 0 20px rgba(0, 168, 118, 0.6)",
                    }}
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      boxShadow: [
                        "0 0 20px rgba(0, 168, 118, 0.6)",
                        "0 0 30px rgba(0, 168, 118, 0.9)",
                        "0 0 20px rgba(0, 168, 118, 0.6)",
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                {/* Orbiting Particles - Using rotating containers */}
                {[0, 1, 2].map((index) => {
                  const radius = index === 0 ? 40 : index === 1 ? 50 : 60;
                  const initialAngle = index * 120; // 120 degrees apart
                  return (
                    <motion.div
                      key={index}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`,
                        marginTop: `-${radius}px`,
                        marginLeft: `-${radius}px`,
                        transform: `rotate(${initialAngle}deg)`,
                      }}
                      animate={{
                        rotate: initialAngle + 360,
                      }}
                      transition={{
                        duration: index === 0 ? 2 : index === 1 ? 2.5 : 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="absolute top-0 left-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full -translate-x-1/2"
                        style={{
                          background:
                            index === 0
                              ? "#00A876"
                              : index === 1
                              ? "#84CC16"
                              : "#26C99A",
                          boxShadow: `0 0 8px ${
                            index === 0
                              ? "rgba(0, 168, 118, 0.8)"
                              : index === 1
                              ? "rgba(132, 204, 22, 0.8)"
                              : "rgba(51, 229, 184, 0.8)"
                          }`,
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 text-center"
            >
              {tProcessing("status.title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center"
            >
              {tProcessing("status.subtitle")}
            </motion.p>

            {/* Animated Progress Bar */}
            <div className="mb-6 sm:mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    backgroundColor: "#00A876",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      width: "50%",
                    }}
                  />
                </motion.div>
              </div>
              <motion.p
                key={progress}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-sm text-gray-500 text-center font-medium"
              >
                {progress}%
              </motion.p>
            </div>

            {/* Animated Processing Steps */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <AnimatePresence>
                {steps.map((step, index) => {
                  const isCompleted =
                    completedSteps.includes(index) || index < currentStep;
                  const isActive = index === currentStep && progress < 100;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-all duration-500 ${
                        isCompleted
                          ? "bg-primary-soft border-l-4 border-primary-DEFAULT border-2 border-primary-DEFAULT shadow-sm"
                          : isActive
                          ? "bg-primary-soft/50 border-l-4 border-primary-DEFAULT border-2 border-primary-DEFAULT/50"
                          : "bg-gray-50 border-l-4 border-gray-200 border-2 border-gray-200"
                      }`}
                    >
                      <motion.div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl ${
                          isCompleted
                            ? "bg-primary-DEFAULT text-white border-2 border-primary-dark shadow-md"
                            : "bg-gray-300 text-gray-600 border-2 border-gray-400"
                        }`}
                        style={
                          isCompleted ? { backgroundColor: "#00A876" } : {}
                        }
                        animate={
                          isCompleted
                            ? { scale: [1, 1.2, 1], rotate: [0, 360] }
                            : isActive
                            ? { scale: [1, 1.1, 1] }
                            : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        {isCompleted ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-xl sm:text-2xl font-black"
                          >
                            ✓
                          </motion.span>
                        ) : (
                          <span>{step.icon}</span>
                        )}
                      </motion.div>
                      <span
                        className={`font-medium text-sm sm:text-base flex-1 ${
                          isCompleted ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.text}
                      </span>
                      {isActive && (
                        <motion.div
                          className="ml-auto"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-DEFAULT rounded-full"></div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons - Animated entrance */}
            <AnimatePresence>
              {progress >= 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="pt-4 border-t border-gray-200"
                >
                  <Button
                    onClick={handleViewResults}
                    variant="primary"
                    size="lg"
                    fullWidth
                  >
                    {tProcessing("cta")}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
