"use client";

interface SectionMiniPreviewProps {
  variationId: string;
}

export function SectionMiniPreview({ variationId }: SectionMiniPreviewProps) {
  const layout = layouts[variationId];
  if (!layout) {
    return <DefaultPreview />;
  }
  return layout;
}

function DefaultPreview() {
  return (
    <div className="h-full w-full bg-slate-100 flex items-center justify-center p-3">
      <div className="space-y-1.5 w-full">
        <div className="h-2 bg-slate-300 rounded w-3/4 mx-auto" />
        <div className="h-1.5 bg-slate-300/60 rounded w-1/2 mx-auto" />
        <div className="h-8 bg-slate-200 rounded w-full mt-2" />
      </div>
    </div>
  );
}

// -- Header Previews --

function HeaderClassic() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col justify-center px-4">
      <div className="flex items-center justify-between">
        <div className="h-3 w-12 bg-blue-400/50 rounded" />
        <div className="flex gap-2">
          <div className="h-2 w-8 bg-slate-300 rounded" />
          <div className="h-2 w-8 bg-slate-300 rounded" />
          <div className="h-2 w-8 bg-slate-300 rounded" />
          <div className="h-2 w-8 bg-slate-300 rounded" />
        </div>
      </div>
    </div>
  );
}

function HeaderCentered() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center justify-center gap-2 px-4">
      <div className="h-3 w-14 bg-blue-400/50 rounded" />
      <div className="flex gap-2">
        <div className="h-2 w-8 bg-slate-300 rounded" />
        <div className="h-2 w-8 bg-slate-300 rounded" />
        <div className="h-2 w-8 bg-slate-300 rounded" />
        <div className="h-2 w-8 bg-slate-300 rounded" />
      </div>
    </div>
  );
}

function HeaderMinimal() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col justify-center px-4">
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-10 bg-blue-400/50 rounded" />
        <div className="flex gap-2">
          <div className="h-1.5 w-6 bg-slate-300 rounded" />
          <div className="h-1.5 w-6 bg-slate-300 rounded" />
          <div className="h-1.5 w-6 bg-slate-300 rounded" />
        </div>
      </div>
    </div>
  );
}

// -- Hero Previews --

function HeroCenterBg() {
  return (
    <div className="h-full w-full bg-slate-200 flex flex-col items-center justify-center gap-2 px-6">
      <div className="h-3 w-3/4 bg-slate-300 rounded" />
      <div className="h-2 w-1/2 bg-slate-300/70 rounded" />
      <div className="h-5 w-20 bg-blue-400/50 rounded mt-1" />
    </div>
  );
}

function HeroSplitScreen() {
  return (
    <div className="h-full w-full bg-slate-100 flex">
      <div className="w-1/2 flex flex-col justify-center gap-1.5 px-4">
        <div className="h-3 bg-slate-300 rounded w-full" />
        <div className="h-2 bg-slate-300/60 rounded w-3/4" />
        <div className="h-4 w-16 bg-blue-400/50 rounded mt-1" />
      </div>
      <div className="w-1/2 bg-slate-200 m-2 rounded" />
    </div>
  );
}

function HeroMinimal() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center justify-center gap-2 px-6">
      <div className="h-3 w-2/3 bg-slate-300 rounded" />
      <div className="h-2 w-1/3 bg-slate-300/60 rounded" />
    </div>
  );
}

function HeroGradientBg() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex flex-col items-center justify-center gap-2 px-6">
      <div className="h-3 w-3/4 bg-slate-300 rounded" />
      <div className="h-2 w-1/2 bg-slate-300/70 rounded" />
      <div className="h-5 w-20 bg-blue-400/50 rounded mt-1" />
    </div>
  );
}

// -- About Previews --

function AboutTextImage() {
  return (
    <div className="h-full w-full bg-slate-100 flex p-3 gap-3">
      <div className="w-1/2 flex flex-col justify-center gap-1.5">
        <div className="h-2.5 bg-slate-300 rounded w-3/4" />
        <div className="h-1.5 bg-slate-300/60 rounded w-full" />
        <div className="h-1.5 bg-slate-300/60 rounded w-full" />
        <div className="h-1.5 bg-slate-300/60 rounded w-2/3" />
      </div>
      <div className="w-1/2 bg-slate-200 rounded" />
    </div>
  );
}

function AboutFeatures() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center p-3 gap-2">
      <div className="h-2.5 w-1/3 bg-slate-300 rounded" />
      <div className="flex gap-2 w-full flex-1">
        <div className="flex-1 bg-slate-200 rounded p-2 flex flex-col items-center gap-1">
          <div className="h-3 w-3 bg-blue-400/50 rounded-full" />
          <div className="h-1.5 w-full bg-slate-300/60 rounded" />
        </div>
        <div className="flex-1 bg-slate-200 rounded p-2 flex flex-col items-center gap-1">
          <div className="h-3 w-3 bg-blue-400/50 rounded-full" />
          <div className="h-1.5 w-full bg-slate-300/60 rounded" />
        </div>
        <div className="flex-1 bg-slate-200 rounded p-2 flex flex-col items-center gap-1">
          <div className="h-3 w-3 bg-blue-400/50 rounded-full" />
          <div className="h-1.5 w-full bg-slate-300/60 rounded" />
        </div>
      </div>
    </div>
  );
}

function AboutTwoColumn() {
  return (
    <div className="h-full w-full bg-slate-100 flex p-3 gap-3">
      <div className="w-1/2 flex flex-col gap-1.5">
        <div className="h-2.5 bg-slate-300 rounded w-1/2" />
        <div className="h-1.5 bg-slate-300/60 rounded w-full" />
        <div className="h-1.5 bg-slate-300/60 rounded w-full" />
        <div className="h-1.5 bg-slate-300/60 rounded w-3/4" />
      </div>
      <div className="w-1/2 flex flex-col gap-1.5">
        <div className="h-2.5 bg-slate-300 rounded w-1/2" />
        <div className="h-1.5 bg-slate-300/60 rounded w-full" />
        <div className="h-1.5 bg-slate-300/60 rounded w-full" />
        <div className="h-1.5 bg-slate-300/60 rounded w-3/4" />
      </div>
    </div>
  );
}

function AboutTimeline() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col justify-center px-4 gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 bg-blue-400/50 rounded-full shrink-0" />
          <div className="h-1.5 bg-slate-300/60 rounded flex-1" />
        </div>
      ))}
    </div>
  );
}

// -- Services Previews --

function Services3Column() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center p-3 gap-2">
      <div className="h-2.5 w-1/3 bg-slate-300 rounded" />
      <div className="flex gap-2 w-full flex-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-slate-200 rounded p-2 flex flex-col gap-1">
            <div className="h-2 bg-blue-400/50 rounded w-1/2" />
            <div className="h-1.5 bg-slate-300/60 rounded w-full" />
            <div className="h-1.5 bg-slate-300/60 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesListIcons() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col justify-center px-4 gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-4 w-4 bg-blue-400/50 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-2 bg-slate-300 rounded w-1/3" />
            <div className="h-1.5 bg-slate-300/60 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ServicesPricingTable() {
  return (
    <div className="h-full w-full bg-slate-100 flex p-3 gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-1 bg-slate-200 rounded flex flex-col overflow-hidden">
          <div className={`h-3 ${i === 2 ? "bg-blue-400/50" : "bg-slate-300"} w-full`} />
          <div className="p-1.5 flex flex-col gap-1 flex-1">
            <div className="h-2.5 bg-slate-300/80 rounded w-1/2 mx-auto" />
            <div className="h-1 bg-slate-300/40 rounded w-full" />
            <div className="h-1 bg-slate-300/40 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// -- Gallery Previews --

function GalleryGrid() {
  return (
    <div className="h-full w-full bg-slate-100 p-3">
      <div className="grid grid-cols-3 grid-rows-2 gap-1.5 h-full">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-slate-200 rounded" />
        ))}
      </div>
    </div>
  );
}

function GalleryMasonry() {
  return (
    <div className="h-full w-full bg-slate-100 p-3 flex gap-1.5">
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="bg-slate-200 rounded flex-[2]" />
        <div className="bg-slate-200 rounded flex-[1]" />
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="bg-slate-200 rounded flex-[1]" />
        <div className="bg-slate-200 rounded flex-[2]" />
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="bg-slate-200 rounded flex-[1.5]" />
        <div className="bg-slate-200 rounded flex-[1.5]" />
      </div>
    </div>
  );
}

function GalleryBeforeAfter() {
  return (
    <div className="h-full w-full bg-slate-100 p-3 flex gap-0.5 items-stretch">
      <div className="flex-1 bg-slate-200 rounded-l" />
      <div className="w-1 bg-blue-400/50 flex items-center justify-center relative">
        <div className="h-4 w-4 bg-blue-400/70 rounded-full absolute" />
      </div>
      <div className="flex-1 bg-slate-300/60 rounded-r" />
    </div>
  );
}

// -- Contact Previews --

function ContactFormMap() {
  return (
    <div className="h-full w-full bg-slate-100 flex p-3 gap-3">
      <div className="w-1/2 flex flex-col gap-1.5 justify-center">
        <div className="h-2 bg-slate-300/60 rounded w-full" />
        <div className="h-2 bg-slate-300/60 rounded w-full" />
        <div className="h-6 bg-slate-300/60 rounded w-full" />
        <div className="h-3 bg-blue-400/50 rounded w-1/3 mt-1" />
      </div>
      <div className="w-1/2 bg-slate-200 rounded flex items-center justify-center">
        <div className="h-4 w-4 bg-blue-400/40 rounded-full" />
      </div>
    </div>
  );
}

function ContactInfoCards() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center p-3 gap-2">
      <div className="h-2.5 w-1/3 bg-slate-300 rounded" />
      <div className="flex gap-2 w-full flex-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-slate-200 rounded p-2 flex flex-col items-center gap-1">
            <div className="h-3 w-3 bg-blue-400/50 rounded-full" />
            <div className="h-1.5 w-3/4 bg-slate-300/60 rounded" />
            <div className="h-1.5 w-1/2 bg-slate-300/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSocialFocus() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center justify-center gap-2 px-4">
      <div className="h-2.5 w-1/3 bg-slate-300 rounded" />
      <div className="h-1.5 w-1/2 bg-slate-300/60 rounded" />
      <div className="flex gap-2 mt-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-5 w-5 bg-blue-400/50 rounded-full" />
        ))}
      </div>
    </div>
  );
}

// -- Reviews Preview --

function ReviewsSection() {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center p-3 gap-2">
      <div className="h-2.5 w-1/3 bg-slate-300 rounded" />
      <div className="flex gap-2 w-full flex-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-slate-200 rounded p-2 flex flex-col gap-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="h-1.5 w-1.5 bg-blue-400/50 rounded-full" />
              ))}
            </div>
            <div className="h-1.5 bg-slate-300/60 rounded w-full" />
            <div className="h-1.5 bg-slate-300/60 rounded w-3/4" />
            <div className="h-1.5 bg-slate-300/40 rounded w-1/3 mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Layout map --

const layouts: Record<string, React.ReactNode> = {
  // Headers
  "header-section": <HeaderClassic />,
  "header-classic": <HeaderClassic />,
  "header-centered": <HeaderCentered />,
  "header-minimal": <HeaderMinimal />,
  // Heroes
  "hero-section": <HeroCenterBg />,
  "hero-center-bg": <HeroCenterBg />,
  "hero-split-screen": <HeroSplitScreen />,
  "hero-minimal": <HeroMinimal />,
  "hero-gradient-bg": <HeroGradientBg />,
  // About
  "about-section": <AboutTextImage />,
  "about-text-image": <AboutTextImage />,
  "about-features": <AboutFeatures />,
  "about-two-column": <AboutTwoColumn />,
  "about-timeline": <AboutTimeline />,
  // Services
  "services-3-column": <Services3Column />,
  "services-list-icons": <ServicesListIcons />,
  "services-pricing-table": <ServicesPricingTable />,
  // Gallery
  "gallery-grid": <GalleryGrid />,
  "gallery-masonry": <GalleryMasonry />,
  "gallery-before-after": <GalleryBeforeAfter />,
  // Contact
  "contact-form-map": <ContactFormMap />,
  "contact-info-cards": <ContactInfoCards />,
  "contact-social-focus": <ContactSocialFocus />,
  // Reviews
  "reviews-section": <ReviewsSection />,
};
