import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import BusinessHeader from "@/app/components/business/header";
import BusinessFooter from "@/app/components/business/footer";
import BusinessHero from "@/app/components/business/hero";
import BusinessInfo from "@/app/components/business/info";
import BusinessAbout from "@/app/components/business/about";
import BusinessGallery from "@/app/components/business/gallery";
import BusinessReviews from "@/app/components/business/reviews";
import BusinessContact from "@/app/components/business/contact";
import BusinessMap from "@/app/components/business/map";
import BusinessContactForm from "@/app/components/business/contact-form";
import { Section } from "@/app/types/businesses";
import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";

interface PageProps {
  params: Promise<{
    domain: string;
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { domain: businessDomain } = await params;

    // Get domain from database
    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      return {
        title: "Business Not Found",
      };
    }

    // Get the business associated with this domain
    const business = await fetchQuery(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!business || !business.length) {
      return {
        title: domain.name || "Business",
      };
    }

    const businessData = business[0];

    return {
      title: domain.name || "Business",
      description: businessData.description || `Welcome to ${domain.name}`,
      openGraph: {
        title: domain.name || "Business",
        description: businessData.description || `Welcome to ${domain.name}`,
        images: businessData.photos?.[0] ? [businessData.photos[0]] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Business Page",
    };
  }
}

export default async function BusinessPage({ params }: PageProps) {

  const { domain: businessDomain } = await params;

  try {
    // Get domain from database
    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      console.log("Domain not found:", businessDomain);
      notFound();
    }

    // Get the home page
    const page = await fetchQuery(api.pages.getBySlug, {
      domain: businessDomain,
      slug: "home",
    });

    if (!page) {
      notFound();
    }

    // Get the business associated with this domain
    const business = await fetchQuery(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!business || !business.length) {
      notFound();
    }

    // Fetch all pages for the navigation
    const pages = await fetchQuery(api.pages.listByDomain, {
      domainId: domain._id,
    });

    const businessData = business[0];
    let content;
    try {
      content = JSON.parse(page.content);
    } catch (error) {
      console.error("Error parsing page content:", error);
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-500">Invalid Content</h1>
          <p>Page content is not in valid JSON format</p>
        </div>
      );
    }


    return (
      <div className="flex flex-col min-h-screen">
        <BusinessHeader
          domain={domain.name}
          pages={pages}
          currentSlug="home"
        />

        {!businessData.userId && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200">
            <div className="container flex items-center justify-between mx-auto">
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Are you the owner of this business?
                </p>
                <p className="text-xs text-amber-600">
                  Claim your business to manage information and respond to customers
                </p>
              </div>
              <a 
                href={`/${businessDomain}/claim/${businessData._id}`}
                className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Claim this Business
              </a>
            </div>
          </div>
        )} 

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
                    email={section.email || businessData.email}
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
                    phone={businessData.phone}
                    email={businessData.email}
                    address={businessData.address}
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
                return <BusinessContactForm key={index} businessId={businessData._id} title={section.title} />;
              case "header":
                return (
                  <div key={index} className="container px-4 py-12 mx-auto">
                    <h1 className="text-3xl font-bold text-center md:text-4xl">
                      {section.title}
                    </h1>
                  </div>
                );
              case "content":
                return (
                  <div key={index} className="container px-4 py-8 mx-auto">
                    <div className="mx-auto prose max-w-none">{section.text}</div>
                  </div>
                );
              case "contactInfo":
                return (
                  <div key={index} className="container px-4 py-8 mx-auto">
                    <div className="max-w-lg p-6 mx-auto bg-card rounded-lg shadow">
                      <h3 className="mb-4 text-xl font-semibold">
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
                          <ul className="pl-0 mt-1 list-none">
                            {section.hours?.map((hour, i) => (
                              <li
                                key={i}
                                className="py-1 text-sm border-b border-border"
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
  } catch (error) {
    console.error("Error loading business page:", error);
    notFound();
  }
}

