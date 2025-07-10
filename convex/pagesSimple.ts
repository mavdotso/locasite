import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";
import { Id } from "./_generated/dataModel";

// Create default pages in simple mode format with EXACT same sections as preview
export const createDefaultPagesSimple = mutation({
  args: {
    domainId: v.id("domains"),
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args): Promise<{ pageId: Id<"pages"> }> => {
    const user = await getUserFromAuth(ctx);

    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    // Verify business ownership
    if (business.userId !== user._id) {
      throw new Error("Not authorized to create pages for this business");
    }

    const domain = await ctx.db.get(args.domainId);
    if (!domain) {
      throw new Error("Domain not found");
    }

    // Check if pages already exist to avoid duplicates
    const existingPage = await ctx.db
      .query("pages")
      .withIndex("by_domain", (q) => q.eq("domainId", args.domainId))
      .first();

    if (existingPage) {
      return { pageId: existingPage._id };
    }

    // Create EXACT same sections as shown in preview
    const sections = [
      // 1. Header section
      {
        id: "header-1",
        variationId: "header-section",
        order: 0,
        data: {
          id: "header-1",
          type: "header-section",
          content: {
            logo: business.name,
            logoAlt: business.name,
            menuItems: [
              { label: "Home", link: "#hero" },
              { label: "About", link: "#about" },
              { label: "Gallery", link: "#gallery" },
              { label: "Reviews", link: "#reviews" },
              { label: "Contact", link: "#contact" },
            ],
            showButton: true,
            buttonText: "Get in Touch",
            buttonLink: "#contact",
          },
        },
      },
      // 2. Hero section with business photo
      {
        id: "hero-1",
        variationId: "hero-section",
        order: 1,
        data: {
          id: "hero-1",
          type: "hero-section",
          content: {
            title: business.name,
            subtitle: business.description || "Welcome to our business",
            backgroundImage: business.photos?.[0] || undefined,
            ctaText: "Contact Us",
            ctaLink: "#contact",
            overlay: true,
            overlayOpacity: 40,
            height: "large",
          },
        },
      },
      // 3. About section
      {
        id: "about-1",
        variationId: "about-section",
        order: 2,
        data: {
          id: "about-1",
          type: "about-section",
          content: {
            title: "About Us",
            content:
              business.description ||
              `Welcome to ${business.name}. We are dedicated to providing excellent service to our customers.`,
            image: business.photos?.[1] || undefined,
            imagePosition: "right",
            features: [],
          },
        },
      },
      // 4. Reviews section
      {
        id: "reviews-1",
        variationId: "reviews-section",
        order: 3,
        data: {
          id: "reviews-1",
          type: "reviews-section",
          content: {
            title: "What Our Customers Say",
            subtitle: business.rating
              ? `${business.rating} ★ Rating`
              : "Customer Reviews",
            reviews: business.reviews?.slice(0, 3).map((review, index) => ({
              id: `review-${index}`,
              author: review.reviewer || `Customer ${index + 1}`,
              rating: parseInt(review.rating) || 5,
              content: review.text || "Great experience!",
              date: "Recently",
            })) || [
                {
                  id: "review-1",
                  author: "John Doe",
                  rating: 5,
                  content: "Excellent service and great experience!",
                  date: "Last week",
                },
                {
                  id: "review-2",
                  author: "Jane Smith",
                  rating: 5,
                  content: "Highly recommend! Professional and friendly staff.",
                  date: "2 weeks ago",
                },
              ],
          },
        },
      },
      // 5. Gallery section
      {
        id: "gallery-1",
        variationId: "gallery-grid",
        order: 4,
        data: {
          id: "gallery-1",
          type: "gallery-grid",
          content: {
            title: "Gallery",
            subtitle: "Take a look at our work",
            images:
              business.photos
                ?.filter((photo) => photo && photo.trim() !== "")
                .slice(0, 6)
                .map((photo, index) => ({
                  src: photo,
                  alt: `${business.name} image ${index + 1}`,
                })) || [],
            columns: 3,
          },
        },
      },
      // 6. Contact section
      {
        id: "contact-1",
        variationId: "contact-form-map",
        order: 5,
        data: {
          id: "contact-1",
          type: "contact-form-map",
          content: {
            title: "Get in Touch",
            subtitle: "We'd love to hear from you",
            address: business.address,
            phone: business.phone,
            email: "",
            hours: business.hours,
            mapUrl: `https://maps.google.com/?q=${encodeURIComponent(business.address)}`,
            showMap: true,
            showForm: true,
          },
        },
      },
    ];

    // Create page data in simple mode format
    const pageData = {
      mode: "simple",
      title: business.name || "Welcome",
      sections,
      theme: {
        colors: {
          primary: "#3B82F6",
          secondary: "#10B981",
          accent: "#F59E0B",
          background: "#FFFFFF",
          text: "#1F2937",
          muted: "#F3F4F6",
        },
        fonts: {
          heading: "Inter",
          body: "Inter",
        },
        spacing: {
          sectionPadding: "80px",
        },
      },
    };

    // Create the homepage
    const pageId = await ctx.db.insert("pages", {
      domainId: args.domainId,
      content: JSON.stringify(pageData),
      isPublished: false,
      lastEditedAt: Date.now(),
    });

    console.log(
      `Created simple mode page ${pageId} for business ${args.businessId} with 6 sections`,
    );

    return { pageId };
  },
});
