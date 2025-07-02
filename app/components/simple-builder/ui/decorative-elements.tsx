import React from "react";
import { cn } from "@/app/lib/utils";

interface DecorativePatternProps {
  pattern:
    | "dots"
    | "grid"
    | "waves"
    | "circles"
    | "lines"
    | "gradient"
    | "mesh";
  color?: string;
  opacity?: number;
  className?: string;
}

export function DecorativePattern({
  pattern,
  color = "#3b82f6",
  opacity = 0.1,
  className,
}: DecorativePatternProps) {
  const renderPattern = () => {
    switch (pattern) {
      case "dots":
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="dots-pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="2" fill={color} opacity={opacity} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-pattern)" />
          </svg>
        );

      case "grid":
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity={opacity}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        );

      case "waves":
        return (
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill={color}
              fillOpacity={opacity}
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        );

      case "circles":
        return (
          <>
            <div
              className="absolute top-10 left-10 w-32 h-32 rounded-full"
              style={{ backgroundColor: color, opacity }}
            />
            <div
              className="absolute bottom-10 right-10 w-48 h-48 rounded-full"
              style={{ backgroundColor: color, opacity: opacity * 0.7 }}
            />
            <div
              className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full"
              style={{ backgroundColor: color, opacity: opacity * 0.5 }}
            />
          </>
        );

      case "lines":
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="lines-pattern"
                x="0"
                y="0"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="10"
                  stroke={color}
                  strokeWidth="0.5"
                  opacity={opacity}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lines-pattern)" />
          </svg>
        );

      case "gradient":
        return (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 20% 50%, ${color}20 0%, transparent 50%)`,
              opacity,
            }}
          />
        );

      case "mesh":
        return (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(at 40% 20%, ${color}30 0px, transparent 50%),
                radial-gradient(at 80% 0%, ${color}20 0px, transparent 50%),
                radial-gradient(at 0% 50%, ${color}25 0px, transparent 50%),
                radial-gradient(at 80% 50%, ${color}15 0px, transparent 50%),
                radial-gradient(at 0% 100%, ${color}20 0px, transparent 50%),
                radial-gradient(at 80% 100%, ${color}30 0px, transparent 50%)
              `,
              opacity,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
    >
      {renderPattern()}
    </div>
  );
}

interface GradientBackgroundProps {
  type: "linear" | "radial" | "conic" | "mesh";
  colors: string[];
  direction?: string;
  opacity?: number;
  className?: string;
}

export function GradientBackground({
  type,
  colors,
  direction = "to right",
  opacity = 1,
  className,
}: GradientBackgroundProps) {
  const getGradient = () => {
    const colorString = colors.join(", ");

    switch (type) {
      case "linear":
        return `linear-gradient(${direction}, ${colorString})`;
      case "radial":
        return `radial-gradient(circle, ${colorString})`;
      case "conic":
        return `conic-gradient(from 180deg, ${colorString})`;
      case "mesh":
        return `
          radial-gradient(at 0% 0%, ${colors[0]} 0px, transparent 50%),
          radial-gradient(at 50% 0%, ${colors[1] || colors[0]} 0px, transparent 50%),
          radial-gradient(at 100% 0%, ${colors[2] || colors[0]} 0px, transparent 50%),
          radial-gradient(at 100% 100%, ${colors[3] || colors[1] || colors[0]} 0px, transparent 50%),
          radial-gradient(at 0% 100%, ${colors[4] || colors[2] || colors[0]} 0px, transparent 50%)
        `;
      default:
        return `linear-gradient(${direction}, ${colorString})`;
    }
  };

  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{
        background: getGradient(),
        opacity,
      }}
    />
  );
}

interface AnimatedShapeProps {
  shape: "blob" | "square" | "triangle";
  color?: string;
  size?: number;
  animation?: "float" | "pulse" | "rotate";
  className?: string;
}

export function AnimatedShape({
  shape,
  color = "#3b82f6",
  size = 200,
  animation = "float",
  className,
}: AnimatedShapeProps) {
  const getAnimationClass = () => {
    switch (animation) {
      case "float":
        return "animate-float";
      case "pulse":
        return "animate-pulse";
      case "rotate":
        return "animate-spin-slow";
      default:
        return "";
    }
  };

  const renderShape = () => {
    switch (shape) {
      case "blob":
        return (
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
          >
            <path
              fill={color}
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,74.1,43.2C66.7,57.2,57.6,70.6,45,78.1C32.4,85.6,16.2,87.1,0.7,85.9C-14.8,84.7,-29.6,80.9,-43.9,74.4C-58.3,67.9,-72.1,58.7,-80.3,45.8C-88.6,32.9,-91.3,16.4,-89.1,1.3C-86.9,-13.9,-79.7,-27.7,-71,-40.4C-62.3,-53.1,-52,-64.6,-39.3,-72.5C-26.6,-80.4,-13.3,-84.6,0.9,-86.1C15,-87.6,30.1,-86.5,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        );

      case "square":
        return (
          <div
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: "20%",
            }}
          />
        );

      case "triangle":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn(getAnimationClass(), className)}>{renderShape()}</div>
  );
}
