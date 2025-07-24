import { Star, TrendingUp, Users } from "lucide-react";

export default function SocialProofBar() {
  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-12">
          {/* Customer Count */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">50,000+</p>
              <p className="text-sm text-muted-foreground">Local Businesses</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-border md:block" />

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-2">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold">4.9</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">2,000+ Reviews</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-border md:block" />

          {/* Growth Metric */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">+37%</p>
              <p className="text-sm text-muted-foreground">
                Average Traffic Increase
              </p>
            </div>
          </div>
        </div>

        {/* Logo Carousel - Mobile optimized */}
        <div className="mt-8 flex items-center justify-center gap-8 opacity-60 grayscale">
          <p className="text-sm font-medium text-muted-foreground">
            Trusted by businesses across all industries
          </p>
        </div>
      </div>
    </section>
  );
}