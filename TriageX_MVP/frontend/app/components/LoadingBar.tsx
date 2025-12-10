"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigationStartRef = useRef(false);

  // Handle navigation start event
  useEffect(() => {
    const handleStartNavigation = () => {
      navigationStartRef.current = true;
      setLoading(true);
      setProgress(0);
      document.body.setAttribute("data-page-loading", "true");

      // Clear any existing intervals
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Start progress animation
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
            return 100;
          }

          // Smooth progress: start slow, accelerate, then finish fast
          let increment;
          if (prev < 30) {
            increment = 2; // Slow start
          } else if (prev < 70) {
            increment = 3; // Medium
          } else if (prev < 90) {
            increment = 4; // Faster
          } else {
            increment = 5; // Fast finish
          }

          const newProgress = Math.min(prev + increment, 100);

          // When progress reaches 100%, complete navigation
          if (newProgress >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }

            // Dispatch event to complete navigation
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent("progressComplete"));
              document.body.removeAttribute("data-page-loading");
              navigationStartRef.current = false;

              // Hide progress bar after a short delay
              hideTimeoutRef.current = setTimeout(() => {
                setLoading(false);
                setProgress(0);
              }, 300);
            }, 0);
          }

          return newProgress;
        });
      }, 50); // Update every 50ms for smooth animation
    };

    window.addEventListener("startNavigation", handleStartNavigation);

    return () => {
      window.removeEventListener("startNavigation", handleStartNavigation);
    };
  }, []);

  // Reset when pathname changes (after navigation completes)
  useEffect(() => {
    // Small delay to ensure navigation completed
    const timer = setTimeout(() => {
      if (!navigationStartRef.current) {
        setLoading(false);
        setProgress(0);
        document.body.removeAttribute("data-page-loading");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      document.body.removeAttribute("data-page-loading");
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-1"
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-gray-200/30"></div>

          {/* Progress bar */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-dark via-primary-DEFAULT to-primary-dark"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
            style={{
              backgroundColor: "#006B54",
              boxShadow:
                "0 0 10px rgba(0, 107, 84, 0.6), 0 0 20px rgba(0, 107, 84, 0.4)",
            }}
          >
            {/* Shimmer effect */}
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
              style={{ width: "50%" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
