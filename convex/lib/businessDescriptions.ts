// Generate default business descriptions based on Google Places types/categories
export function generateDefaultDescription(businessName: string, category?: string): string {
  if (!category) {
    return `Welcome to ${businessName}. We're dedicated to providing exceptional service to our community.`;
  }

  // Map Google Places types to user-friendly descriptions
  const categoryDescriptions: Record<string, string> = {
    // Food & Dining
    restaurant: `Experience exceptional dining at ${businessName}. Our restaurant offers delicious cuisine and a welcoming atmosphere for every occasion.`,
    cafe: `Your neighborhood coffee destination. ${businessName} serves freshly brewed coffee, delicious pastries, and a cozy atmosphere to start your day right.`,
    bar: `Unwind and enjoy at ${businessName}. We offer a great selection of drinks, a vibrant atmosphere, and the perfect place to relax with friends.`,
    bakery: `Fresh baked goods daily at ${businessName}. From artisan breads to delectable pastries, we craft everything with love and the finest ingredients.`,
    meal_delivery: `${businessName} brings delicious meals right to your door. Enjoy restaurant-quality food from the comfort of your home.`,
    meal_takeaway: `Quick, delicious takeout from ${businessName}. Perfect for busy days when you want great food without the wait.`,
    
    // Retail & Shopping
    store: `${businessName} is your trusted local store. We offer quality products and personalized service to meet all your shopping needs.`,
    clothing_store: `Discover the latest fashion at ${businessName}. Our curated collection offers style and quality for every taste and occasion.`,
    electronics_store: `Your technology destination. ${businessName} provides the latest electronics, expert advice, and outstanding customer service.`,
    furniture_store: `Transform your space with ${businessName}. We offer quality furniture and design solutions to make your house a home.`,
    grocery_or_supermarket: `${businessName} - your neighborhood grocery store. Fresh produce, quality products, and everything you need for your family.`,
    
    // Health & Wellness
    gym: `Achieve your fitness goals at ${businessName}. Our modern facility and expert trainers are here to support your wellness journey.`,
    spa: `Relax and rejuvenate at ${businessName}. We offer luxurious treatments and a tranquil environment for your ultimate wellness experience.`,
    beauty_salon: `Look and feel your best at ${businessName}. Our skilled professionals provide top-quality beauty services in a welcoming environment.`,
    hair_care: `Expert hair styling and care at ${businessName}. From cuts to colors, we help you achieve the perfect look.`,
    doctor: `${businessName} provides compassionate healthcare. Our medical professionals are dedicated to your health and well-being.`,
    dentist: `Smile with confidence. ${businessName} offers comprehensive dental care in a comfortable, modern setting.`,
    hospital: `${businessName} - committed to your health. We provide comprehensive medical services with compassion and expertise.`,
    pharmacy: `Your health is our priority at ${businessName}. We offer prescription services, health products, and personalized care.`,
    
    // Services
    car_repair: `Expert auto service at ${businessName}. We keep your vehicle running smoothly with professional repairs and maintenance.`,
    car_wash: `${businessName} makes your car shine. Professional car washing and detailing services to keep your vehicle looking its best.`,
    gas_station: `${businessName} - more than just fuel. Quick service, convenience items, and everything you need for your journey.`,
    plumber: `Reliable plumbing services from ${businessName}. We solve your plumbing problems quickly and professionally.`,
    electrician: `${businessName} - your trusted electrical experts. Safe, reliable electrical services for homes and businesses.`,
    lawyer: `${businessName} provides expert legal counsel. We're dedicated to protecting your rights and achieving the best outcomes for our clients.`,
    accounting: `Trust ${businessName} with your finances. Professional accounting services to help you manage and grow your wealth.`,
    insurance_agency: `${businessName} protects what matters most. Comprehensive insurance solutions tailored to your needs.`,
    real_estate_agency: `Find your dream property with ${businessName}. Expert real estate services for buyers, sellers, and investors.`,
    
    // Education & Community
    school: `${businessName} - nurturing minds, building futures. Quality education in a supportive learning environment.`,
    library: `${businessName} - your community's gateway to knowledge. Books, resources, and programs for learners of all ages.`,
    church: `Welcome to ${businessName}. Join our faith community for worship, fellowship, and spiritual growth.`,
    park: `${businessName} - your outdoor oasis. Enjoy nature, recreation, and community gatherings in our beautiful space.`,
    
    // Hospitality & Tourism
    lodging: `Welcome to ${businessName}. Comfortable accommodations and exceptional service for a memorable stay.`,
    hotel: `Experience hospitality at its finest at ${businessName}. Luxurious rooms, excellent amenities, and unforgettable service.`,
    travel_agency: `Let ${businessName} plan your perfect trip. Expert travel planning and personalized service for unforgettable journeys.`,
    tourist_attraction: `Discover ${businessName}. An unforgettable experience awaits with unique attractions and memorable moments.`,
    
    // Entertainment & Leisure
    movie_theater: `${businessName} - your cinema destination. Enjoy the latest movies in comfort with state-of-the-art sound and picture.`,
    night_club: `Experience the nightlife at ${businessName}. Great music, vibrant atmosphere, and unforgettable nights out.`,
    bowling_alley: `Strike up some fun at ${businessName}. Family-friendly bowling, great food, and entertainment for all ages.`,
    amusement_park: `Create magical memories at ${businessName}. Thrilling rides, family fun, and entertainment for visitors of all ages.`,
    
    // Default fallback
    establishment: `Welcome to ${businessName}. We're proud to serve our community with quality products and exceptional service.`,
    point_of_interest: `Discover ${businessName}. A local landmark offering unique experiences and memorable visits.`,
    finance: `${businessName} - your trusted financial partner. Professional financial services to help you achieve your goals.`,
    food: `Delicious dining at ${businessName}. We're passionate about great food and exceptional service.`,
    health: `Your wellness partner - ${businessName}. Dedicated to helping you achieve and maintain optimal health.`,
    general_contractor: `${businessName} - building excellence. Professional construction and renovation services for your project needs.`,
    roofing_contractor: `${businessName} - protecting your home from above. Expert roofing services you can trust.`,
    painter: `Transform your space with ${businessName}. Professional painting services for beautiful, lasting results.`,
    florist: `${businessName} - beauty in bloom. Fresh flowers and creative arrangements for every occasion.`,
    veterinary_care: `${businessName} cares for your pets like family. Compassionate veterinary services for your furry friends.`,
    pet_store: `Everything for your pets at ${businessName}. Quality products and expert advice for happy, healthy pets.`,
    laundry: `${businessName} - fresh, clean, convenient. Professional laundry services to save you time and effort.`,
    locksmith: `${businessName} - your security experts. Fast, reliable locksmith services when you need them most.`,
    storage: `Secure storage solutions at ${businessName}. Clean, safe, and accessible storage for your belongings.`,
    funeral_home: `${businessName} - caring support in difficult times. Compassionate funeral services to honor your loved ones.`,
    cemetery: `${businessName} - a peaceful final resting place. Beautifully maintained grounds for remembrance and reflection.`,
    campground: `Experience the outdoors at ${businessName}. Beautiful camping facilities for your perfect getaway.`,
    rv_park: `${businessName} welcomes RV travelers. Full amenities and a friendly atmosphere for your road trip adventure.`,
    stadium: `${businessName} - where champions play. Experience the excitement of live sports and events.`,
    zoo: `Wild adventures await at ${businessName}. Educational and entertaining animal experiences for the whole family.`,
    aquarium: `Dive into wonder at ${businessName}. Explore amazing marine life and underwater worlds.`,
    art_gallery: `${businessName} - celebrating creativity. Discover inspiring artworks and cultural exhibitions.`,
    museum: `Explore history and culture at ${businessName}. Engaging exhibits and educational experiences for all ages.`
  };

  // Check if we have a specific description for this category
  const description = categoryDescriptions[category];
  if (description) {
    return description;
  }

  // Try to find a partial match
  const categoryLower = category.toLowerCase();
  for (const [key, desc] of Object.entries(categoryDescriptions)) {
    if (categoryLower.includes(key) || key.includes(categoryLower)) {
      return desc;
    }
  }

  // Generic fallback
  return `Welcome to ${businessName}. We're proud to serve our community with quality products and exceptional service.`;
}

// Generate a tagline based on business category
export function generateDefaultTagline(businessName: string, category?: string): string {
  if (!category) {
    return "Quality Service, Exceptional Experience";
  }

  const taglines: Record<string, string> = {
    restaurant: "Delicious Food, Memorable Moments",
    cafe: "Great Coffee, Better Conversations", 
    bar: "Good Times, Great Drinks",
    bakery: "Freshly Baked, Made with Love",
    gym: "Your Fitness, Our Mission",
    spa: "Relax. Refresh. Rejuvenate.",
    beauty_salon: "Where Beauty Meets Excellence",
    doctor: "Caring for Your Health",
    car_repair: "Reliable Service You Can Trust",
    real_estate_agency: "Finding Your Perfect Home",
    hotel: "Your Home Away From Home",
    store: "Quality Products, Personal Service",
    school: "Educating Tomorrow's Leaders"
  };

  return taglines[category] || "Excellence in Everything We Do";
}