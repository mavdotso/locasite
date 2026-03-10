const fs = require('fs');
const path = require('path');

const generatedSlugs = [
  'free-dentist-website',
  'free-electrician-website',
  'free-barber-shop-website',
  'free-nail-salon-website',
  'free-auto-repair-website',
  'free-hvac-website',
  'free-gym-website',
  'free-coffee-shop-website',
  'free-bakery-website',
  'free-landscaping-website',
  'free-cleaning-service-website',
  'free-veterinarian-website',
  'free-chiropractor-website',
  'free-dry-cleaner-website',
  'free-tattoo-shop-website',
  'free-car-wash-website',
  'free-pet-grooming-website',
  'free-photographer-website',
  'free-florist-website',
  'free-roofing-website',
  'free-pest-control-website',
  'free-handyman-website',
  'free-pool-service-website',
  'free-pressure-washing-website',
  'free-tree-service-website',
  'free-lawyer-website',
  'free-accountant-website',
  'free-real-estate-agent-website',
];

const pagesDir = path.join(__dirname, '..', 'app', '(pages)');

function toPascalCase(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function getCategoryKey(slug) {
  return slug.replace('free-', '').replace('-website', '');
}

let created = 0;
let skipped = 0;

for (const slug of generatedSlugs) {
  const dir = path.join(pagesDir, slug);
  const filePath = path.join(dir, 'page.tsx');

  if (fs.existsSync(filePath)) {
    console.log('SKIP (exists):', slug);
    skipped++;
    continue;
  }

  const funcName = toPascalCase(slug) + 'Page';
  const categoryKey = getCategoryKey(slug);

  const content = `import type { Metadata } from "next";
import SEOLandingPage from "@/app/components/landing/seo/seo-landing-page";
import { seoPages, categoryPreviewConfigs } from "@/app/lib/seo-landing-data";
import GenericBusinessPreview from "@/app/components/landing/seo/previews/generic-business-preview";

const config = {
  ...seoPages["${slug}"],
  previewComponent: function Preview() {
    return <GenericBusinessPreview config={categoryPreviewConfigs["${categoryKey}"]} />;
  },
};

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: \`https://locosite.io/\${config.slug}\` },
};

export default function ${funcName}() {
  return <SEOLandingPage config={config} />;
}
`;

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('CREATED:', slug);
  created++;
}

console.log(`\nDone: ${generatedSlugs.length} total, ${created} created, ${skipped} skipped`);
