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
    name: "Online Booking",
    description: "Let customers book appointments directly",
    icon: Calendar,
    status: "Q1 2025",
  },
  {
    name: "Review Management",
    description: "Manage and display customer reviews",
    icon: Star,
    status: "Q1 2025",
  },
  {
    name: "Multi-Location",
    description: "Manage multiple business locations",
    icon: Users,
    status: "Q2 2025",
  },
  {
    name: "Email Marketing",
    description: "Built-in email campaigns",
    icon: Mail,
    status: "Q2 2025",
  },
  {
    name: "Social Integration",
    description: "Connect all your social accounts",
    icon: Share2,
    status: "Q2 2025",
  },
  {
    name: "AI Content Writer",
    description: "Generate SEO-optimized content",
    icon: Sparkles,
    status: "Q3 2025",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Current Features */}
        <div className="mb-24">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 border border-green-200 px-4 py-1.5 text-sm font-medium text-green-700 mb-4">
              Available Today
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Succeed Online
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features ready to use from day one
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {currentFeatures.map((feature) => (
                <div
                  key={feature.name}
                  className="relative rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20"
                >
                  <div className="mb-4">
                    <div
                      className={`inline-flex rounded-lg bg-muted p-3 ${feature.color}`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mb-1 font-semibold">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Features */}
        <div>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 border border-purple-200 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Coming Soon
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Exciting Features on the Horizon
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We're constantly improving to help your business grow
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingFeatures.map((feature) => (
                <div
                  key={feature.name}
                  className="relative rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/10 p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="inline-flex rounded-lg bg-background p-2 text-muted-foreground">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {feature.status}
                    </span>
                  </div>
                  <h3 className="mb-1 font-semibold">{feature.name}</h3>
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
              <a href="#contact" className="text-primary hover:underline">
                Let us know
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
