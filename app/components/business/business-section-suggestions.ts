// Business-type specific section suggestions
export interface SectionSuggestion {
  id: string;
  variationId: string;
  order: number;
  data: {
    id: string;
    type: string;
    content: Record<string, unknown>;
  };
}

export function getBusinessTypeSections(
  businessData: { photos?: string[]; phone?: string; hours?: string[] },
  category?: string,
): SectionSuggestion[] {
  const baseSections: SectionSuggestion[] = [];

  if (!category) return baseSections;

  // Restaurant-specific sections
  if (
    [
      "restaurant",
      "cafe",
      "bar",
      "bakery",
      "meal_delivery",
      "meal_takeaway",
      "food",
    ].includes(category)
  ) {
    baseSections.push({
      id: "menu-1",
      variationId: "menu-section",
      order: 2,
      data: {
        id: "menu-1",
        type: "menu-section",
        content: {
          title: "Our Menu",
          subtitle: "Delicious options for every taste",
          categories: [
            {
              name: "Popular Items",
              items: [
                {
                  name: "House Special",
                  description: "Chef's selection",
                  price: "$12",
                },
                {
                  name: "Signature Dish",
                  description: "Customer favorite",
                  price: "$18",
                },
              ],
            },
          ],
        },
      },
    });
  }

  // Health & Wellness specific sections
  if (
    [
      "gym",
      "spa",
      "beauty_salon",
      "hair_care",
      "health",
      "doctor",
      "dentist",
    ].includes(category)
  ) {
    baseSections.push({
      id: "services-detailed-1",
      variationId: "services-detailed",
      order: 2,
      data: {
        id: "services-detailed-1",
        type: "services-detailed",
        content: {
          title: "Our Services",
          subtitle: "Professional care tailored to your needs",
          services: [
            {
              title: "Consultation",
              description: "Personalized assessment and planning",
              duration: "30-60 min",
              price: "Varies",
            },
          ],
        },
      },
    });
  }

  // Retail/Shopping specific
  if (
    [
      "store",
      "clothing_store",
      "electronics_store",
      "furniture_store",
    ].includes(category)
  ) {
    baseSections.push({
      id: "featured-products-1",
      variationId: "featured-products",
      order: 2,
      data: {
        id: "featured-products-1",
        type: "featured-products",
        content: {
          title: "Featured Products",
          subtitle: "Our top selections",
          products:
            businessData.photos
              ?.slice(0, 3)
              .map((photo: string, index: number) => ({
                name: `Featured Item ${index + 1}`,
                image: photo,
                description: "Quality products",
                price: "See in store",
              })) || [],
        },
      },
    });
  }

  // Service businesses
  if (
    [
      "plumber",
      "electrician",
      "contractor",
      "car_repair",
      "locksmith",
    ].includes(category)
  ) {
    baseSections.push({
      id: "emergency-1",
      variationId: "emergency-services",
      order: 1,
      data: {
        id: "emergency-1",
        type: "emergency-services",
        content: {
          title: "24/7 Emergency Service",
          phone: businessData.phone,
          message: "Available for urgent needs",
          icon: "phone",
        },
      },
    });
  }

  return baseSections;
}
