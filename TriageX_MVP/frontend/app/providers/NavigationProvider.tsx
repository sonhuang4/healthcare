"use client";

import {
  createContext,
  useContext,
  useRef,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface NavigationContextType {
  navigateWithProgress: (href: string) => void;
  isNavigating: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isNavigatingRef = useRef(false);
  const pendingNavigationRef = useRef<string | null>(null);

  const navigateWithProgress = useCallback(
    (href: string) => {
      // Don't navigate if already on that page
      if (href === pathname) return;

      // Don't navigate if already navigating
      if (isNavigatingRef.current) return;

      // Store the target href
      pendingNavigationRef.current = href;
      isNavigatingRef.current = true;

      // Dispatch event to start progress bar
      window.dispatchEvent(
        new CustomEvent("startNavigation", { detail: { href } })
      );

      // Listen for progress completion
      const handleProgressComplete = () => {
        const targetHref = pendingNavigationRef.current;
        if (targetHref) {
          // Navigate to the new page
          router.push(targetHref);
          pendingNavigationRef.current = null;
          isNavigatingRef.current = false;
        }
        window.removeEventListener("progressComplete", handleProgressComplete);
      };

      window.addEventListener("progressComplete", handleProgressComplete, {
        once: true,
      });
    },
    [pathname, router]
  );

  // Global click interceptor for all Link components only
  // Let router.push() work normally to avoid breaking navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href]") as HTMLAnchorElement;

      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Skip external links, anchor links, and same page
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href === pathname
      ) {
        return;
      }

      // Skip if it's a download link or has target="_blank"
      if (link.hasAttribute("download") || link.target === "_blank") {
        return;
      }

      // Intercept internal navigation from Links only
      e.preventDefault();
      e.stopPropagation();
      navigateWithProgress(href);
    };

    document.addEventListener("click", handleClick, true); // Use capture phase

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname, navigateWithProgress]);

  return (
    <NavigationContext.Provider
      value={{
        navigateWithProgress,
        isNavigating: isNavigatingRef.current,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
