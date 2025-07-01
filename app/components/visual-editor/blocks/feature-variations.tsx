import React from "react";
import { ComponentVariation } from "../core/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CheckCircle, Zap, Shield, Users, Target, Sparkles } from "lucide-react";

// Feature Variation 1: Grid Layout
export const featureGrid: ComponentVariation = {
  id: "grid-layout",
  name: "Grid Layout",
  description: "Features in a clean grid with icons",
  defaultProps: {
    title: "Why Choose Us",
    subtitle: "We offer the best solutions for your needs",
    features: [
      {
        icon: "CheckCircle",
        title: "Reliable Service",
        description: "Count on us for consistent, dependable results every time."
      },
      {
        icon: "Zap",
        title: "Fast Delivery",
        description: "Quick turnaround times without compromising on quality."
      },
      {
        icon: "Shield",
        title: "Secure & Safe",
        description: "Your data and privacy are our top priority."
      },
      {
        icon: "Users",
        title: "Expert Team",
        description: "Skilled professionals dedicated to your success."
      }
    ],
    columns: 2,
    showIcons: true
  },
  render: (props) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      CheckCircle,
      Zap,
      Shield,
      Users,
      Target,
      Sparkles
    };

    const features = props.features as Array<{
      icon: string;
      title: string;
      description: string;
    }>;

    const columns = props.columns as number;
    const gridCols = columns === 3 ? "md:grid-cols-3" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-2";

    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{props.title as string}</h2>
            <p className="text-xl text-muted-foreground">{props.subtitle as string}</p>
          </div>
          <div className={`grid gap-8 ${gridCols}`}>
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || CheckCircle;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {(props.showIcons as boolean) !== false && (
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
};

// Feature Variation 2: Alternating Layout
export const featureAlternating: ComponentVariation = {
  id: "alternating-layout",
  name: "Alternating Layout",
  description: "Features with alternating image/text layout",
  defaultProps: {
    title: "Our Services",
    features: [
      {
        title: "Professional Consultation",
        description: "Get expert advice tailored to your specific needs and goals.",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600",
        bulletPoints: [
          "One-on-one sessions",
          "Customized solutions",
          "Follow-up support"
        ]
      },
      {
        title: "Implementation Support",
        description: "We help you every step of the way to ensure success.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
        bulletPoints: [
          "Hands-on assistance",
          "Training included",
          "Ongoing maintenance"
        ]
      }
    ]
  },
  render: (props) => {
    const features = props.features as Array<{
      title: string;
      description: string;
      image: string;
      bulletPoints: string[];
    }>;

    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {props.title as string}
          </h2>
          <div className="space-y-20">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-auto rounded-lg shadow-xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
};

// Feature Variation 3: Centered Icons
export const featureCentered: ComponentVariation = {
  id: "centered-icons",
  name: "Centered Icons",
  description: "Features with large centered icons",
  defaultProps: {
    title: "What We Offer",
    subtitle: "Comprehensive solutions for all your needs",
    features: [
      {
        icon: "Target",
        title: "Goal-Oriented",
        description: "We focus on achieving your objectives"
      },
      {
        icon: "Sparkles",
        title: "Innovation",
        description: "Cutting-edge solutions for modern challenges"
      },
      {
        icon: "Shield",
        title: "Protection",
        description: "Your security is our priority"
      }
    ],
    backgroundColor: "#f8f9fa"
  },
  render: (props) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      CheckCircle,
      Zap,
      Shield,
      Users,
      Target,
      Sparkles
    };

    const features = props.features as Array<{
      icon: string;
      title: string;
      description: string;
    }>;

    return (
      <section 
        className="py-20"
        style={{ backgroundColor: props.backgroundColor as string }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{props.title as string}</h2>
            <p className="text-xl text-muted-foreground">{props.subtitle as string}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Target;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
};

// Feature Variation 4: Minimal List
export const featureMinimalList: ComponentVariation = {
  id: "minimal-list",
  name: "Minimal List",
  description: "Simple feature list with checkmarks",
  defaultProps: {
    title: "Everything You Need",
    features: [
      "24/7 Customer Support",
      "Free Setup and Installation",
      "30-Day Money Back Guarantee",
      "Regular Updates and Maintenance",
      "Comprehensive Documentation",
      "Priority Technical Support"
    ],
    columns: 2
  },
  render: (props) => {
    const features = props.features as string[];
    const columns = props.columns as number;

    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {props.title as string}
          </h2>
          <div className={`grid gap-4 ${columns === 2 ? 'md:grid-cols-2' : ''}`}>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
};

// Export all variations
export const featureVariations: ComponentVariation[] = [
  featureGrid,
  featureAlternating,
  featureCentered,
  featureMinimalList
];