import { Search, Sparkles, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Paste Your Link",
    description: "Drop your Google Maps URL into our generator",
    detail: "Just copy the link from Google Maps and paste it here. We'll handle the rest.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Sparkles,
    title: "We Import Everything",
    description: "Photos, hours, reviews, contact info—all automatic",
    detail: "We automatically extract all your business information from Google Maps in seconds.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Rocket,
    title: "Website Goes Live",
    description: "Your professional site is ready in 60 seconds",
    detail: "Get a beautiful, mobile-responsive website instantly. Ready to share with customers.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 border border-purple-200 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From Google Maps to professional website in three simple steps
          </p>
        </div>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className={`rounded-xl ${step.bgColor} p-8 h-full transition-all duration-300 group-hover:shadow-lg`}>
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-700">{index + 1}</span>
                </div>
                
                <div className={`inline-flex rounded-lg bg-white p-3 ${step.color} mb-4 shadow-sm`}>
                  <step.icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-lg font-medium mb-3">{step.description}</p>
                <p className="text-sm text-muted-foreground">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg font-medium mb-2">
            Ready to see it in action?
          </p>
          <p className="text-muted-foreground mb-8">
            Your business deserves a professional online presence
          </p>
          <a
            href="#hero"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
          >
            Try It Now - It&apos;s Free
            <Sparkles className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}