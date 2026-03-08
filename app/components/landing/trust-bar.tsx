export default function TrustBar() {
  const industries = [
    "Restaurants",
    "Plumbers",
    "HVAC Contractors",
    "Landscapers",
    "Cleaning Services",
  ];

  return (
    <section className="py-6 bg-brand-cream border-b border-brand-border">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-brand-taupe text-sm">
          {industries.map((industry, i) => (
            <span key={industry} className="flex items-center gap-2">
              {industry}
              {i < industries.length - 1 && (
                <span className="text-brand-border">&middot;</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
