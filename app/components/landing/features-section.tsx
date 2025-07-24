import {
  Globe,
  Zap,
  Palette,
  Search,
  Shield,
  BarChart3,
  MessageSquare,
  Smartphone,
  Calendar,
  Star,
  Users,
  Mail,
  Share2,
  TrendingUp,
  Sparkles,
  Lock,
} from "lucide-react";

const currentFeatures = [
  {
    name: "Google Maps Import",
    description: "Instant import of all your business data",
    icon: Search,
    color: "text-blue-600",
  },
  {
    name: "Mobile-First Design",
    description: "Responsive templates that look great everywhere",
    icon: Smartphone,
    color: "text-purple-600",
  },
  {
    name: "SEO Optimization",
    description: "Built-in best practices for search rankings",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    name: "Contact Forms",
    description: "Capture leads with customizable forms",
    icon: MessageSquare,
    color: "text-indigo-600",
  },
  {
    name: "Analytics Dashboard",
    description: "Track visitors and engagement metrics",
    icon: BarChart3,
    color: "text-pink-600",
  },
  {
    name: "Custom Domains",
    description: "Your own domain or free subdomain",
    icon: Globe,
    color: "text-orange-600",
  },
  {
    name: "SSL Security",
    description: "Enterprise-grade security included",
    icon: Shield,
    color: "text-red-600",
  },
  {
    name: "Drag & Drop Editor",
    description: "Easy customization without coding",
    icon: Palette,
    color: "text-cyan-600",
  },
];

const upcomingFeatures = [
  {
    name: "Auto-Sync Updates",
    description: "Sync changes from Google automatically",
    icon: TrendingUp,
    status: "Coming soon",
  },
  {
    name: "Online Booking",
    description: "Let customers book appointments directly",
    icon: Calendar,
    status: "Coming soon",
  },
  {
    name: "Review Management",
    description: "Manage and display customer reviews",
    icon: Star,
    status: "Coming soon",
  },
  {
    name: "Multi-Location",
    description: "Manage multiple business locations",
    icon: Users,
    status: "Coming soon",
  },
  {
    name: "Email Marketing",
    description: "Built-in email campaigns",
    icon: Mail,
    status: "Coming soon",
  },
  {
    name: "Social Integration",
    description: "Connect all your social accounts",
    icon: Share2,
    status: "Coming soon",
  },
];

export default function FeaturesSection() {
  const allFeatures = [
    ...currentFeatures,
    ...upcomingFeatures.map(f => ({
      ...f,
      color: "text-muted-foreground",
      isComingSoon: true
    }))
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything You Need to
            <span className="text-primary"> Succeed Online</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features to help your business thrive in the digital world
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allFeatures.map((feature, index) => (
              <div
                key={feature.name}
                className={`relative rounded-lg border p-6 transition-all ${
                  feature.isComingSoon
                    ? "bg-muted/50 border-dashed border-muted-foreground/30 opacity-60"
                    : "bg-card hover:shadow-md hover:border-primary/20"
                }`}
              >
                <div className="mb-4">
                  <div
                    className={`inline-flex rounded-lg p-3 ${
                      feature.isComingSoon ? "bg-muted" : "bg-muted"
                    } ${feature.color}`}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  {feature.isComingSoon && (
                    <span className="ml-2 text-xs font-medium text-muted-foreground">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className={`mb-1 font-semibold ${
                  feature.isComingSoon ? "text-muted-foreground" : ""
                }`}>
                  {feature.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Have a feature request?{" "}
            <a href="#contact" className="text-primary hover:underline font-medium">
              Let us know
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
