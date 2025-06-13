// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Convert RGB to oklch (simplified conversion)
export function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  // Normalize RGB values
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  // Simple approximation for lightness
  const l = (0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm);
  
  // Simple approximation for chroma (color intensity)
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const c = (max - min) * 0.5;
  
  // Simple approximation for hue
  let h = 0;
  if (c > 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / (max - min)) * 60;
    } else if (max === gNorm) {
      h = (2 + (bNorm - rNorm) / (max - min)) * 60;
    } else {
      h = (4 + (rNorm - gNorm) / (max - min)) * 60;
    }
    if (h < 0) h += 360;
  }
  
  return { l, c, h };
}

// Convert hex to oklch string
export function hexToOklch(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex; // Return original if conversion fails
  
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
  return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(3)})`;
}

// Get contrasting foreground color (white or black) based on background
export function getContrastingColor(bgHex: string): string {
  const rgb = hexToRgb(bgHex);
  if (!rgb) return '#000000';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? 'oklch(0.145 0 0)' : 'oklch(0.985 0 0)';
}