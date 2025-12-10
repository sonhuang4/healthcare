"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  height?: number;
  width?: number;
  noShadow?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  height = 80,
  width = 240,
  noShadow = false,
}) => {
  const [logoSrc, setLogoSrc] = useState("/newLogo.png");
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || isProcessed) {
      return;
    }

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = "/newLogo.png";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      // EXTREMELY aggressive thresholds for footer (noShadow = true)
      const whiteThreshold = noShadow ? 150 : 240; // Much lower threshold for footer
      const lightGrayThreshold = noShadow ? 130 : 230; // Much lower threshold for footer
      const colorVariation = noShadow ? 20 : 10; // Allow more variation for footer

      // Process multiple passes for footer to catch all white pixels
      const passes = noShadow ? 3 : 1;

      for (let pass = 0; pass < passes; pass++) {
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];

          // Skip if already transparent
          if (alpha === 0) continue;

          // Calculate brightness and color metrics
          const brightness = (r + g + b) / 3;
          const maxColor = Math.max(r, g, b);
          const minColor = Math.min(r, g, b);
          const colorRange = maxColor - minColor;
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b; // Perceptual luminance

          // Get pixel position
          const x = (i / 4) % canvas.width;
          const y = Math.floor(i / 4 / canvas.width);
          const isNearEdge =
            x < 5 || x > canvas.width - 6 || y < 5 || y > canvas.height - 6;

          // Method 1: Remove very bright pixels (white, very light colors)
          if (brightness > whiteThreshold || luminance > whiteThreshold) {
            data[i + 3] = 0;
            continue;
          }

          // Method 2: Remove light gray pixels (mostly white with slight variations)
          if (
            brightness > lightGrayThreshold &&
            colorRange < colorVariation &&
            maxColor > lightGrayThreshold
          ) {
            data[i + 3] = 0;
            continue;
          }

          // Method 3: Remove pixels that are close to white (all RGB channels high and similar)
          // This preserves colored pixels (red, orange, green) which have different RGB values
          if (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) {
            // Check if it's actually white/gray (all channels similar) vs colored
            const isWhiteOrGray = colorRange < 15; // White/gray has low color variation
            if (isWhiteOrGray) {
              data[i + 3] = 0;
              continue;
            }
          }

          // Method 4: For footer, remove light gray/white pixels near edges (white outlines)
          // Only remove if it's actually white/gray, not colored
          if (noShadow && isNearEdge) {
            const isWhiteOrGray = colorRange < 20 && brightness > 140;
            if (isWhiteOrGray) {
              data[i + 3] = 0;
              continue;
            }
          }

          // Method 5: Remove pixels that are white/gray (low color variation + high brightness)
          // This preserves colored pixels which have high color variation
          if (noShadow && brightness > 180 && colorRange < 25) {
            data[i + 3] = 0;
            continue;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const transparentSrc = canvas.toDataURL("image/png");

      if (transparentSrc) {
        setLogoSrc(transparentSrc);
        setIsProcessed(true);
      }
    };
  }, [isProcessed, noShadow]);

  return (
    <div
      className="inline-flex logo-mask max-w-full"
      style={
        noShadow
          ? {
              filter: "none",
              WebkitFilter: "none",
              boxShadow: "none",
              textShadow: "none",
            }
          : {}
      }
    >
      <Image
        src={logoSrc}
        alt="TriageX Logo"
        height={height}
        width={width}
        className={className}
        priority
        unoptimized
        style={{
          objectFit: "contain",
          maxWidth: "100%",
          ...(noShadow
            ? {
                filter: "none",
                WebkitFilter: "none",
                boxShadow: "none",
                textShadow: "none",
                outline: "none",
                WebkitTextStroke: "0",
                mixBlendMode: "normal",
              }
            : {}),
        }}
      />
    </div>
  );
};

export default Logo;
