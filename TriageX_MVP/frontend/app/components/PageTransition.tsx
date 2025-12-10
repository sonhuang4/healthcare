"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    filter: "blur(5px)",
  },
};

const pageTransition = {
  type: "tween" as const,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
  duration: 0.5,
};

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="relative"
    >
      {/* Futuristic glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 0.4, 0],
          scale: [0.8, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 168, 118, 0.2) 0%, transparent 70%)",
        }}
      />
      {children}
    </motion.div>
  );
}
