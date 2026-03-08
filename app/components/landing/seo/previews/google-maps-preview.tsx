export default function GoogleMapsPreview() {
  return (
    <div className="bg-white font-sans">
      {/* Nav */}
      <nav className="bg-white border-b border-stone-200 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">O</span>
          </div>
          <div>
            <div className="font-bold text-stone-800 text-base leading-tight">
              Orlando Pet Grooming
            </div>
            <div className="text-xs text-stone-400">Orlando, FL</div>
          </div>
        </div>
        <div className="flex gap-5 text-sm text-stone-500 items-center">
          <span>Services</span>
          <span>About</span>
          <span>Reviews</span>
          <span className="bg-emerald-600 text-white px-4 py-1.5 rounded text-sm font-semibold">
            Book Now
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-emerald-700 text-white px-8 py-10 flex gap-8 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5 text-yellow-400">
              {"★★★★★".split("").map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
            <span className="text-emerald-200 text-xs">
              4.8 stars &middot; 94 Google reviews
            </span>
          </div>
          <h2 className="text-3xl font-bold leading-tight mb-3">
            Happy pets,
            <br />
            happy owners.
          </h2>
          <p className="text-emerald-100 text-sm mb-5 leading-relaxed">
            Professional grooming for dogs and cats. Walk-ins welcome, appointments available.
          </p>
          <div className="flex gap-3">
            <span className="bg-white text-emerald-700 text-sm font-bold px-5 py-2.5 rounded">
              Book Appointment
            </span>
            <span className="border border-emerald-300 text-white text-sm font-semibold px-5 py-2.5 rounded">
              View Services
            </span>
          </div>
        </div>
        <div className="w-48 h-40 rounded-xl bg-emerald-800 flex-shrink-0 flex items-center justify-center">
          <div className="text-center text-emerald-500">
            <div className="w-12 h-12 mx-auto mb-1 opacity-40 bg-emerald-700 rounded" />
            <p className="text-xs opacity-50">Business photo</p>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-8 py-3 flex gap-8 text-sm text-stone-700">
        <span>742 N Mills Ave, Orlando, FL 32803</span>
        <span>(407) 555-0331</span>
        <span>Mon–Sat 8am–6pm</span>
      </div>

      {/* Services */}
      <div className="px-8 py-8">
        <h3 className="text-base font-bold text-stone-800 mb-4">Services</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              name: "Full Groom (Dog)",
              desc: "Bath, cut, nails, ears",
              price: "from $45",
            },
            {
              name: "Bath & Brush",
              desc: "Shampoo, dry, brush-out",
              price: "from $25",
            },
            {
              name: "Cat Grooming",
              desc: "Gentle handling, lion cut available",
              price: "from $55",
            },
            {
              name: "Nail Trim",
              desc: "Quick walk-in service",
              price: "$15",
            },
          ].map((service) => (
            <div
              key={service.name}
              className="flex justify-between items-center py-3 border-b border-stone-100"
            >
              <div>
                <p className="font-medium text-stone-800 text-sm">
                  {service.name}
                </p>
                <p className="text-xs text-stone-400">{service.desc}</p>
              </div>
              <span className="text-emerald-700 font-semibold text-sm">
                {service.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 text-xs px-8 py-4 flex justify-between items-center">
        <span>
          &copy; 2025 Orlando Pet Grooming &middot; Orlando, FL
        </span>
        <span>
          Powered by <span className="text-emerald-400">locosite</span>
        </span>
      </footer>
    </div>
  );
}
