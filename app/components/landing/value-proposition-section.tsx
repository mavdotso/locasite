import { 
  Zap, 
  Shield, 
  Palette, 
  TrendingUp, 
  Smartphone, 
  Clock,
  Globe,
  Search,
  CreditCard
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Setup',
    description: 'Go from Google Maps link to live website in under 60 seconds. No technical skills required.',
    color: 'text-yellow-600'
  },
  {
    icon: Search,
    title: 'SEO Optimized',
    description: 'Built-in SEO best practices ensure your business ranks higher in search results.',
    color: 'text-blue-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Every website looks perfect on all devices, from phones to desktops.',
    color: 'text-purple-600'
  },
  {
    icon: Palette,
    title: 'Fully Customizable',
    description: 'Drag-and-drop editor lets you customize every aspect of your site.',
    color: 'text-pink-600'
  },
  {
    icon: Globe,
    title: 'Custom Domain',
    description: 'Get a professional subdomain instantly or connect your own custom domain.',
    color: 'text-green-600'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'SSL certificates, DDoS protection, and 99.9% uptime guaranteed.',
    color: 'text-indigo-600'
  },
  {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    description: 'Track visitors, page views, and customer interactions in real-time.',
    color: 'text-orange-600'
  },
  {
    icon: Clock,
    title: 'Auto-Updates',
    description: 'Business hours, reviews, and info sync automatically from Google.',
    color: 'text-cyan-600'
  },
  {
    icon: CreditCard,
    title: 'No Hidden Fees',
    description: 'Transparent pricing with no setup fees or surprise charges.',
    color: 'text-emerald-600'
  }
];

export default function ValuePropositionSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
            Why Choose Locasite
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Succeed Online</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We handle the technical details so you can focus on running your business. 
            Get a professional web presence without the hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20"
            >
              <div className={`inline-flex rounded-lg bg-background p-3 ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              
              {/* Hover effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of businesses already using Locasite to grow their online presence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#create" 
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            >
              Start Building Your Website
            </a>
            <a 
              href="#demo" 
              className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-white px-8 py-3 text-sm font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}