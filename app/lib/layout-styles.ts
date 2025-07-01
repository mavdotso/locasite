import { LayoutOptions } from "@/app/types/visual-editor";

export function getLayoutStyles(layout?: LayoutOptions): React.CSSProperties {
  if (!layout) return {};

  const styles: React.CSSProperties = {};

  // Layout properties
  if (layout.display) styles.display = layout.display;
  if (layout.position) styles.position = layout.position;
  if (layout.flexDirection) styles.flexDirection = layout.flexDirection;
  if (layout.alignItems) styles.alignItems = layout.alignItems;
  if (layout.justifyContent) styles.justifyContent = layout.justifyContent;
  if (layout.gap) styles.gap = layout.gap;

  // Size properties
  if (layout.width) styles.width = layout.width;
  if (layout.height) styles.height = layout.height;
  if (layout.minWidth) styles.minWidth = layout.minWidth;
  if (layout.minHeight) styles.minHeight = layout.minHeight;
  if (layout.maxWidth) styles.maxWidth = layout.maxWidth;
  if (layout.maxHeight) styles.maxHeight = layout.maxHeight;
  if (layout.fullWidth) styles.width = "100%";
  if (layout.overflow) styles.overflow = layout.overflow;

  // Spacing properties
  if (layout.padding) styles.padding = layout.padding;
  if (layout.margin) styles.margin = layout.margin;

  // Style properties
  if (layout.backgroundColor) styles.backgroundColor = layout.backgroundColor;
  if (layout.background?.type === "color") {
    styles.backgroundColor = layout.background.value;
  } else if (layout.background?.type === "gradient") {
    styles.background = layout.background.value;
  } else if (layout.background?.type === "image") {
    styles.backgroundImage = `url(${layout.background.value})`;
    styles.backgroundSize = "cover";
    styles.backgroundPosition = "center";
  }

  if (layout.borderWidth && layout.borderStyle !== "none") {
    styles.borderWidth = layout.borderWidth;
    styles.borderStyle = layout.borderStyle || "solid";
    styles.borderColor = layout.borderColor || "#000000";
  }

  if (layout.borderRadius) styles.borderRadius = layout.borderRadius;
  if (layout.opacity !== undefined) styles.opacity = layout.opacity;
  if (layout.mixBlendMode)
    styles.mixBlendMode =
      layout.mixBlendMode as React.CSSProperties["mixBlendMode"];

  // Typography properties
  if (layout.fontFamily) styles.fontFamily = layout.fontFamily;
  if (layout.fontSize) styles.fontSize = layout.fontSize;
  if (layout.fontWeight) {
    const weightMap: Record<string, string> = {
      Thin: "100",
      Light: "300",
      Regular: "400",
      Medium: "500",
      Semibold: "600",
      Bold: "700",
      Black: "900",
    };
    styles.fontWeight = weightMap[layout.fontWeight] || layout.fontWeight;
  }
  if (layout.fontStyle) styles.fontStyle = layout.fontStyle;
  if (layout.textDecoration) styles.textDecoration = layout.textDecoration;
  if (layout.textAlign)
    styles.textAlign = layout.textAlign as React.CSSProperties["textAlign"];
  if (layout.lineHeight) styles.lineHeight = layout.lineHeight;
  if (layout.letterSpacing) styles.letterSpacing = layout.letterSpacing;

  // Legacy properties support
  if (!layout.flexDirection && layout.direction) {
    styles.display = "flex";
    styles.flexDirection = layout.direction;
  }
  if (!layout.alignItems && layout.align) {
    const alignMap: Record<string, React.CSSProperties["alignItems"]> = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      stretch: "stretch",
      baseline: "baseline",
    };
    styles.alignItems =
      alignMap[layout.align] ||
      (layout.align as React.CSSProperties["alignItems"]);
  }
  if (!layout.justifyContent && layout.justify) {
    const justifyMap: Record<string, React.CSSProperties["justifyContent"]> = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      between: "space-between",
      around: "space-around",
      evenly: "space-evenly",
    };
    styles.justifyContent =
      justifyMap[layout.justify] ||
      (layout.justify as React.CSSProperties["justifyContent"]);
  }

  return styles;
}
