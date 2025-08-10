/**
 * Placeholder image utilities
 * Provides real placeholder images for templates and demo content
 */

// Use Unsplash Source for random placeholder images
// This provides real, high-quality images instead of grey boxes
const UNSPLASH_BASE = 'https://source.unsplash.com';

// Categories for different types of businesses
const IMAGE_CATEGORIES = {
  restaurant: 'restaurant,food,dining',
  healthcare: 'medical,health,hospital',
  beauty: 'beauty,spa,wellness',
  retail: 'shopping,store,retail',
  professional: 'office,business,professional',
  services: 'tools,repair,service',
  logo: 'logo,brand,company',
  hero: 'business,professional,modern',
  gallery: 'interior,workspace,modern',
  team: 'people,team,professional',
  product: 'product,item,showcase'
};

/**
 * Get a placeholder image URL
 * @param width - Image width
 * @param height - Image height
 * @param category - Type of image (e.g., 'restaurant', 'healthcare', 'team')
 * @param seed - Optional seed for consistent images
 */
export function getPlaceholderImage(
  width: number,
  height: number,
  category?: keyof typeof IMAGE_CATEGORIES,
  seed?: string
): string {
  // For logos, use a simple SVG placeholder
  if (category === 'logo') {
    return generateLogoPlaceholder(width, height);
  }

  // Use Unsplash for other images
  const keywords = category ? IMAGE_CATEGORIES[category] : IMAGE_CATEGORIES.hero;
  const seedParam = seed ? `?sig=${seed}` : '';
  
  return `${UNSPLASH_BASE}/${width}x${height}/?${keywords}${seedParam}`;
}

/**
 * Generate a simple logo placeholder SVG
 */
function generateLogoPlaceholder(width: number, height: number): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#2563eb"/>
      <text 
        text-anchor="middle" 
        x="${width / 2}" 
        y="${height / 2 + 5}" 
        style="fill:white;font-weight:bold;font-size:${Math.min(width, height) / 3}px;font-family:Arial,sans-serif"
      >
        LOGO
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Replace placeholder URLs in content
 * Converts /api/placeholder/WxH to real placeholder images
 */
export function replacePlaceholderUrls(content: string, businessType?: string): string {
  // Pattern to match /api/placeholder/width/height or /api/placeholder/widthxheight
  const placeholderPattern = /\/api\/placeholder\/(\d+)[x\/](\d+)/g;
  
  return content.replace(placeholderPattern, (match, width, height) => {
    const w = parseInt(width);
    const h = parseInt(height);
    
    // Determine category based on dimensions
    let category: keyof typeof IMAGE_CATEGORIES = 'gallery';
    if (w === h && w <= 200) {
      category = 'logo';
    } else if (w > 600 && h > 400) {
      category = 'hero';
    } else if (businessType) {
      category = businessType as keyof typeof IMAGE_CATEGORIES;
    }
    
    return getPlaceholderImage(w, h, category);
  });
}

/**
 * Get a set of gallery images for a business type
 */
export function getGalleryImages(
  businessType: keyof typeof IMAGE_CATEGORIES,
  count: number = 6
): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = [];
  
  for (let i = 0; i < count; i++) {
    const width = 400 + (i % 3) * 50; // Vary widths slightly
    const height = 300 + (i % 2) * 100; // Vary heights
    
    images.push({
      src: getPlaceholderImage(width, height, businessType, `gallery-${i}`),
      alt: `${businessType} image ${i + 1}`
    });
  }
  
  return images;
}

/**
 * Get team member placeholder images
 */
export function getTeamImages(count: number = 4): Array<{ src: string; alt: string; name: string; role: string }> {
  const roles = ['Manager', 'Specialist', 'Coordinator', 'Lead', 'Director', 'Expert'];
  const names = ['Alex Johnson', 'Sam Williams', 'Jordan Davis', 'Casey Brown', 'Morgan Smith', 'Taylor Jones'];
  
  return Array.from({ length: count }, (_, i) => ({
    src: getPlaceholderImage(300, 300, 'team', `team-${i}`),
    alt: `Team member ${i + 1}`,
    name: names[i % names.length],
    role: roles[i % roles.length]
  }));
}

/**
 * Get before/after images for transformations
 */
export function getBeforeAfterImages(
  category: keyof typeof IMAGE_CATEGORIES = 'services'
): Array<{ before: { src: string; alt: string }; after: { src: string; alt: string }; title: string }> {
  return [
    {
      before: { 
        src: getPlaceholderImage(600, 400, category, 'before-1'),
        alt: 'Before transformation'
      },
      after: {
        src: getPlaceholderImage(600, 400, category, 'after-1'),
        alt: 'After transformation'
      },
      title: 'Transformation Example 1'
    },
    {
      before: {
        src: getPlaceholderImage(600, 400, category, 'before-2'),
        alt: 'Before transformation'
      },
      after: {
        src: getPlaceholderImage(600, 400, category, 'after-2'),
        alt: 'After transformation'
      },
      title: 'Transformation Example 2'
    }
  ];
}