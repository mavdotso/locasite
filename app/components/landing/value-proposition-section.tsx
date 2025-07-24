import {
  Clock,
  CheckCircle,
  Search,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Instant Setup",
    description: "Your hours, photos, reviews—all imported automatically",
    detail: "Save 5+ hours of manual data entry. Everything from your Google Business Profile appears on your website instantly.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: CheckCircle,
    title: "Always Accurate",
    description: "Changes on Google? Your website updates instantly",
    detail: "Never worry about outdated information. When you update your Google Business Profile, your website reflects it immediately.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Search,
    title: "SEO Ready",
    description: "Same info everywhere means better search rankings",
    detail: "Google loves consistency. Having matching information across your profiles boosts your local search visibility.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

export default function ValuePropositionSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
            The Google Maps Advantage
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Never Enter Your Business Info Again
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your Google Business Profile becomes your website. 
            One source of truth, zero duplicate work.
          </p>
        </div>

        {/* Three Core Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className={`rounded-xl ${benefit.bgColor} p-8 h-full transition-all duration-300 group-hover:shadow-lg`}>
                <div className={`inline-flex rounded-lg bg-white p-3 ${benefit.color} mb-4 shadow-sm`}>
                  <benefit.icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-lg font-medium mb-3">{benefit.description}</p>
                <p className="text-sm text-muted-foreground">{benefit.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Process */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl blur-3xl opacity-30" />
            <div className="relative bg-white rounded-2xl border p-8 md:p-12">
              <h3 className="text-2xl font-bold text-center mb-8">How the Magic Happens</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Paste Your Link</h4>
                  <p className="text-sm text-muted-foreground">Drop your Google Maps URL into our generator</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">AI Imports Everything</h4>
                  <p className="text-sm text-muted-foreground">Photos, hours, reviews, contact info—all automatic</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Website Goes Live</h4>
                  <p className="text-sm text-muted-foreground">Your professional site is ready in 60 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg font-medium mb-2">
            Stop wasting time on manual updates
          </p>
          <p className="text-muted-foreground mb-8">
            Let your Google Business Profile power your entire web presence
          </p>
          <a
            href="#hero"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
          >
            Try It With Your Business
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
