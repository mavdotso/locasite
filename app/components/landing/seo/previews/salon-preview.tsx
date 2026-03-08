export default function SalonPreview() {
  return (
    <div className="bg-white font-sans">
      {/* Nav */}
      <nav className="bg-white border-b border-rose-100 px-8 py-3 flex items-center justify-between">
        <div>
          <span className="text-xl font-light tracking-widest text-rose-700 uppercase">
            Bella
          </span>
          <span className="text-xs text-rose-400 ml-1 tracking-widest uppercase">
            Hair Studio
          </span>
        </div>
        <div className="flex gap-5 text-sm text-stone-500">
          <span>Services</span>
          <span>Gallery</span>
          <span>Book</span>
          <span>Contact</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-rose-50 px-8 py-10 flex gap-8 items-center">
        <div className="flex-1">
          <p className="text-rose-400 text-xs uppercase tracking-widest mb-2">
            Tampa&apos;s Premier Salon
          </p>
          <h2 className="text-3xl font-light text-rose-900 leading-tight mb-3">
            Your best hair,
            <br />
            <span className="font-semibold">every visit.</span>
          </h2>
          <p className="text-stone-500 text-sm mb-5 leading-relaxed">
            Expert cuts, color, and styling for all hair types. Walk-ins welcome
            — appointments preferred.
          </p>
          <div className="flex gap-3">
            <span className="bg-rose-600 text-white text-sm font-semibold px-5 py-2 rounded-full">
              Book Appointment
            </span>
            <span className="text-rose-600 text-sm font-semibold px-5 py-2 rounded-full border border-rose-300">
              View Services
            </span>
          </div>
        </div>
        <div className="w-52 h-44 rounded-2xl bg-rose-200 flex-shrink-0 flex items-center justify-center">
          <div className="text-center text-rose-400">
            <div className="w-12 h-12 mx-auto mb-1 opacity-40 bg-rose-300 rounded" />
            <p className="text-xs opacity-50">Salon photo</p>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-white border-b border-stone-100 px-8 py-3 flex gap-8 text-sm text-stone-600">
        <span>830 Bayshore Blvd, Tampa, FL 33606</span>
        <span>(813) 555-0247</span>
        <span>Tue–Sat 9am–7pm · Sun 10am–5pm</span>
      </div>

      {/* Services */}
      <div className="px-8 py-8">
        <h3 className="text-base font-semibold text-stone-700 mb-4 uppercase tracking-wider">
          Our Services
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              name: "Women's Cut & Style",
              desc: "Wash, cut, blow-dry",
              price: "from $55",
            },
            {
              name: "Full Color",
              desc: "Single process, roots or all-over",
              price: "from $85",
            },
            {
              name: "Highlights / Balayage",
              desc: "Foil or hand-painted",
              price: "from $120",
            },
            {
              name: "Men's Cut",
              desc: "Scissor or clipper cut",
              price: "from $30",
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
              <span className="text-rose-700 font-semibold text-sm">
                {service.price}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-rose-50 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-rose-900 text-sm">
              Ready to book?
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Call us or book online — we&apos;ll see you soon.
            </p>
          </div>
          <span className="bg-rose-600 text-white text-sm font-semibold px-5 py-2 rounded-full">
            Book Now
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-100 text-stone-400 text-xs px-8 py-4 flex justify-between items-center">
        <span>&copy; 2025 Bella Hair Studio &middot; Tampa, FL</span>
        <span>
          Powered by <span className="text-rose-500">locosite</span>
        </span>
      </footer>
    </div>
  );
}
