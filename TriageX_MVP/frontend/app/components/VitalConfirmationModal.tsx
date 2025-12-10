"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Button from "./ui/Button";

export interface VitalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
  vitalName: string;
  vitalValue: string;
  vitalUnit?: string;
}

export default function VitalConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  onReject,
  vitalName,
  vitalValue,
  vitalUnit = "",
}: VitalConfirmationModalProps) {
  const t = useTranslations("vitalConfirm");
  const modalContentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
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

  const handleCall1177 = () => {
    if (typeof window !== "undefined") {
      window.location.href = "tel:1177";
    }
  };

  const handleCall112 = () => {
    if (typeof window !== "undefined") {
      window.location.href = "tel:112";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
            }}
          />

          {/* Modal */}
          <motion.div
            ref={modalContentRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[10000] p-4 pointer-events-none flex items-center justify-center"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 10000,
            }}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 pointer-events-auto max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="vital-modal-title"
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-amber-600"
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
                </div>
                <h3
                  id="vital-modal-title"
                  className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2"
                >
                  {t("title")}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  {t("subtitle")}
                </p>
              </div>

              {/* Vital Value Display */}
              <div className="bg-primary-soft rounded-2xl p-6 mb-6 text-center border-2 border-primary-DEFAULT/20">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {vitalName}
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-primary-DEFAULT">
                  {vitalValue}{" "}
                  {vitalUnit && <span className="text-2xl">{vitalUnit}</span>}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={onConfirm}
                  variant="primary"
                  size="md"
                  fullWidth
                  className="text-base py-3"
                >
                  {t("confirm")}
                </Button>
                <Button
                  onClick={onReject}
                  variant="secondary"
                  size="md"
                  fullWidth
                  className="text-base py-3"
                >
                  {t("reject")}
                </Button>

                {/* Emergency Options */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <p className="text-xs text-gray-500 text-center mb-3">
                    {t("help")}
                  </p>
                  <button
                    onClick={handleCall1177}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
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
                    {t("call1177")}
                  </button>
                  <button
                    onClick={handleCall112}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
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
                    {t("call112")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
