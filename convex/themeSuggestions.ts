import { ThemePreset } from "./themePresets";

// Google Business category to theme mapping
export const businessCategoryThemeMap: Record<string, string[]> = {
  // Food & Dining
  "restaurant": ["restaurant-cafe", "elegant-luxury", "modern-minimal"],
  "cafe": ["restaurant-cafe", "bold-playful", "modern-minimal"],
  "coffee_shop": ["restaurant-cafe", "bold-playful", "modern-minimal"],
  "bar": ["restaurant-cafe", "modern-minimal", "elegant-luxury"],
  "bakery": ["restaurant-cafe", "bold-playful"],
  "fast_food_restaurant": ["restaurant-cafe", "bold-playful"],
  "meal_delivery": ["restaurant-cafe", "modern-minimal"],
  "meal_takeaway": ["restaurant-cafe", "modern-minimal"],
  
  // Beauty & Wellness
  "beauty_salon": ["beauty-salon-spa", "elegant-luxury", "modern-minimal"],
  "spa": ["beauty-salon-spa", "elegant-luxury"],
  "hair_care": ["beauty-salon-spa", "bold-playful", "modern-minimal"],
  "nail_salon": ["beauty-salon-spa", "bold-playful"],
  "massage_therapist": ["beauty-salon-spa", "elegant-luxury"],
  "skin_care": ["beauty-salon-spa", "elegant-luxury", "modern-minimal"],
  
  // Fitness & Sports
  "gym": ["gym-fitness", "bold-playful", "modern-minimal"],
  "fitness_center": ["gym-fitness", "modern-minimal"],
  "yoga_studio": ["beauty-salon-spa", "modern-minimal", "elegant-luxury"],
  "personal_trainer": ["gym-fitness", "modern-minimal"],
  "sports_complex": ["gym-fitness", "professional-corporate"],
  
  // Healthcare
  "doctor": ["medical-healthcare", "professional-corporate", "modern-minimal"],
  "dentist": ["medical-healthcare", "professional-corporate"],
  "hospital": ["medical-healthcare", "professional-corporate"],
  "clinic": ["medical-healthcare", "professional-corporate"],
  "veterinary_care": ["medical-healthcare", "bold-playful"],
  "pharmacy": ["medical-healthcare", "professional-corporate"],
  "physiotherapist": ["medical-healthcare", "modern-minimal"],
  
  // Automotive
  "car_repair": ["automotive-repair", "professional-corporate", "modern-minimal"],
  "car_dealer": ["automotive-repair", "professional-corporate", "elegant-luxury"],
  "car_wash": ["automotive-repair", "bold-playful"],
  "gas_station": ["automotive-repair", "professional-corporate"],
  "auto_parts_store": ["automotive-repair", "professional-corporate"],
  "tire_shop": ["automotive-repair", "professional-corporate"],
  
  // Professional Services
  "lawyer": ["professional-corporate", "elegant-luxury", "modern-minimal"],
  "accounting": ["professional-corporate", "modern-minimal"],
  "insurance_agency": ["professional-corporate", "modern-minimal"],
  "real_estate_agency": ["professional-corporate", "elegant-luxury", "modern-minimal"],
  "bank": ["professional-corporate", "modern-minimal"],
  "financial_planner": ["professional-corporate", "elegant-luxury"],
  
  // Retail & Shopping
  "clothing_store": ["bold-playful", "elegant-luxury", "modern-minimal"],
  "jewelry_store": ["elegant-luxury", "modern-minimal"],
  "furniture_store": ["modern-minimal", "elegant-luxury", "professional-corporate"],
  "electronics_store": ["modern-minimal", "professional-corporate", "bold-playful"],
  "book_store": ["modern-minimal", "elegant-luxury", "bold-playful"],
  "florist": ["bold-playful", "elegant-luxury", "beauty-salon-spa"],
  
  // Creative & Entertainment
  "art_gallery": ["elegant-luxury", "modern-minimal", "bold-playful"],
  "photography_studio": ["modern-minimal", "elegant-luxury", "bold-playful"],
  "graphic_designer": ["bold-playful", "modern-minimal"],
  "web_designer": ["modern-minimal", "bold-playful", "professional-corporate"],
  "music_store": ["bold-playful", "modern-minimal"],
  "movie_theater": ["bold-playful", "modern-minimal", "elegant-luxury"],
  
  // Education
  "school": ["professional-corporate", "bold-playful", "modern-minimal"],
  "university": ["professional-corporate", "modern-minimal"],
  "tutoring_service": ["professional-corporate", "bold-playful", "modern-minimal"],
  "driving_school": ["automotive-repair", "professional-corporate"],
  
  // Home Services
  "plumber": ["professional-corporate", "automotive-repair", "modern-minimal"],
  "electrician": ["professional-corporate", "automotive-repair", "modern-minimal"],
  "contractor": ["professional-corporate", "automotive-repair"],
  "cleaning_service": ["professional-corporate", "modern-minimal", "bold-playful"],
  "landscaping": ["professional-corporate", "modern-minimal"],
  "moving_company": ["professional-corporate", "automotive-repair"],
};

// Default theme suggestions if category not found
export const defaultThemeSuggestions = [
  "modern-minimal",
  "professional-corporate",
  "bold-playful"
];

/**
 * Get theme suggestions based on business type/category
 * @param category - Google business category or type
 * @param limit - Maximum number of suggestions to return
 * @returns Array of theme IDs
 */
export function getThemeSuggestions(category: string | undefined, limit: number = 3): string[] {
  if (!category) {
    return defaultThemeSuggestions.slice(0, limit);
  }
  
  // Normalize category to lowercase and replace spaces with underscores
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, "_");
  
  // Check for exact match
  if (businessCategoryThemeMap[normalizedCategory]) {
    return businessCategoryThemeMap[normalizedCategory].slice(0, limit);
  }
  
  // Check for partial matches
  const partialMatches = Object.entries(businessCategoryThemeMap)
    .filter(([key]) => 
      key.includes(normalizedCategory) || 
      normalizedCategory.includes(key)
    )
    .flatMap(([, themes]) => themes);
  
  if (partialMatches.length > 0) {
    // Remove duplicates and return
    const uniqueThemes = [...new Set(partialMatches)];
    return uniqueThemes.slice(0, limit);
  }
  
  // Return default suggestions
  return defaultThemeSuggestions.slice(0, limit);
}

/**
 * Get theme suggestions based on industry
 * @param industry - Industry type
 * @param limit - Maximum number of suggestions to return
 * @returns Array of theme IDs
 */
export function getThemeSuggestionsByIndustry(industry: string | undefined, limit: number = 3): string[] {
  const industryThemeMap: Record<string, string[]> = {
    "food": ["restaurant-cafe", "bold-playful", "modern-minimal"],
    "beauty": ["beauty-salon-spa", "elegant-luxury", "modern-minimal"],
    "fitness": ["gym-fitness", "bold-playful", "modern-minimal"],
    "healthcare": ["medical-healthcare", "professional-corporate", "modern-minimal"],
    "automotive": ["automotive-repair", "professional-corporate", "modern-minimal"],
    "technology": ["modern-minimal", "professional-corporate", "bold-playful"],
    "creative": ["bold-playful", "modern-minimal", "elegant-luxury"],
    "corporate": ["professional-corporate", "modern-minimal", "elegant-luxury"],
    "luxury": ["elegant-luxury", "modern-minimal", "professional-corporate"],
  };
  
  if (!industry) {
    return defaultThemeSuggestions.slice(0, limit);
  }
  
  const normalizedIndustry = industry.toLowerCase();
  
  if (industryThemeMap[normalizedIndustry]) {
    return industryThemeMap[normalizedIndustry].slice(0, limit);
  }
  
  return defaultThemeSuggestions.slice(0, limit);
}