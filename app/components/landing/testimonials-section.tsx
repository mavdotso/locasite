import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    business: 'Bloom & Vine Florist',
    location: 'San Francisco, CA',
    avatar: 'SC',
    rating: 5,
    text: 'I was amazed at how quickly I had a professional website up and running. Within minutes of pasting my Google Maps link, I had a beautiful site that perfectly represents my flower shop. The best part? It updates automatically when I change my business hours!',
    highlight: 'Updates automatically'
  },
  {
    name: 'Michael Rodriguez',
    business: 'Rodriguez Auto Repair',
    location: 'Austin, TX',
    avatar: 'MR',
    rating: 5,
    text: 'As a mechanic, I don\'t have time to deal with websites. Locasite made it incredibly simple. My customers can now find my hours, see reviews, and contact me directly from the website. It\'s brought in at least 20 new customers this month alone.',
    highlight: '20 new customers'
  },
  {
    name: 'Emily Thompson',
    business: 'The Cozy Cup Café',
    location: 'Portland, OR',
    avatar: 'ET',
    rating: 5,
    text: 'The drag-and-drop editor is a game-changer. I was able to customize everything to match my café\'s aesthetic perfectly. My website looks like it cost thousands of dollars, but it\'s actually very affordable. Highly recommend!',
    highlight: 'Looks like it cost thousands'
  },
  {
    name: 'David Kim',
    business: 'Kim\'s Dental Practice',
    location: 'Seattle, WA',
    avatar: 'DK',
    rating: 5,
    text: 'Professional, clean, and exactly what my dental practice needed. The SEO features have helped us rank higher in local searches, and we\'ve seen a 40% increase in new patient inquiries since launching our Locasite.',
    highlight: '40% increase in inquiries'
  },
  {
    name: 'Lisa Martinez',
    business: 'Fit & Healthy Gym',
    location: 'Miami, FL',
    avatar: 'LM',
    rating: 5,
    text: 'Setting up our gym\'s website took literally 2 minutes. The mobile version looks fantastic, which is crucial since most of our members check class schedules on their phones. Worth every penny!',
    highlight: 'Setup in 2 minutes'
  },
  {
    name: 'James Wilson',
    business: 'Wilson Law Firm',
    location: 'Chicago, IL',
    avatar: 'JW',
    rating: 5,
    text: 'I needed a professional web presence that instills trust. Locasite delivered exactly that. The security features and professional design give my clients confidence, and the analytics help me understand my audience better.',
    highlight: 'Instills trust'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Customer Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Trusted by Thousands of
            <span className="text-primary"> Local Businesses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how businesses like yours are growing their online presence with Locasite
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-muted-foreground mb-6 relative z-10">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              {/* Highlight */}
              <div className="inline-flex items-center gap-1 text-sm font-medium text-primary mb-6">
                <span className="text-2xl">→</span>
                {testimonial.highlight}
              </div>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t pt-16">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
            <p className="text-muted-foreground">Happy Businesses</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">4.9/5</p>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">99.9%</p>
            <p className="text-muted-foreground">Uptime SLA</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">24/7</p>
            <p className="text-muted-foreground">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}