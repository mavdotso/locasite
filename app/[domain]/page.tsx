import { notFound } from "next/navigation";
import { convex } from "@/app/lib/convex";
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

interface PageProps {
  params: Promise<{
    domain: string;
    slug: string[];
  }>;
}

export default async function BusinessPage({ params }: PageProps ) {

  const {domain: businessDomain} = await params;

  try {
    // Get domain from database
    const domain = await convex.query(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      console.log("Domain not found:", businessDomain);
      notFound();
    }

    // Get the home page
    const page = await convex.query(api.pages.getBySlug, {
      domain: businessDomain,
      slug: "home",
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
    } catch (error) {
      console.error("Error parsing page content:", error);
      return (
        <div className="p-8">
          <h1 className="font-bold text-red-500 text-2xl">Invalid Content</h1>
          <p>Page content is not in valid JSON format</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen">
        <BusinessHeader
          businessName={domain.name}
          pages={pages}
          currentSlug="home"
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
  } catch (error) {
    console.error("Error loading business page:", error);
    notFound();
  }
}