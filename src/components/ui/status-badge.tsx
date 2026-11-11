import * as React from "react";
import { cn } from "@/lib/utils";
import { STATUS_STYLES, type EntityStatus, getStatusStyle } from "@/lib/tokens";

export type StatusType = EntityStatus;

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType | string;
  label?: string;
  dotClassName?: string;
}

export function StatusBadge({
  status,
  label,
  className,
  dotClassName,
  children,
  ...props
}: StatusBadgeProps) {
  const config = getStatusStyle(status);
  const displayLabel = label || children || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          config.dotColor,
          dotClassName
        )}
        aria-hidden="true"
      />
      <span>{displayLabel}</span>
    </span>
  );
}
