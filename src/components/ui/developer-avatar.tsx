"use client";

import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeveloperAvatarProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DeveloperAvatar({
  name,
  logoUrl,
  className,
  size = "md",
}: DeveloperAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Generate initials (e.g. "Рахш Сохтмон" -> "РС")
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-14 w-14 text-sm",
    lg: "h-16 w-16 text-base",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  };

  const showFallback = !logoUrl || hasError;

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-xl overflow-hidden border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-center aspect-square shadow-xs",
        sizeClasses[size],
        className
      )}
    >
      {!showFallback ? (
        <img
          src={logoUrl}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain p-1.5 transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex flex-col items-center justify-center font-bold tracking-tight select-none">
          {initials.length > 0 ? (
            <span>{initials}</span>
          ) : (
            <Building2 className={iconSizes[size]} />
          )}
        </div>
      )}
    </div>
  );
}
