"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

interface PageMotionWrapperProps {
  children: React.ReactNode;
}

const PageMotionWrapper: React.FC<PageMotionWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If not mounted yet, show children immediately without animation
  if (!isMounted) {
    return <div className="min-h-screen relative">{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      initial={false}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="min-h-screen relative"
    >
      {/* Animated gradient overlay for futuristic effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 168, 118, 0.15) 0%, transparent 70%)",
        }}
      />
      {children}
    </motion.div>
  );
};

export default PageMotionWrapper;
