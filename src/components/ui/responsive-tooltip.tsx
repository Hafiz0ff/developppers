"use client";

import React, { useState, useRef, useEffect } from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResponsiveTooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  title?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

/**
 * ResponsiveTooltip:
 * - Desktop: displays tooltip on hover (mouseenter / mouseleave / focus).
 * - Mobile / Touch: opens a clean popover with an explicit "Понятно" dismiss button on tap/click.
 */
export function ResponsiveTooltip({
  content,
  children,
  title,
  className = "",
  align = "center",
}: ResponsiveTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = (e: React.MouseEvent) => {
    // Prevent submitting or triggering parent click when tapping for tooltip
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isVisible = isHovered || isOpen;

  // Alignment classes for desktop tooltip
  const alignClasses =
    align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-1/2 -translate-x-1/2";

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Подсказка"
        className="inline-flex items-center focus:outline-hidden cursor-pointer"
      >
        {children}
      </button>

      {/* Tooltip Content */}
      {isVisible && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/25 sm:hidden backdrop-blur-2xs animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
          />

          {/* Desktop popover & Mobile sheet/modal */}
          <div
            className={`
              /* Mobile styling (Bottom/Centered modal on touch screens) */
              fixed bottom-4 left-4 right-4 z-50 p-4 rounded-2xl bg-popover text-popover-foreground border shadow-xl
              sm:fixed-none sm:bottom-auto sm:left-auto sm:right-auto
              /* Desktop styling (Floating tooltip above trigger) */
              sm:absolute sm:bottom-full sm:mb-2 sm:z-50 sm:w-72 sm:p-3 sm:rounded-xl sm:border sm:shadow-lg sm:text-xs
              ${alignClasses}
              animate-in fade-in-0 zoom-in-95 duration-150
            `}
            role="tooltip"
          >
            {/* Header (on mobile or if title is present) */}
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b mb-2 sm:border-0 sm:pb-0 sm:mb-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Info className="h-3.5 w-3.5 text-emerald-600" />
                <span>{title || "Подсказка"}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  setIsHovered(false);
                }}
                className="text-muted-foreground hover:text-foreground sm:hidden p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="text-xs text-muted-foreground leading-relaxed sm:text-[11px]">
              {content}
            </div>

            {/* Mobile "Понятно" button */}
            <div className="mt-3 pt-2 border-t flex justify-end sm:hidden">
              <Button
                type="button"
                size="sm"
                className="h-8 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                Понятно
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
