export default function RestaurantPreview() {
  return (
    <div className="bg-white font-serif">
      {/* Nav */}
      <nav className="bg-[#1a0a00] text-white px-6 py-3 flex items-center justify-between">
        <span className="text-lg font-bold tracking-wide text-amber-300">
          Maria&apos;s Italian Kitchen
        </span>
        <div className="flex gap-5 text-sm text-amber-100">
          <span>Menu</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a0a00] to-[#3d1c00] text-white px-8 py-10 flex gap-8 items-center">
        <div className="flex-1">
          <p className="text-amber-400 text-xs uppercase tracking-widest mb-2">
            Family-owned since 1994
          </p>
          <h2 className="text-3xl font-bold leading-tight mb-3">
            Authentic Italian
            <br />
            in the heart of Orlando
          </h2>
          <p className="text-amber-100 text-sm mb-5 leading-relaxed">
            Hand-rolled pasta, wood-fired pizza, and Nonna&apos;s famous
            tiramisu. Dine in or carry out.
          </p>
          <div className="flex gap-3">
            <span className="bg-amber-500 text-white text-sm font-semibold px-5 py-2 rounded">
              View Menu
            </span>
            <span className="border border-amber-400 text-amber-300 text-sm font-semibold px-5 py-2 rounded">
              Reserve a Table
            </span>
          </div>
        </div>
        <div className="w-56 h-40 rounded-xl bg-amber-900 flex-shrink-0 flex items-center justify-center">
          <div className="text-center text-amber-600">
            <div className="w-12 h-12 mx-auto mb-1 opacity-40 bg-amber-800 rounded" />
            <p className="text-xs opacity-50">Restaurant photo</p>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-amber-50 border-b border-amber-100 px-8 py-3 flex gap-8 text-sm text-stone-700">
        <span>1240 Orange Ave, Orlando, FL 32806</span>
        <span>(407) 555-0182</span>
        <span>Mon–Sat 11am–10pm · Sun 12–9pm</span>
      </div>

      {/* Menu highlights */}
      <div className="px-8 py-8 font-sans">
        <h3 className="text-lg font-bold text-stone-800 mb-4">
          Popular Dishes
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              name: "Tagliatelle al Ragù",
              desc: "House-made pasta, slow-braised beef",
              price: "$18",
            },
            {
              name: "Margherita Classica",
              desc: "San Marzano tomato, fior di latte",
              price: "$16",
            },
            {
              name: "Tiramisu della Nonna",
              desc: "House recipe, espresso-soaked ladyfingers",
              price: "$9",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="border border-stone-100 rounded-lg p-4 bg-stone-50"
            >
              <div className="w-full h-24 bg-amber-100 rounded mb-3" />
              <p className="font-semibold text-sm text-stone-800">
                {item.name}
              </p>
              <p className="text-xs text-stone-500 mt-1">{item.desc}</p>
              <p className="text-amber-700 font-bold text-sm mt-2">
                {item.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 text-xs px-8 py-4 flex justify-between items-center font-sans">
        <span>
          &copy; 2025 Maria&apos;s Italian Kitchen &middot; All rights reserved
        </span>
        <span className="text-stone-500">
          Powered by <span className="text-amber-400">locosite</span>
        </span>
      </footer>
    </div>
  );
}
