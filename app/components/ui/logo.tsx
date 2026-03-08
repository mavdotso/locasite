import React from "react";
import { cn } from "@/app/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
  textClassName?: string;
  innerFill?: string;
}

export default function Logo({
  className,
  width = 28,
  height = 28,
  showText = true,
  textClassName,
  innerFill = "var(--color-brand-forest)",
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle cx="14" cy="12" r="9" fill="currentColor" />
        <circle cx="14" cy="12" r="4" fill={innerFill} />
        <path
          d="M14 21 L14 27"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span
          className={cn(
            "font-display font-extrabold text-xl tracking-tight",
            textClassName
          )}
        >
          Locosite
        </span>
      )}
    </div>
  );
}
