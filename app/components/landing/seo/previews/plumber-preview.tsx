export default function PlumberPreview() {
  return (
    <div className="bg-white font-sans">
      {/* Top bar */}
      <div className="bg-blue-900 text-blue-100 text-xs px-8 py-2 flex justify-between items-center">
        <span>Licensed &amp; Insured &middot; Serving Miami-Dade County</span>
        <span className="font-bold text-white">
          24/7 Emergency Line: (305) 555-0198
        </span>
      </div>

      {/* Nav */}
      <nav className="bg-white border-b border-stone-200 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-blue-300 rounded" />
          </div>
          <div>
            <div className="font-bold text-stone-800 text-base leading-tight">
              Reliable Plumbing Co.
            </div>
            <div className="text-xs text-stone-400">Miami, FL</div>
          </div>
        </div>
        <div className="flex gap-5 text-sm text-stone-600 items-center">
          <span>Services</span>
          <span>About</span>
          <span>Reviews</span>
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-semibold">
            Get a Quote
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-blue-700 text-white px-8 py-10 flex gap-8 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5 text-yellow-400">
              {"★★★★★".split("").map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
            <span className="text-blue-200 text-xs">
              4.9 stars &middot; 127 Google reviews
            </span>
          </div>
          <h2 className="text-3xl font-bold leading-tight mb-3">
            Fast, honest plumbing
            <br />
            you can count on.
          </h2>
          <p className="text-blue-100 text-sm mb-5 leading-relaxed">
            Same-day service for leaks, clogs, water heaters, and more. No
            surprise fees — ever.
          </p>
          <div className="flex gap-3">
            <span className="bg-yellow-400 text-blue-900 text-sm font-bold px-5 py-2.5 rounded">
              Call Now
            </span>
            <span className="border border-blue-300 text-white text-sm font-semibold px-5 py-2.5 rounded">
              Request Online
            </span>
          </div>
        </div>
        <div className="w-48 h-40 rounded-xl bg-blue-800 flex-shrink-0 flex items-center justify-center">
          <div className="text-center text-blue-500">
            <div className="w-12 h-12 mx-auto mb-1 opacity-40 bg-blue-700 rounded" />
            <p className="text-xs opacity-50">Team photo</p>
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div className="px-8 py-8">
        <h3 className="text-base font-bold text-stone-800 mb-4">
          What We Fix
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            "Emergency Leaks",
            "Drain Cleaning",
            "Water Heaters",
            "Repiping",
          ].map((service) => (
            <div
              key={service}
              className="border border-stone-100 rounded-lg p-4 text-center"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full mx-auto mb-2" />
              <p className="text-xs font-semibold text-stone-700">{service}</p>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="mt-6 bg-stone-50 rounded-xl p-5 flex gap-6">
          {[
            { value: "15+", label: "Years in business" },
            { value: "2,400+", label: "Jobs completed" },
            { value: "Same day", label: "Service available" },
          ].map((stat) => (
            <div key={stat.label} className="text-center flex-1">
              <p className="text-2xl font-bold text-blue-700">{stat.value}</p>
              <p className="text-xs text-stone-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-300 text-xs px-8 py-4 flex justify-between items-center">
        <span>
          &copy; 2025 Reliable Plumbing Co. &middot; Miami, FL &middot; License
          #CFC1234567
        </span>
        <span>
          Powered by <span className="text-blue-100">locosite</span>
        </span>
      </footer>
    </div>
  );
}
