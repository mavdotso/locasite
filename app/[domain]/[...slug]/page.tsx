import { notFound } from "next/navigation";
import { Metadata } from "next";
import { convex } from "@/app/lib/convex";

import { api } from "@/convex/_generated/api";
import BusinessHero from "@/app/components/business/hero";
import BusinessInfo from "@/app/components/business/info";
import BusinessAbout from "@/app/components/business/about";
import BusinessGallery from "@/app/components/business/gallery";
import BusinessReviews from "@/app/components/business/reviews";
import BusinessContact from "@/app/components/business/contact";
import BusinessMap from "@/app/components/business/map";
import BusinessContactForm from "@/app/components/business/contact-form";
import BusinessHeader from "@/app/components/business/header";
import BusinessFooter from "@/app/components/business/footer";
import { Section } from "@/app/types/businesses";

interface PageProps {
  params: Promise<{
    domain: string;
    slug: string[];
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { domain: businessDomain, slug: businessSlug } = await params;

  const domain = await convex.query(api.domains.getBySubdomain, {
    subdomain: businessDomain,
  });
  if (!domain) {
    return {
      title: "Not Found",
      description: "The requested site could not be found",
    };
  }
  const slug = businessSlug.join("/") || "home";
  const page = await convex.query(api.pages.getBySlug, {
    domain: domain._id,
    slug,
  });
  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found",
    };
  }
  const content = JSON.parse(page.content);
  return {
    title: content.title || domain.name,
    description: content.description || `Welcome to ${domain.name}`,
    openGraph: {
      title: content.title || domain.name,
      description: content.description || `Welcome to ${domain.name}`,
      url: `https://${domain.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${slug}`,
      siteName: domain.name,
      images: (() => {
        const heroSection = content.sections?.find(
          (s: Section) => s.type === "hero",
        );
        return heroSection?.image ? [{ url: heroSection.image }] : undefined;
      })(),
    },
    twitter: {
      card: "summary_large_image",
      title: content.title || domain.name,
      description: content.description || `Welcome to ${domain.name}`,
    },
  };
}
export default async function Page({ params }: PageProps) {
  const { domain: businessDomain, slug: businessSlug } = await params;

  const domain = await convex.query(api.domains.getBySubdomain, {
    subdomain: businessDomain,
  });

  if (!domain) {
    notFound();
  }

  const slug = businessSlug.join("/") || "home";
  const page = await convex.query(api.pages.getBySlug, {
    domain: domain._id,
    slug,
  });

  if (!page) {
    notFound();
  }

  // Get the business associated with this domain
  const business = await convex.query(api.businesses.listByDomain, {
    domain: domain._id,
  });

  if (!business || !business.length) {
    notFound();
  }

  // Fetch all pages for the navigation
  const pages = await convex.query(api.pages.listByDomain, {
    domainId: domain._id,
  });

  const businessData = business[0];
  let content;
  try {
    content = JSON.parse(page.content);
  } catch {
    return {
      title: "Invalid Content",
      description: "Page content is not in valid JSON format",
    };
  }
  return (
    <div className="flex flex-col min-h-screen">
      <BusinessHeader
        businessName={domain.name}
        pages={pages}
        currentSlug={slug}
      />
      <main className="flex-grow">
        {content.sections?.map((section: Section, index: number) => {
          switch (section.type) {
            case "hero":
              return (
                <BusinessHero
                  key={index}
                  title={section.title}
                  subtitle={section.subtitle}
                  image={section.image}
                />
              );
            case "info":
              return (
                <BusinessInfo
                  key={index}
                  address={section.address || businessData.address}
                  phone={section.phone || businessData.phone}
                  website={section.website || businessData.website}
                  hours={section.hours || businessData.hours}
                />
              );
            case "about":
              return <BusinessAbout key={index} content={section.content} />;
            case "gallery":
              return (
                <BusinessGallery
                  key={index}
                  images={section.images || businessData.photos || []}
                />
              );
            case "reviews":
              return <BusinessReviews key={index} reviews={section.items} />;
            case "contact":
              return (
                <BusinessContact
                  key={index}
                  title={section.title}
                  subtitle={section.subtitle}
                />
              );
            case "map":
              return (
                <BusinessMap
                  key={index}
                  address={section.address || businessData.address}
                />
              );
            case "contactForm":
              return <BusinessContactForm key={index} title={section.title} />;
            case "header":
              return (
                <div key={index} className="mx-auto px-4 py-12 container">
                  <h1 className="font-bold text-3xl md:text-4xl text-center">
                    {section.title}
                  </h1>
                </div>
              );
            case "content":
              return (
                <div key={index} className="mx-auto px-4 py-8 container">
                  <div className="mx-auto max-w-none prose">{section.text}</div>
                </div>
              );
            case "contactInfo":
              return (
                <div key={index} className="mx-auto px-4 py-8 container">
                  <div className="bg-white shadow mx-auto p-6 rounded-lg max-w-lg">
                    <h3 className="mb-4 font-semibold text-xl">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <p>
                        <strong>Address:</strong> {section.address}
                      </p>
                      {section.phone && (
                        <p>
                          <strong>Phone:</strong> {section.phone}
                        </p>
                      )}
                      <div>
                        <strong>Hours:</strong>
                        <ul className="mt-1 pl-0 list-none">
                          {section.hours?.map((hour, i) => (
                            <li
                              key={i}
                              className="py-1 border-gray-100 border-b text-sm"
                            >
                              {hour}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </main>
      <BusinessFooter businessName={domain.name} />
    </div>
  );
}
