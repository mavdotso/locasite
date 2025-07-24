import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    business: 'Sarah\'s Bakery & Cafe',
    location: 'San Francisco, CA',
    avatar: 'SC',
    rating: 5,
    text: 'I\'m not tech-savvy at all, but I had our bakery website up in minutes. Just pasted our Google Maps link and it pulled in everything - photos, hours, reviews. So easy!',
    highlight: 'Super easy setup',
    metric: 'Ready in minutes'
  },
  {
    name: 'Mike Rodriguez',
    business: 'Mike\'s Auto Repair',
    location: 'Austin, TX',
    avatar: 'MR',
    rating: 5,
    text: 'Finally, a website I can actually manage myself. The drag-and-drop editor is simple, and I love that it looks professional on phones. My customers can find us easily now.',
    highlight: 'Easy to manage',
    metric: 'Looks great on mobile'
  },
  {
    name: 'Luna Patel',
    business: 'Luna Yoga Studio',
    location: 'Portland, OR',
    avatar: 'LP',
    rating: 5,
    text: 'I was quoted $3000 for a custom website. With Locasite, I did it myself for a fraction of that. The templates are beautiful and it was genuinely fun to set up.',
    highlight: 'Saved thousands',
    metric: 'Professional results'
  },
  {
    name: 'David Kim',
    business: 'Kim\'s Dental Practice',
    location: 'Seattle, WA',
    avatar: 'DK',
    rating: 5,
    text: 'What impressed me most was how it imported all our Google info automatically. No typing, no copy-paste. Just clicked a button and our website was ready to customize.',
    highlight: 'No manual entry',
    metric: 'One-click import'
  },
  {
    name: 'Maria Garcia',
    business: 'Garcia Tax Services',
    location: 'Miami, FL',
    avatar: 'MG',
    rating: 5,
    text: 'I\'ve tried other website builders and got frustrated. This one is different - it\'s actually designed for small businesses like mine. Everything just makes sense.',
    highlight: 'Built for small business',
    metric: 'Actually works'
  },
  {
    name: 'James Thompson',
    business: 'Thompson Plumbing',
    location: 'Chicago, IL',
    avatar: 'JT',
    rating: 5,
    text: 'My daughter helped me set it up in about 10 minutes. Now I have a real website instead of just relying on Facebook. Customers say it looks very professional.',
    highlight: 'Family-friendly setup',
    metric: 'Professional appearance'
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
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
            What Our Customers Say
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Real Reviews from
            <span className="text-primary"> Real Business Owners</span>
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