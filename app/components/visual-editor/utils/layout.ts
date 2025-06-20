import { LayoutOptions } from "../types";
import { cn } from "@/app/lib/utils";
import React from "react";

export function getLayoutClasses(layout?: LayoutOptions): string {
  if (!layout) return "";

  const classes: string[] = ["flex", "relative"];

  // Direction
  if (layout.direction === "row") {
    classes.push("flex-row");
  } else {
    classes.push("flex-col");
  }

  // Alignment
  switch (layout.align) {
    case "start":
      classes.push("items-start");
      break;
    case "center":
      classes.push("items-center");
      break;
    case "end":
      classes.push("items-end");
      break;
    case "stretch":
      classes.push("items-stretch");
      break;
  }

  // Justify content
  switch (layout.justify) {
    case "start":
      classes.push("justify-start");
      break;
    case "center":
      classes.push("justify-center");
      break;
    case "end":
      classes.push("justify-end");
      break;
    case "between":
      classes.push("justify-between");
      break;
    case "around":
      classes.push("justify-around");
      break;
  }

  // Gap
  switch (layout.gap) {
    case "small":
      classes.push("gap-2");
      break;
    case "medium":
      classes.push("gap-4");
      break;
    case "large":
      classes.push("gap-8");
      break;
  }

  // Padding
  switch (layout.padding) {
    case "small":
      classes.push("p-4");
      break;
    case "medium":
      classes.push("p-8");
      break;
    case "large":
      classes.push("p-16");
      break;
  }

  // Margin
  switch (layout.margin) {
    case "small":
      classes.push("m-4");
      break;
    case "medium":
      classes.push("m-8");
      break;
    case "large":
      classes.push("m-16");
      break;
  }

  // Full width
  if (layout.fullWidth) {
    classes.push("w-full");
  }

  return cn(...classes);
}

export function getBackgroundStyle(layout?: LayoutOptions): React.CSSProperties {
  if (!layout?.background) return {};

  const { type, value } = layout.background;

  switch (type) {
    case "color":
      return { backgroundColor: value };
    case "gradient":
      return { background: value };
    case "image":
      return {
        backgroundImage: `url(${value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      };
    default:
      return {};
  }
}

export const defaultLayout: LayoutOptions = {
  direction: "column",
  align: "stretch",
  justify: "start",
  gap: "medium",
  padding: "medium",
  margin: "none",
  fullWidth: true
};