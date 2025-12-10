"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent, ReactNode } from "react";

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any; // Allow other props to pass through
}

export default function NavigationLink({
  href,
  children,
  className,
  onClick,
  ...props
}: NavigationLinkProps) {
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Don't intercept if it's the same page
    if (href === pathname) {
      if (onClick) onClick(e);
      return;
    }

    // Don't intercept if it's an external link or anchor link
    if (href.startsWith("http") || href.startsWith("#")) {
      if (onClick) onClick(e);
      return;
    }

    // Intercept navigation for internal links
    e.preventDefault();

    // Dispatch event to start navigation with progress
    window.dispatchEvent(
      new CustomEvent("startNavigation", { detail: { href } })
    );

    // Call original onClick if provided
    if (onClick) onClick(e);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
