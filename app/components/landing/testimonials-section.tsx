import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    business: 'Sarah\'s Bakery & Cafe',
    location: 'San Francisco, CA',
    avatar: 'SC',
    rating: 5,
    text: 'Setup took 5 minutes instead of 5 hours. I pasted our Google Maps link and boom—professional website ready. We\'ve seen 40% more online orders since launching.',
    highlight: 'Setup in 5 minutes',
    metric: '+40% online orders'
  },
  {
    name: 'Mike Rodriguez',
    business: 'Mike\'s Auto Repair',
    location: 'Austin, TX',
    avatar: 'MR',
    rating: 5,
    text: '37% more customer calls in the first month. The best part? When I update our hours on Google, the website changes automatically. No more confused customers!',
    highlight: '+37% more calls',
    metric: 'Auto-synced updates'
  },
  {
    name: 'Luna Patel',
    business: 'Luna Yoga Studio',
    location: 'Portland, OR',
    avatar: 'LP',
    rating: 5,
    text: 'Finally, a website that\'s always up-to-date. Our class schedule syncs from Google, reviews show automatically, and new students find us easily. Worth every penny.',
    highlight: 'Always up-to-date',
    metric: '3x more inquiries'
  },
  {
    name: 'David Kim',
    business: 'Kim\'s Dental Practice',
    location: 'Seattle, WA',
    avatar: 'DK',
    rating: 5,
    text: 'Reduced our setup time by 80%. What used to take days now takes minutes. The Google Maps integration means we never have outdated information online.',
    highlight: '80% less setup time',
    metric: 'Zero maintenance'
  },
  {
    name: 'Maria Garcia',
    business: 'Garcia Tax Services',
    location: 'Miami, FL',
    avatar: 'MG',
    rating: 5,
    text: 'Our Google reviews now show on our website automatically. Clients trust us more, and we\'ve doubled our appointments during tax season.',
    highlight: '2x appointments',
    metric: 'Trust through reviews'
  },
  {
    name: 'James Thompson',
    business: 'Thompson Plumbing',
    location: 'Chicago, IL',
    avatar: 'JT',
    rating: 5,
    text: 'Emergency calls increased 150% because customers can easily find our hours and contact info. The mobile site loads instantly—crucial for emergencies.',
    highlight: '+150% emergency calls',
    metric: 'Instant mobile load'
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
            Real Results from
            <span className="text-primary"> Real Businesses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how businesses are saving time and growing their online presence
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
              
              {/* Metrics */}
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  <span className="text-2xl">→</span>
                  {testimonial.highlight}
                </div>
                {testimonial.metric && (
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    {testimonial.metric}
                  </span>
                )}
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
            <p className="text-4xl font-bold text-primary mb-2">60 sec</p>
            <p className="text-muted-foreground">Average Setup Time</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">100%</p>
            <p className="text-muted-foreground">Mobile Responsive</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">SSL</p>
            <p className="text-muted-foreground">Security Included</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">24/7</p>
            <p className="text-muted-foreground">Website Availability</p>
          </div>
        </div>
      </div>
    </section>
  );
}