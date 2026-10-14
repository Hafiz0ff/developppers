"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ApplePhotoLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function ApplePhotoLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: ApplePhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Sync index when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0)));
    }
  }, [isOpen, initialIndex, images.length]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Lock body scroll and register keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Trigger only if horizontal swipe dominates vertical gesture
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex items-center justify-center select-none animate-in fade-in duration-200"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        // Close if clicked directly on the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Header: Title & Close Button */}
      <div className="fixed top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-50 pointer-events-none">
        {title ? (
          <div className="pointer-events-auto px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/95 text-xs sm:text-sm font-semibold tracking-wide shadow-md">
            {title}
          </div>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть галерею"
          className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg hover:scale-105"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Main Image Frame */}
      <div className="relative max-w-6xl max-h-[85vh] w-full px-4 sm:px-16 flex items-center justify-center">
        <img
          key={currentImage}
          src={currentImage}
          alt={title ? `${title} — фото ${currentIndex + 1}` : `Фото ${currentIndex + 1}`}
          className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300 pointer-events-auto"
        />
      </div>

      {/* Minimal Apple-Style Navigation Arrows (Hidden if single image) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Предыдущее фото"
            className="fixed left-3 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-black/60 active:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xl hover:scale-110 z-50 touch-manipulation"
          >
            <ChevronLeft className="h-5 w-5 sm:h-7 sm:w-7" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Следующее фото"
            className="fixed right-3 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-black/60 active:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xl hover:scale-110 z-50 touch-manipulation"
          >
            <ChevronRight className="h-5 w-5 sm:h-7 sm:w-7" />
          </button>
        </>
      )}

      {/* Bottom Counter Pill */}
      {images.length > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium tracking-wider shadow-lg">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
