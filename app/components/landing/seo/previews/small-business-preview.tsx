export default function SmallBusinessPreview() {
  return (
    <div className="bg-white font-sans">
      {/* Nav */}
      <nav className="bg-white border-b border-stone-200 px-8 py-3 flex items-center justify-between">
        <div>
          <span className="font-bold text-stone-800 text-base">
            Sunrise Dry Cleaning
          </span>
          <span className="text-stone-400 text-xs ml-2">Clearwater, FL</span>
        </div>
        <div className="flex gap-5 text-sm text-stone-500 items-center">
          <span>Services</span>
          <span>Pricing</span>
          <span>Location</span>
          <span className="bg-indigo-600 text-white px-4 py-1.5 rounded text-sm font-semibold">
            (727) 555-0164
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-indigo-600 text-white px-8 py-10 flex gap-8 items-center">
        <div className="flex-1">
          <p className="text-indigo-200 text-xs uppercase tracking-widest mb-2">
            Family-owned &middot; Est. 2003
          </p>
          <h2 className="text-3xl font-bold leading-tight mb-3">
            Clean clothes,
            <br />
            zero hassle.
          </h2>
          <p className="text-indigo-100 text-sm mb-5 leading-relaxed">
            Drop off in the morning, pick up by evening. Dry cleaning, laundry,
            alterations, and more.
          </p>
          <div className="flex gap-3">
            <span className="bg-white text-indigo-700 text-sm font-bold px-5 py-2.5 rounded">
              See Our Prices
            </span>
            <span className="border border-indigo-300 text-white text-sm font-semibold px-5 py-2.5 rounded">
              Get Directions
            </span>
          </div>
        </div>
        <div className="w-48 h-40 rounded-xl bg-indigo-800 flex-shrink-0 flex items-center justify-center">
          <div className="text-center text-indigo-500">
            <div className="w-12 h-12 mx-auto mb-1 opacity-40 bg-indigo-700 rounded" />
            <p className="text-xs opacity-50">Store photo</p>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-indigo-50 border-b border-indigo-100 px-8 py-3 flex gap-8 text-sm text-stone-700">
        <span>1880 Gulf-to-Bay Blvd, Clearwater, FL 33765</span>
        <span>Mon–Fri 7am–7pm &middot; Sat 8am–5pm</span>
      </div>

      {/* Services & Pricing */}
      <div className="px-8 py-8">
        <h3 className="text-base font-bold text-stone-800 mb-4">
          Services &amp; Pricing
        </h3>
        <div className="grid grid-cols-2 gap-x-10">
          {[
            ["Suit (2-piece)", "$18.00"],
            ["Dress shirt", "$4.50"],
            ["Pants / Slacks", "$7.00"],
            ["Dress / Skirt", "$12.00"],
            ["Wash & Fold (per lb)", "$1.75/lb"],
            ["Comforter / Duvet", "$24.00"],
            ["Alterations", "from $8.00"],
            ["Leather / Suede", "Call for price"],
          ].map(([name, price]) => (
            <div
              key={name}
              className="flex justify-between items-center py-3 border-b border-stone-100"
            >
              <span className="text-sm text-stone-700">{name}</span>
              <span className="font-semibold text-stone-900 text-sm">
                {price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 text-xs px-8 py-4 flex justify-between items-center">
        <span>
          &copy; 2025 Sunrise Dry Cleaning &middot; Clearwater, FL
        </span>
        <span>
          Powered by <span className="text-indigo-300">locosite</span>
        </span>
      </footer>
    </div>
  );
}
