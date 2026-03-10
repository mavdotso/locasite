export interface GenericPreviewConfig {
  businessName: string;
  tagline: string;
  location: string;
  phone: string;
  hours: string;
  services: Array<{ name: string; desc: string }>;
  accentColor: string;
  accentLight: string;
  accentDark: string;
  navBg: string;
  navText: string;
}

export default function GenericBusinessPreview({
  config,
}: {
  config: GenericPreviewConfig;
}) {
  return (
    <div className="bg-white font-sans">
      {/* Nav */}
      <nav
        className="px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: config.navBg }}
      >
        <span className="text-lg font-bold tracking-wide" style={{ color: config.accentColor }}>
          {config.businessName}
        </span>
        <div className="flex gap-5 text-sm" style={{ color: config.navText }}>
          <span>Services</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </nav>

      {/* Hero */}
      <div
        className="text-white px-8 py-10 flex gap-8 items-center"
        style={{
          background: `linear-gradient(135deg, ${config.accentDark}, ${config.navBg})`,
        }}
      >
        <div className="flex-1">
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: config.accentColor }}
          >
            Trusted local business
          </p>
          <h2 className="text-3xl font-bold leading-tight mb-3">
            {config.tagline}
          </h2>
          <p className="text-sm mb-5 leading-relaxed opacity-80">
            Serving the local community with quality and care.
            {" "}Call us today for a free consultation.
          </p>
          <div className="flex gap-3">
            <span
              className="text-white text-sm font-semibold px-5 py-2 rounded"
              style={{ backgroundColor: config.accentColor }}
            >
              Get in Touch
            </span>
            <span
              className="text-sm font-semibold px-5 py-2 rounded"
              style={{
                border: `1px solid ${config.accentColor}`,
                color: config.accentColor,
              }}
            >
              Our Services
            </span>
          </div>
        </div>
        <div
          className="w-56 h-40 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: config.accentDark }}
        >
          <div className="text-center opacity-40">
            <div
              className="w-12 h-12 mx-auto mb-1 rounded"
              style={{ backgroundColor: config.accentColor }}
            />
            <p className="text-xs">Business photo</p>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div
        className="border-b px-8 py-3 flex gap-8 text-sm"
        style={{
          backgroundColor: config.accentLight,
          borderColor: config.accentColor + "30",
          color: "#57534e",
        }}
      >
        <span>{config.location}</span>
        <span>{config.phone}</span>
        <span>{config.hours}</span>
      </div>

      {/* Services */}
      <div className="px-8 py-8">
        <h3 className="text-lg font-bold text-stone-800 mb-4">Our Services</h3>
        <div className="grid grid-cols-3 gap-4">
          {config.services.map((svc) => (
            <div
              key={svc.name}
              className="border border-stone-100 rounded-lg p-4 bg-stone-50"
            >
              <div
                className="w-full h-24 rounded mb-3"
                style={{ backgroundColor: config.accentLight }}
              />
              <p className="font-semibold text-sm text-stone-800">{svc.name}</p>
              <p className="text-xs text-stone-500 mt-1">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 text-xs px-8 py-4 flex justify-between items-center">
        <span>
          &copy; 2025 {config.businessName} &middot; All rights reserved
        </span>
        <span className="text-stone-500">
          Powered by{" "}
          <span style={{ color: config.accentColor }}>locosite</span>
        </span>
      </footer>
    </div>
  );
}
