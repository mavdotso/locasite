import React from 'react';
import { cn } from '@/app/lib/utils';
import LogoSvg from '@/app/assets/logo.svg';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({ 
  className, 
  width = 18, 
  height = 18, 
  showText = true,
  textClassName 
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoSvg 
        width={width} 
        height={height}
        className="flex-shrink-0"
      />
      {showText && (
        <span className={cn("font-bold text-xl", textClassName)}>
          Locasite
        </span>
      )}
    </div>
  );
}