import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";
import { Id } from "./_generated/dataModel";

// Create a page with custom content
export const createPageWithContent = mutation({
  args: {
    domainId: v.id("domains"),
    businessId: v.id("businesses"),
    content: v.string(),
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
      // Update existing page instead of creating new one
      await ctx.db.patch(existingPage._id, {
        content: args.content,
        lastEditedAt: Date.now(),
      });
      return { pageId: existingPage._id };
    }

    // Create the page with provided content
    const pageId = await ctx.db.insert("pages", {
      domainId: args.domainId,
      content: args.content,
      isPublished: false,
      lastEditedAt: Date.now(),
    });

    console.log(
      `Created page ${pageId} for business ${args.businessId} with custom content`,
    );

    return { pageId };
  },
});

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
          id: "header",
          type: "header-section",
          content: {
            businessName: business.name,
            logo: business.name,
            logoAlt: business.name,
            menuItems: [
              { label: "Home", link: "#hero" },
              { label: "About", link: "#about" },
              { label: "Services", link: "#services" },
              { label: "Gallery", link: "#gallery" },
              { label: "Reviews", link: "#reviews" },
              { label: "Contact", link: "#contact" },
            ],
            showButton: true,
            buttonText: "Get Started",
            buttonLink: "#contact",
          },
          style: {
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
            sticky: true,
          },
        },
      },
      // 2. Hero section
      {
        id: "hero-1",
        variationId: "hero-center-bg",
        order: 1,
        data: {
          id: "hero",
          type: "hero-section",
          content: {
            title: business.name,
            subtitle:
              business.description ||
              "Welcome to our business. We're here to serve you with excellence.",
            ctaButton: {
              label: "Contact Us",
              href: "#contact",
            },
            backgroundImage: business.photos?.[0] || "",
          },
          style: {
            backgroundColor: "#1F2937",
            overlay: true,
            overlayOpacity: 0.5,
          },
        },
      },
      // 3. About section
      {
        id: "about-1",
        variationId: "about-text-image",
        order: 2,
        data: {
          id: "about",
          type: "about-section",
          content: {
            title: `About ${business.name}`,
            description:
              business.description ||
              "We are dedicated to providing exceptional service and quality to our customers. Our commitment to excellence drives everything we do.",
            image: business.photos?.[1] || "",
            features: [
              "Professional Service",
              "Quality Guaranteed",
              "Customer Satisfaction",
            ],
          },
          style: {
            backgroundColor: "#FFFFFF",
          },
        },
      },
      // 4. Services section (if applicable)
      {
        id: "services-1",
        variationId: "services-3-column",
        order: 3,
        data: {
          id: "services",
          type: "services-grid",
          content: {
            title: "Our Services",
            subtitle: "What we offer",
            services: [
              {
                title: "Service One",
                description:
                  "Professional service delivered with care and attention to detail.",
                icon: "star",
              },
              {
                title: "Service Two",
                description:
                  "Quality solutions tailored to meet your specific needs.",
                icon: "check-circle",
              },
              {
                title: "Service Three",
                description:
                  "Reliable support and assistance whenever you need it.",
                icon: "shield",
              },
            ],
          },
          style: {
            backgroundColor: "#F0F7FF",
          },
        },
      },
      // 5. Gallery section
      {
        id: "gallery-1",
        variationId: "gallery-grid",
        order: 4,
        data: {
          id: "gallery",
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
          style: {
            backgroundColor: "#FFFFFF",
          },
        },
      },
      // 6. Contact section
      {
        id: "contact-1",
        variationId: "contact-form-map",
        order: 5,
        data: {
          id: "contact",
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
          style: {
            backgroundColor: "#F0F7FF",
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