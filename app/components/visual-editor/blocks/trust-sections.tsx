import React from "react";
import { ComponentConfig } from "../types";
import { 
  Award,
  Shield,
  Star,
  Building,
  HandHeart,
  Trophy,
  BadgeCheck,
  Medal,
  Gem,
  Crown,
  ThumbsUp,
  MessageSquare
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";
import Image from "next/image";

// Type definitions for parsed data
interface AwardData {
  title: string;
  issuer: string;
  year: string;
  icon: string;
}

interface InvolvementData {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface ReviewData {
  author: string;
  rating: number;
  text: string;
  date: string;
}

interface MembershipData {
  name: string;
  logo: string;
  link: string;
  memberSince: string;
}

interface StoryData {
  title: string;
  customer: string;
  result: string;
  beforeImage: string;
  afterImage: string;
  testimonial: string;
}

// Awards & Certifications Section
export const AwardsCertificationsSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Awards & Recognition"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "Trusted by the community"
    },
    awards: {
      type: "array",
      label: "Awards/Certifications",
      defaultValue: [
        {
          title: "Best Local Business 2024",
          issuer: "Chamber of Commerce",
          year: "2024",
          icon: "trophy"
        },
        {
          title: "BBB Accredited",
          issuer: "Better Business Bureau",
          year: "Since 2020",
          icon: "shield"
        }
      ],
      itemType: {
        type: "text",
        label: "Award",
        defaultValue: "Award Title|Issuer|2024|trophy"
      },
      maxItems: 12
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "grid",
      options: [
        { value: "grid", label: "Grid" },
        { value: "carousel", label: "Carousel" },
        { value: "list", label: "List" }
      ]
    },
    showYear: {
      type: "select",
      label: "Show Year",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props) => {
    const { title, subtitle, awards = [], layout, showYear } = props as {
      title?: string;
      subtitle?: string;
      awards?: Array<string | Record<string, unknown>>;
      layout?: string;
      showYear?: string;
    };
    
    // Parse awards
    const awardData: AwardData[] = awards.map(award => {
      if (typeof award === 'string') {
        const [awardTitle, issuer, year, icon] = award.split('|');
        return { 
          title: awardTitle || '', 
          issuer: issuer || '', 
          year: year || '', 
          icon: icon || 'award' 
        };
      }
      // Handle object case
      const obj = award as Record<string, unknown>;
      return {
        title: String(obj.title || ''),
        issuer: String(obj.issuer || ''),
        year: String(obj.year || ''),
        icon: String(obj.icon || 'award')
      };
    });
    
    const iconMap = {
      trophy: Trophy,
      shield: Shield,
      award: Award,
      medal: Medal,
      star: Star,
      gem: Gem,
      crown: Crown,
      badge: BadgeCheck
    };
    
    if (layout === 'list') {
      return (
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {awardData.map((award, index) => {
                const Icon = iconMap[award.icon as keyof typeof iconMap] || Award;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{award.title}</h3>
                          <p className="text-muted-foreground">{award.issuer}</p>
                        </div>
                        {showYear === 'yes' && award.year && (
                          <div className="text-sm font-medium text-primary">
                            {award.year}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    
    // Grid layout (default)
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {awardData.map((award, index) => {
              const Icon = iconMap[award.icon as keyof typeof iconMap] || Award;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{award.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{award.issuer}</p>
                    {showYear === 'yes' && award.year && (
                      <p className="text-sm font-medium text-primary">{award.year}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
  icon: Award,
  category: "Trust & Social Proof"
};

// Community Involvement Section
export const CommunityInvolvementSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Community Involvement"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "Giving back to our community"
    },
    involvements: {
      type: "array",
      label: "Community Activities",
      defaultValue: [
        {
          title: "Annual Charity Drive",
          description: "Supporting local food banks",
          image: "",
          link: ""
        },
        {
          title: "Youth Sports Sponsor",
          description: "Proud sponsor of Little League",
          image: "",
          link: ""
        }
      ],
      itemType: {
        type: "text",
        label: "Activity",
        defaultValue: "Activity Title|Description||"
      },
      maxItems: 8
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "cards",
      options: [
        { value: "cards", label: "Cards" },
        { value: "timeline", label: "Timeline" },
        { value: "gallery", label: "Gallery" }
      ]
    }
  },
  render: (props) => {
    const { title, subtitle, involvements = [], layout } = props as {
      title?: string;
      subtitle?: string;
      involvements?: Array<string | Record<string, unknown>>;
      layout?: string;
    };
    
    // Parse involvements
    const involvementData: InvolvementData[] = involvements.map(inv => {
      if (typeof inv === 'string') {
        const [invTitle, description, image, link] = inv.split('|');
        return { 
          title: invTitle || '', 
          description: description || '', 
          image: image || '', 
          link: link || '' 
        };
      }
      // Handle object case
      const obj = inv as Record<string, unknown>;
      return {
        title: String(obj.title || ''),
        description: String(obj.description || ''),
        image: String(obj.image || ''),
        link: String(obj.link || '')
      };
    });
    
    if (layout === 'timeline') {
      return (
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8 relative before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-border">
                {involvementData.map((involvement, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-2 w-4 h-4 bg-primary rounded-full -translate-x-[7px]" />
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2">{involvement.title}</h3>
                        <p className="text-muted-foreground">{involvement.description}</p>
                        {involvement.link && (
                          <Button size="sm" variant="link" className="mt-2 p-0" asChild>
                            <a href={involvement.link} target="_blank" rel="noopener noreferrer">
                              Learn More →
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Cards layout (default)
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {involvementData.map((involvement, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                {involvement.image && (
                  <div className="relative h-48">
                    <Image
                      src={involvement.image || '/placeholder.png'}
                      alt={involvement.title || 'Community involvement'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <HandHeart className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">{involvement.title}</h3>
                      <p className="text-muted-foreground text-sm">{involvement.description}</p>
                      {involvement.link && (
                        <Button size="sm" variant="link" className="mt-2 p-0" asChild>
                          <a href={involvement.link} target="_blank" rel="noopener noreferrer">
                            Learn More →
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  },
  icon: HandHeart,
  category: "Trust & Social Proof"
};

// Google Reviews Integration Section
export const GoogleReviewsSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "What Our Customers Say"
    },
    showRating: {
      type: "select",
      label: "Show Overall Rating",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    rating: {
      type: "number",
      label: "Average Rating",
      defaultValue: 4.8,
      min: 0,
      max: 5,
      step: 0.1,
      showSlider: true
    },
    totalReviews: {
      type: "number",
      label: "Total Reviews",
      defaultValue: 127,
      min: 0,
      max: 9999
    },
    reviews: {
      type: "array",
      label: "Featured Reviews",
      defaultValue: [
        {
          author: "John D.",
          rating: 5,
          text: "Excellent service! Highly recommend to everyone.",
          date: "2 weeks ago"
        },
        {
          author: "Sarah M.",
          rating: 5,
          text: "Professional and friendly staff. Will definitely come back!",
          date: "1 month ago"
        },
        {
          author: "Mike R.",
          rating: 4,
          text: "Great experience overall. Very satisfied with the results.",
          date: "1 month ago"
        }
      ],
      itemType: {
        type: "text",
        label: "Review",
        defaultValue: "John D.|5|Great service!|2 weeks ago"
      },
      maxItems: 10
    },
    googleBusinessUrl: {
      type: "text",
      label: "Google Business Profile URL",
      defaultValue: "",
      placeholder: "https://g.page/your-business"
    }
  },
  render: (props) => {
    const { title, showRating, rating, totalReviews, reviews = [], googleBusinessUrl } = props as {
      title?: string;
      showRating?: string;
      rating?: number;
      totalReviews?: number;
      reviews?: Array<string | Record<string, unknown>>;
      googleBusinessUrl?: string;
    };
    
    // Parse reviews
    const reviewData: ReviewData[] = reviews.map(review => {
      if (typeof review === 'string') {
        const [author, reviewRating, text, date] = review.split('|');
        return { 
          author: author || '', 
          rating: parseInt(reviewRating || '5'), 
          text: text || '', 
          date: date || '' 
        };
      }
      // Handle object case
      const obj = review as Record<string, unknown>;
      return {
        author: String(obj.author || ''),
        rating: Number(obj.rating || 5),
        text: String(obj.text || ''),
        date: String(obj.date || '')
      };
    });
    
    const renderStars = (starRating: number) => {
      return (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < starRating 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
      );
    };
    
    return (
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            
            {showRating === 'yes' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-8 h-8",
                          i < Math.floor(rating || 0) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-3xl font-bold">{rating}</span>
                </div>
                <p className="text-muted-foreground">
                  Based on {totalReviews} Google Reviews
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Image
                    src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_74x24dp.png"
                    alt="Google"
                    width={74}
                    height={24}
                  />
                  <span className="font-medium">Reviews</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
            {reviewData.map((review, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{review.author}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-muted-foreground">{review.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {googleBusinessUrl && (
            <div className="text-center mt-8">
              <Button asChild>
                <a href={googleBusinessUrl} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Read All Reviews on Google
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },
  icon: Star,
  category: "Trust & Social Proof"
};

// Membership Badges Section
export const MembershipBadgesSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Proud Member Of"
    },
    memberships: {
      type: "array",
      label: "Memberships",
      defaultValue: [
        {
          name: "Chamber of Commerce",
          logo: "",
          link: "",
          memberSince: "2015"
        },
        {
          name: "Better Business Bureau",
          logo: "",
          link: "",
          memberSince: "2018"
        },
        {
          name: "Industry Association",
          logo: "",
          link: "",
          memberSince: "2020"
        }
      ],
      itemType: {
        type: "text",
        label: "Membership",
        defaultValue: "Chamber of Commerce|||2015"
      },
      maxItems: 8
    },
    showMemberSince: {
      type: "select",
      label: "Show Member Since",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "logos",
      options: [
        { value: "logos", label: "Logo Grid" },
        { value: "cards", label: "Cards" },
        { value: "compact", label: "Compact List" }
      ]
    }
  },
  render: (props) => {
    const { title, memberships = [], showMemberSince, layout } = props as {
      title?: string;
      memberships?: Array<string | Record<string, unknown>>;
      showMemberSince?: string;
      layout?: string;
    };
    
    // Parse memberships
    const membershipData: MembershipData[] = memberships.map(membership => {
      if (typeof membership === 'string') {
        const [name, logo, link, memberSince] = membership.split('|');
        return { 
          name: name || '', 
          logo: logo || '', 
          link: link || '', 
          memberSince: memberSince || '' 
        };
      }
      // Handle object case
      const obj = membership as Record<string, unknown>;
      return {
        name: String(obj.name || ''),
        logo: String(obj.logo || ''),
        link: String(obj.link || ''),
        memberSince: String(obj.memberSince || '')
      };
    });
    
    if (layout === 'compact') {
      return (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-muted rounded-lg p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {membershipData.map((membership, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        {membership.link ? (
                          <a
                            href={membership.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {membership.name}
                          </a>
                        ) : (
                          <span className="font-medium">{membership.name}</span>
                        )}
                        {showMemberSince === 'yes' && membership.memberSince && (
                          <p className="text-sm text-muted-foreground">Since {membership.memberSince}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (layout === 'cards') {
      return (
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {membershipData.map((membership, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {membership.logo ? (
                      <div className="relative h-20 mb-4">
                        <Image
                          src={membership.logo || '/placeholder.png'}
                          alt={membership.name || 'Membership logo'}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Building className="w-10 h-10 text-primary" />
                      </div>
                    )}
                    <h3 className="font-semibold">{membership.name}</h3>
                    {showMemberSince === 'yes' && membership.memberSince && (
                      <p className="text-sm text-muted-foreground mt-1">Member Since {membership.memberSince}</p>
                    )}
                    {membership.link && (
                      <Button size="sm" variant="ghost" className="mt-3" asChild>
                        <a href={membership.link} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Logo grid layout (default)
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          
          <div className="flex flex-wrap items-center justify-center gap-8 max-w-5xl mx-auto">
            {membershipData.map((membership, index) => (
              <div key={index} className="text-center group">
                {membership.link ? (
                  <a
                    href={membership.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {membership.logo ? (
                      <div className="relative h-20 w-32 grayscale group-hover:grayscale-0 transition-all">
                        <Image
                          src={membership.logo || '/placeholder.png'}
                          alt={membership.name || 'Membership logo'}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-muted rounded-lg group-hover:bg-muted-foreground/10 transition-colors">
                        <Building className="w-12 h-12 text-muted-foreground group-hover:text-primary mx-auto mb-2" />
                        <p className="font-medium">{membership.name}</p>
                      </div>
                    )}
                  </a>
                ) : (
                  <div>
                    {membership.logo ? (
                      <div className="relative h-20 w-32 grayscale">
                        <Image
                          src={membership.logo || '/placeholder.png'}
                          alt={membership.name || 'Membership logo'}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-muted rounded-lg">
                        <Building className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="font-medium">{membership.name}</p>
                      </div>
                    )}
                  </div>
                )}
                {showMemberSince === 'yes' && membership.memberSince && (
                  <p className="text-xs text-muted-foreground mt-2">Since {membership.memberSince}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
  icon: Building,
  category: "Trust & Social Proof"
};

// Customer Success Stories Section
export const CustomerSuccessSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Success Stories"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "Real results from real customers"
    },
    stories: {
      type: "array",
      label: "Success Stories",
      defaultValue: [
        {
          title: "Complete Kitchen Renovation",
          customer: "The Johnson Family",
          result: "Transformed outdated kitchen into modern dream space",
          beforeImage: "",
          afterImage: "",
          testimonial: "We couldn't be happier with the results!"
        }
      ],
      itemType: {
        type: "text",
        label: "Story",
        defaultValue: "Project Title|Customer Name|Result achieved|||Amazing experience!"
      },
      maxItems: 6
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "cards",
      options: [
        { value: "cards", label: "Cards" },
        { value: "beforeAfter", label: "Before/After" },
        { value: "detailed", label: "Detailed Stories" }
      ]
    }
  },
  render: (props) => {
    const { title, subtitle, stories = [], layout } = props as {
      title?: string;
      subtitle?: string;
      stories?: Array<string | Record<string, unknown>>;
      layout?: string;
    };
    
    // Parse stories
    const storyData: StoryData[] = stories.map(story => {
      if (typeof story === 'string') {
        const [storyTitle, customer, result, beforeImage, afterImage, testimonial] = story.split('|');
        return { 
          title: storyTitle || '', 
          customer: customer || '', 
          result: result || '', 
          beforeImage: beforeImage || '', 
          afterImage: afterImage || '', 
          testimonial: testimonial || '' 
        };
      }
      // Handle object case
      const obj = story as Record<string, unknown>;
      return {
        title: String(obj.title || ''),
        customer: String(obj.customer || ''),
        result: String(obj.result || ''),
        beforeImage: String(obj.beforeImage || ''),
        afterImage: String(obj.afterImage || ''),
        testimonial: String(obj.testimonial || '')
      };
    });
    
    if (layout === 'beforeAfter') {
      return (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
            </div>
            
            <div className="space-y-12 max-w-5xl mx-auto">
              {storyData.map((story, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{story.title}</CardTitle>
                    <p className="text-muted-foreground">{story.customer}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {story.beforeImage && story.afterImage && (
                        <>
                          <div>
                            <p className="font-medium mb-2">Before</p>
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                              <Image
                                src={story.beforeImage || '/placeholder.png'}
                                alt="Before"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium mb-2">After</p>
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                              <Image
                                src={story.afterImage || '/placeholder.png'}
                                alt="After"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mt-6">
                      <p className="font-medium mb-2">{story.result}</p>
                      {story.testimonial && (
                        <blockquote className="italic text-muted-foreground border-l-4 border-primary pl-4 mt-4">
                          &ldquo;{story.testimonial}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Cards layout (default)
    return (
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {storyData.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                {(story.beforeImage || story.afterImage) && (
                  <div className="relative h-48">
                    <Image
                      src={story.afterImage || story.beforeImage || '/placeholder.png'}
                      alt={story.title || 'Success story'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{story.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{story.customer}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{story.result}</p>
                  {story.testimonial && (
                    <div className="pt-4 border-t">
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm italic text-muted-foreground">
                        &ldquo;{story.testimonial}&rdquo;
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  },
  icon: ThumbsUp,
  category: "Trust & Social Proof"
};