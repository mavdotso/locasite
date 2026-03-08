import React from 'react';
import { cn } from '@/app/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({
  className,
  width = 16,
  height = 20,
  showText = true,
  textClassName
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 16 20"
        className="flex-shrink-0"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#F97316"
          d="M8 0C4.686 0 2 2.686 2 6C2 9.975 8 16 8 16C8 16 14 9.975 14 6C14 2.686 11.314 0 8 0ZM8 8.5C6.619 8.5 5.5 7.381 5.5 6C5.5 4.619 6.619 3.5 8 3.5C9.381 3.5 10.5 4.619 10.5 6C10.5 7.381 9.381 8.5 8 8.5Z"
        />
      </svg>
      {showText && (
        <span className={cn("font-bold text-xl tracking-tight", textClassName)}>
          locosite
        </span>
      )}
    </div>
  );
}
