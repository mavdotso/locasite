import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { AIContentResult } from "./lib/types";

export const applyBusinessTemplate = action({
  args: {
    businessId: v.id("businesses"),
    templateId: v.optional(v.string()),
    regenerateContent: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Get the business
    const business: Doc<"businesses"> | null = await ctx.runQuery(api.businesses.getById, { id: args.businessId });
    if (!business) {
      throw new Error("Business not found");
    }

    try {
      // First, regenerate AI content if requested or if none exists
      if (args.regenerateContent || !business.aiGeneratedContent) {
        await ctx.runAction(api.regenerateAI.regenerateAIContentForBusiness, {
          businessId: args.businessId,
          includeReviews: true
        });
      }

      // Get the domain for this business
      const domain = business.domainId ? await ctx.runQuery(api.domains.getById, { id: business.domainId }) : null;
      if (!domain) {
        return { success: false, error: 'No domain found for this business' };
      }

      // Check if a page exists for this domain
      const page = await ctx.runQuery(api.pages.getByDomainId, { domainId: domain._id });
      if (!page) {
        // Create a new page if none exists
        await ctx.runMutation(api.pages.create, {
          domainId: domain._id,
          content: '{"components":[]}',
          isPublished: false
        });
      }

      // Get updated business with AI content
      const updatedBusiness = await ctx.runQuery(api.businesses.getById, { id: args.businessId });
      if (!updatedBusiness) {
        throw new Error("Business not found after update");
      }

      // Determine the appropriate template based on business category
      const businessCategory = await inferBusinessCategory(updatedBusiness!);
      const templateId = args.templateId || getTemplateIdForCategory(businessCategory);

      // Generate the page content based on the template
      const pageContent = await generatePageContent(templateId, updatedBusiness!);

      // Update the page with the new content
      await ctx.runMutation(api.pages.update, {
        domainId: domain._id,
        content: JSON.stringify(pageContent),
        isPublished: true
      });

      // Also apply a matching theme preset if available
      const themePresetId = getThemePresetForTemplate(templateId);
      if (themePresetId) {
        const themePreset = await ctx.runQuery(api.themes.getPresetById, { presetId: themePresetId });
        if (themePreset) {
          // Update the business with the theme ID
          await ctx.runMutation(internal.businesses.internal_updateBusiness, {
            id: args.businessId,
            business: {
              themeId: themePreset._id
            }
          });
        }
      }

      return { 
        success: true, 
        templateId,
        businessCategory,
        pageContentGenerated: true
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
});

// Helper function to infer business category
async function inferBusinessCategory(business: Doc<"businesses">): Promise<string> {
  const name = business.name.toLowerCase();
  const description = (business.description || '').toLowerCase();
  
  // Simple keyword-based categorization
  if (name.includes('restaurant') || name.includes('cafe') || name.includes('bar') || 
      name.includes('kitchen') || name.includes('grill') || description.includes('food')) {
    return 'restaurant';
  }
  if (name.includes('clinic') || name.includes('dental') || name.includes('medical') || 
      name.includes('health') || name.includes('doctor') || description.includes('medical')) {
    return 'healthcare';
  }
  if (name.includes('salon') || name.includes('spa') || name.includes('beauty') || 
      name.includes('wellness') || name.includes('fitness') || description.includes('beauty')) {
    return 'beauty-wellness';
  }
  if (name.includes('plumb') || name.includes('electric') || name.includes('repair') || 
      name.includes('contractor') || name.includes('handyman') || description.includes('home service')) {
    return 'home-services';
  }
  if (name.includes('law') || name.includes('consult') || name.includes('account') || 
      name.includes('agency') || name.includes('firm') || description.includes('professional')) {
    return 'professional';
  }
  if (name.includes('store') || name.includes('shop') || name.includes('boutique') || 
      name.includes('retail') || description.includes('shop')) {
    return 'retail';
  }
  
  // Default to professional services
  return 'professional';
}

// Map category to template ID
function getTemplateIdForCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'restaurant': 'restaurant',
    'healthcare': 'healthcare',
    'beauty-wellness': 'beauty-wellness',
    'home-services': 'home-services',
    'professional': 'professional',
    'retail': 'retail'
  };
  
  return categoryMap[category] || 'professional';
}

// Map template to theme preset
function getThemePresetForTemplate(templateId: string): string | null {
  const themeMap: Record<string, string> = {
    'restaurant': 'restaurant',
    'healthcare': 'healthcare',
    'beauty-wellness': 'beauty',
    'home-services': 'services',
    'professional': 'professional',
    'retail': 'retail'
  };
  
  return themeMap[templateId] || null;
}

// Section type for page components
interface PageSection {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: PageSection[];
}

// Generate page content based on template and business data
async function generatePageContent(templateId: string, business: Doc<"businesses">) {
  const aiContent = business.aiGeneratedContent as AIContentResult | undefined;
  
  // Base sections that all templates should have
  const sections: (PageSection | null)[] = [];
  
  // Add sections based on template type with AI-generated content
  switch (templateId) {
    case 'restaurant':
      sections.push(
        createHeroSection(business),
        createAboutSection(aiContent?.about),
        createMenuSection(),
        createSpecialOffersSection(aiContent?.specialOffers),
        createReviewsSection(),
        createHoursSection(),
        createCTASection(aiContent?.callToAction)
      );
      break;
      
    case 'healthcare':
      sections.push(
        createHeroSection(business),
        createFeaturesSection(aiContent?.features),
        createServicesSection(aiContent?.services),
        createTeamSection(aiContent?.team),
        createProcessSection(aiContent?.process),
        createFAQSection(aiContent?.faq),
        createReviewsSection(),
        createContactSection()
      );
      break;
      
    case 'beauty-wellness':
      sections.push(
        createHeroSection(business),
        createAboutSection(aiContent?.about),
        createServicesSection(aiContent?.services),
        createTeamSection(aiContent?.team),
        createGallerySection(),
        createSpecialOffersSection(aiContent?.specialOffers),
        createReviewsSection(),
        createLocationSection(),
        createCTASection(aiContent?.callToAction)
      );
      break;
      
    case 'home-services':
      sections.push(
        createHeroSection(business),
        createFeaturesSection(aiContent?.features),
        createServicesSection(aiContent?.services),
        createBeforeAfterSection(),
        createProcessSection(aiContent?.process),
        createSpecialOffersSection(aiContent?.specialOffers),
        createReviewsSection(),
        createCTASection(aiContent?.callToAction)
      );
      break;
      
    case 'retail':
      sections.push(
        createHeroSection(business),
        createFeaturesSection(aiContent?.features),
        createGallerySection(),
        createSpecialOffersSection(aiContent?.specialOffers),
        createStatsSection(aiContent?.stats),
        createReviewsSection(),
        createHoursSection(),
        createCTASection(aiContent?.callToAction)
      );
      break;
      
    case 'professional':
    default:
      sections.push(
        createHeroSection(business),
        createStatsSection(aiContent?.stats),
        createServicesSection(aiContent?.services),
        createProcessSection(aiContent?.process),
        createTeamSection(aiContent?.team),
        createReviewsSection(),
        createCTASection(aiContent?.callToAction)
      );
      break;
  }
  
  return {
    components: sections.filter(s => s !== null)
  };
}

// Helper functions to create sections
function createHeroSection(business: Doc<"businesses">): PageSection {
  const aiContent = business.aiGeneratedContent;
  return {
    id: generateId(),
    type: 'SectionBlock',
    props: {
      backgroundColor: 'default',
      padding: 'none',
      fullWidth: 'yes'
    },
    children: [{
      id: generateId(),
      type: 'HeroSection',
      props: {
        title: aiContent?.hero?.title || business.name,
        subtitle: aiContent?.hero?.subtitle || business.description || `Welcome to ${business.name}`,
        backgroundImage: business.photos?.[0] || '',
        height: 'large',
        overlay: 'dark',
        alignment: 'center'
      }
    }]
  };
}

function createAboutSection(aboutContent?: AIContentResult['about']): PageSection | null {
  if (!aboutContent) return null;
  return {
    id: generateId(),
    type: 'AboutSection',
    props: {
      title: 'About Us',
      content: aboutContent.content,
      showImage: 'yes',
      imagePosition: 'right'
    }
  };
}

function createServicesSection(servicesContent?: AIContentResult['services']): PageSection | null {
  if (!servicesContent) return null;
  return {
    id: generateId(),
    type: 'ServicesDetailedSection',
    props: {
      title: servicesContent.title || 'Our Services',
      subtitle: 'What we offer',
      layout: 'cards',
      showFeatures: 'yes'
    }
  };
}

function createFeaturesSection(featuresContent?: AIContentResult['features']): PageSection | null {
  if (!featuresContent) return null;
  return {
    id: generateId(),
    type: 'FeaturesSection',
    props: {
      title: featuresContent.title || 'Why Choose Us',
      subtitle: featuresContent.subtitle || '',
      layout: 'grid',
      iconStyle: 'circle',
      columns: '3'
    }
  };
}

function createTeamSection(teamContent?: AIContentResult['team']): PageSection | null {
  if (!teamContent) return null;
  return {
    id: generateId(),
    type: 'TeamSection',
    props: {
      title: teamContent.title || 'Meet Our Team',
      subtitle: teamContent.subtitle || '',
      layout: 'grid',
      teamSize: '3'
    }
  };
}

function createProcessSection(processContent?: AIContentResult['process']): PageSection | null {
  if (!processContent) return null;
  return {
    id: generateId(),
    type: 'ProcessTimelineSection',
    props: {
      title: processContent.title || 'Our Process',
      subtitle: processContent.subtitle || '',
      layout: 'timeline',
      showConnectors: 'yes'
    }
  };
}

function createFAQSection(faqContent?: AIContentResult['faq']): PageSection | null {
  if (!faqContent) return null;
  return {
    id: generateId(),
    type: 'FAQSection',
    props: {
      title: faqContent.title || 'Frequently Asked Questions',
      layout: 'accordion'
    }
  };
}

function createStatsSection(statsContent?: AIContentResult['stats']): PageSection | null {
  if (!statsContent) return null;
  return {
    id: generateId(),
    type: 'StatsCounterSection',
    props: {
      title: statsContent.title || '',
      layout: 'grid',
      backgroundColor: 'primary',
      showIcons: 'yes'
    }
  };
}

function createSpecialOffersSection(offersContent?: AIContentResult['specialOffers']): PageSection | null {
  if (!offersContent) return null;
  return {
    id: generateId(),
    type: 'SpecialOffersSection',
    props: {
      title: offersContent.title || 'Special Offers',
      layout: 'grid'
    }
  };
}

function createReviewsSection(): PageSection {
  return {
    id: generateId(),
    type: 'GoogleReviewsSection',
    props: {
      title: 'What Our Customers Say',
      showRating: 'yes',
      reviewSource: 'mixed',
      layout: 'grid',
      reviewsPerRow: '3',
      maxReviews: 6,
      showAuthorImage: 'yes'
    }
  };
}

function createGallerySection(): PageSection {
  return {
    id: generateId(),
    type: 'GallerySection',
    props: {
      title: 'Our Gallery',
      columns: '3',
      showCaptions: 'no'
    }
  };
}

function createBeforeAfterSection(): PageSection {
  return {
    id: generateId(),
    type: 'BeforeAfterSection',
    props: {
      title: 'Our Work',
      subtitle: 'See the results',
      layout: 'side-by-side',
      showLabels: 'yes'
    }
  };
}

function createMenuSection(): PageSection {
  return {
    id: generateId(),
    type: 'MenuPriceListSection',
    props: {
      title: 'Our Menu',
      layout: 'tabs',
      showDescriptions: 'yes'
    }
  };
}

function createHoursSection(): PageSection {
  return {
    id: generateId(),
    type: 'OperatingHoursSection',
    props: {
      title: 'Hours & Location',
      layout: 'split',
      showSpecialHours: 'yes'
    }
  };
}

function createLocationSection(): PageSection {
  return {
    id: generateId(),
    type: 'LocationDirectionsSection',
    props: {
      title: 'Find Us',
      showMap: 'yes',
      showDirections: 'yes'
    }
  };
}

function createContactSection(): PageSection {
  return {
    id: generateId(),
    type: 'ContactSection',
    props: {
      title: 'Get In Touch',
      showForm: 'yes',
      showMap: 'yes'
    }
  };
}

function createCTASection(ctaContent?: AIContentResult['callToAction']): PageSection | null {
  if (!ctaContent) return null;
  return {
    id: generateId(),
    type: 'CTABannerSection',
    props: {
      title: 'Ready to Get Started?',
      subtitle: 'Contact us today',
      primaryButtonText: ctaContent.primary || 'Get Started',
      secondaryButtonText: ctaContent.secondary || 'Learn More',
      layout: 'gradient',
      urgencyText: ctaContent.urgency || '',
      showPhone: 'yes'
    }
  };
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}