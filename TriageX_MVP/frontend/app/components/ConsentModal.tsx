"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "../../i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "../constants";
import { saveConsent, hasConsent } from "../lib/utils/consent";
import Button from "./ui/Button";

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: () => void;
}

export default function ConsentModal({
  isOpen,
  onClose,
  onConsent,
}: ConsentModalProps) {
  const t = useTranslations("consent");
  const tCommon = useTranslations("common");
  const [consent, setConsent] = useState(false);
  const router = useRouter();
  const modalContentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      setConsent(hasConsent());

      // Save current scroll position
      scrollPositionRef.current =
        window.pageYOffset || document.documentElement.scrollTop;

      // Prevent body scroll when modal is open - use a simpler approach
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";

      // Focus the modal content after a short delay
      const timeoutId = setTimeout(() => {
        if (modalContentRef.current) {
          modalContentRef.current.focus();
        }
      }, 100);

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        // Restore scroll position
        window.scrollTo(0, scrollPositionRef.current);
      };
    }
  }, [isOpen]);

  const handleStart = () => {
    if (consent) {
      saveConsent();
      setConsent(false);
      onConsent();
      router.push(ROUTES.INPUT);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="consent-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            ref={modalContentRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl p-8 md:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto my-auto"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 id="modal-title" className="text-3xl font-bold text-gray-900">
                {t("title")}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={tCommon("close")}
              >
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
              </button>
            </div>

            {/* Important to Know */}
            <div className="bg-amber-50 border-l-4 border-amber-400 pl-6 pr-6 pt-6 pb-6 rounded-r-lg mb-8">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-amber-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-amber-900 ml-3">
                  {t("importantToKnow")}
                </h3>
              </div>
              <ul className="text-sm text-amber-800 leading-relaxed space-y-3 list-disc list-inside">
                <li>{t("disclaimer1")}</li>
                <li>{t("disclaimer2")}</li>
                <li>{t("disclaimer3")}</li>
                <li>{t("disclaimer4")}</li>
              </ul>
            </div>

            {/* Consent Checkbox and Button Group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-start space-x-4 flex-1">
                <input
                  type="checkbox"
                  id="consent-modal"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-6 w-6 text-primary-DEFAULT border-triageCard-border rounded focus:ring-primary-DEFAULT cursor-pointer hover:border-primary-DEFAULT hover:ring-2 hover:ring-primary-soft transition-all duration-200"
                />
                <label
                  htmlFor="consent-modal"
                  className="text-base text-gray-700 cursor-pointer"
                >
                  {t("checkboxLabel")}
                </label>
              </div>

              {/* Start Button */}
              <Button
                onClick={handleStart}
                disabled={!consent}
                variant={consent ? "primary" : "disabled"}
                size="lg"
                className="w-full sm:w-auto"
              >
                {t("startCheck")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
