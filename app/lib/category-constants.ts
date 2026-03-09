// Category normalization: map Google Maps subcategories to broad parent slugs
export const CATEGORY_NORMALIZATION_MAP: Record<string, string> = {
  // Restaurants & Food
  "italian-restaurant": "restaurants",
  "mexican-restaurant": "restaurants",
  "chinese-restaurant": "restaurants",
  "japanese-restaurant": "restaurants",
  "thai-restaurant": "restaurants",
  "indian-restaurant": "restaurants",
  "american-restaurant": "restaurants",
  "fast-food-restaurant": "restaurants",
  "seafood-restaurant": "restaurants",
  "pizza-restaurant": "restaurants",
  "sandwich-shop": "restaurants",
  "burger-restaurant": "restaurants",
  "bbq-restaurant": "restaurants",
  "breakfast-restaurant": "restaurants",
  cafe: "coffee-shops",
  "coffee-shop": "coffee-shops",
  bakery: "coffee-shops",
  "donut-shop": "coffee-shops",

  // Beauty & Personal Care
  "beauty-salon": "hair-salons",
  "hair-salon": "hair-salons",
  "barber-shop": "hair-salons",
  barbershop: "hair-salons",
  "nail-salon": "nail-salons",
  spa: "nail-salons",
  "waxing-salon": "nail-salons",
  "eyebrow-threading": "nail-salons",

  // Automotive
  "car-repair": "auto-repair",
  "auto-repair-shop": "auto-repair",
  "tire-shop": "auto-repair",
  "oil-change-service": "auto-repair",
  "auto-body-shop": "auto-repair",
  "transmission-shop": "auto-repair",
  "brake-shop": "auto-repair",
  "car-dealer": "auto-repair",

  // Legal
  lawyer: "lawyers",
  attorney: "lawyers",
  "law-firm": "lawyers",
  "divorce-lawyer": "lawyers",
  "personal-injury-lawyer": "lawyers",
  "immigration-lawyer": "lawyers",
  "criminal-defense-lawyer": "lawyers",

  // Medical & Dental
  dentist: "dentists",
  "dental-clinic": "dentists",
  orthodontist: "dentists",
  "cosmetic-dentist": "dentists",
  doctor: "doctors",
  "medical-clinic": "doctors",
  "urgent-care-facility": "doctors",
  pediatrician: "doctors",

  // Home Services
  plumber: "plumbers",
  "plumbing-supply-store": "plumbers",
  "hvac-contractor": "hvac",
  "air-conditioning": "hvac",
  "heating-contractor": "hvac",
  electrician: "electricians",
  "electrical-contractor": "electricians",
  "house-cleaning-service": "cleaning-services",
  "cleaning-service": "cleaning-services",
  "janitorial-service": "cleaning-services",
  "maid-service": "cleaning-services",
  landscaping: "landscapers",
  "landscaping-company": "landscapers",
  "lawn-care-service": "landscapers",

  // Fitness
  gym: "gyms",
  "fitness-center": "gyms",
  "yoga-studio": "gyms",
  "pilates-studio": "gyms",
  "crossfit-gym": "gyms",
  "boxing-gym": "gyms",
  "personal-trainer": "gyms",
};

export function normalizeCategorySlug(slug: string): string {
  return CATEGORY_NORMALIZATION_MAP[slug] ?? slug;
}

// Human-readable display names (replaces unslug())
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  restaurants: "Restaurants",
  "hair-salons": "Hair Salons",
  "auto-repair": "Auto Repair",
  "nail-salons": "Nail Salons",
  dentists: "Dentists",
  lawyers: "Lawyers",
  plumbers: "Plumbers",
  hvac: "HVAC & Air Conditioning",
  gyms: "Gyms & Fitness",
  "coffee-shops": "Coffee Shops",
  "cleaning-services": "Cleaning Services",
  electricians: "Electricians",
  landscapers: "Landscaping",
  doctors: "Doctors & Clinics",
};

// Schema.org @type per category (for ItemList structured data)
export const SCHEMA_TYPE_MAP: Record<string, string> = {
  restaurants: "Restaurant",
  "hair-salons": "HairSalon",
  "auto-repair": "AutoRepair",
  "nail-salons": "BeautySalon",
  dentists: "Dentist",
  lawyers: "Attorney",
  plumbers: "Plumber",
  hvac: "HVACBusiness",
  gyms: "SportsActivityLocation",
  "coffee-shops": "CafeOrCoffeeShop",
  "cleaning-services": "HouseCleaner",
  electricians: "Electrician",
  landscapers: "LandscapingBusiness",
  doctors: "Physician",
};

// Category-specific intro copy (by Alex Rivera, MAV-869)
// Each entry has body text and a CTA sentence with category-specific phrasing
export const CATEGORY_INTRO_COPY: Record<
  string,
  { body: string; ctaPrefix: string }
> = {
  restaurants: {
    body: "From Latin-fusion joints on Orange Avenue to late-night pho in the Mills 50 corridor, Orlando's restaurant scene runs a lot deeper than theme park food courts. With thousands of local spots spanning neighborhoods like Thornton Park, College Park, and Little Vietnam, finding the right place — with accurate hours, a real menu link, and photos that aren't five years old — takes more than a quick search. This directory lists hundreds of Orlando restaurants with up-to-date business info all in one place.",
    ctaPrefix: "Own a restaurant in Orlando?",
  },
  lawyers: {
    body: "Finding the right lawyer in Orlando matters — whether you're dealing with a car accident on I-4, an immigration question, or a family law situation that can't wait. Orange County has a deep legal market, with attorneys across personal injury, criminal defense, immigration, real estate, and more. This directory lists local Orlando law firms and solo practitioners with verified contact info and office hours, so you spend less time searching and more time getting help.",
    ctaPrefix: "Own a law firm in Orlando?",
  },
  dentists: {
    body: "Finding a dentist you actually trust in a new city shouldn't feel like a gamble. Whether you just moved to Orlando, aged out of your parents' plan, or are looking for a pediatric or cosmetic dentist for your family, this directory lists local Orlando dental practices with verified hours, location, and contact info. No outdated listings, no mystery offices. Just real local dentists you can call today.",
    ctaPrefix: "Own a dental practice in Orlando?",
  },
  "auto-repair": {
    body: "Orlando heat is hard on cars. Between the humidity, the long commutes from Kissimmee and Apopka, and the summer afternoons that will kill an untreated AC system, finding a mechanic you can trust before something breaks is worth the effort. This directory lists local Orlando auto repair shops — from full-service mechanics to tire specialists and oil change spots — with real hours and contact info so you're not guessing when you're stuck on the side of I-4.",
    ctaPrefix: "Own a shop in Orlando?",
  },
  "hair-salons": {
    body: "Orlando's salon scene reflects the city itself — diverse, vibrant, and deeply local. From Dominican blowout bars on Colonial Drive to natural hair specialists in Eatonville and full-service studios in Winter Park, there's no shortage of talented stylists. The harder part is finding one with hours that actually work, photos that show their real work, and a phone number that picks up. This directory makes that easier, with up-to-date info for hair salons across Orlando and surrounding neighborhoods.",
    ctaPrefix: "Own a salon in Orlando?",
  },
};

// Category-specific footer CTA copy
export const CATEGORY_FOOTER_CTA: Record<
  string,
  { heading: string; body: string; button: string }
> = {
  restaurants: {
    heading: "Is your restaurant listed here?",
    body: "Every month, thousands of Orlando locals search online for their next favorite spot. A free Locosite website puts your hours, location, and photos right where hungry customers are already looking — no tech skills required.",
    button: "Claim your free restaurant website",
  },
  lawyers: {
    heading: "Is your law firm listed here?",
    body: "Potential clients are searching for lawyers in Orlando right now. A free Locosite website gives your firm a professional online presence — with your practice areas, contact info, and office hours — ready to be found.",
    button: "Claim your free law firm website",
  },
  dentists: {
    heading: "Is your dental practice listed here?",
    body: "New patients in Orlando are searching for dentists online every day. A free Locosite website makes it easy for them to find your practice, see your hours, and get in touch — without relying on third-party directories you don't control.",
    button: "Claim your free dental practice website",
  },
  "auto-repair": {
    heading: "Is your auto shop listed here?",
    body: "When someone's car breaks down in Orlando, they search for local mechanics immediately. A free Locosite website puts your shop's hours, location, and services in front of drivers who need help right now.",
    button: "Claim your free auto shop website",
  },
  "hair-salons": {
    heading: "Is your salon listed here?",
    body: "New clients are searching for hair salons in Orlando every day. A free Locosite website showcases your work, lists your services, and makes it easy for them to book — all from one place you actually own.",
    button: "Claim your free salon website",
  },
};
