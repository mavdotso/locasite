import { Search, Palette, Globe } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Find the Business",
    description:
      "Search for any business on Google Maps and copy the URL from your browser.",
    icon: Search,
  },
  {
    number: "2",
    title: "Customize Design",
    description:
      "Our AI automatically creates a beautiful website. Customize colors, fonts, and content.",
    icon: Palette,
  },
  {
    number: "3",
    title: "Publish & Share",
    description:
      "Go live instantly with a free subdomain or connect your own custom domain.",
    icon: Globe,
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-50 filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-100 rounded-full opacity-50 filter blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Create a Website in
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              3 Simple Steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No coding required. No complicated setup. Just results in minutes.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connection Line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-20 hidden h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-blue-300 to-indigo-300 md:block z-0" />
                )}

                {/* Step Card */}
                <div className="relative bg-card rounded-2xl shadow-lg border border-blue-100 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Step Number */}
                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-lg">
                    {step.number}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-800">
                        ✓
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="p-3 rounded-full bg-blue-50 border border-blue-200">
                      <step.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Section */}
        <div className="mx-auto mt-24 max-w-5xl">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg">
            <h3 className="mb-6 text-center text-xl font-bold text-foreground">
              Try It With These Examples
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-blue-200 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <p className="font-semibold text-foreground">Coffee Shop</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Starbucks, Blue Bottle Coffee
                </p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <p className="font-semibold text-foreground">Restaurant</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Local pizzeria, sushi bar
                </p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                  <p className="font-semibold text-foreground">
                    Service Business
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Plumber, electrician, salon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
