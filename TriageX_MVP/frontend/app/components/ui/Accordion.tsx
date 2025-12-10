"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  allowMultiple?: boolean;
  className?: string;
}

export default function Accordion({
  items,
  defaultOpen = [],
  allowMultiple = false,
  className = "",
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        return (
          <div
            key={item.id}
            className="border border-amber-200 rounded-xl overflow-hidden bg-amber-50"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-amber-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 rounded-xl"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                {item.icon && (
                  <div className="flex-shrink-0 text-amber-600">
                    {item.icon}
                  </div>
                )}
                <span className="font-semibold text-amber-900 text-sm sm:text-base">
                  {item.title}
                </span>
              </div>
              <motion.svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-6 pb-4 pt-2 text-amber-800 text-sm sm:text-base leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
