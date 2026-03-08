import type { ComponentType } from "react";

interface SEOPreviewSectionProps {
  businessType: string;
  previewDomain: string;
  PreviewComponent: ComponentType;
}

export default function SEOPreviewSection({
  businessType,
  previewDomain,
  PreviewComponent,
}: SEOPreviewSectionProps) {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-12">
          <span className="text-[11px] font-semibold text-brand-forest uppercase tracking-[0.12em] mb-3 block">
            Example
          </span>
          <h2 className="font-display font-extrabold text-brand-ink text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
            What your {businessType.toLowerCase()} site looks like
          </h2>
          <p className="text-brand-taupe text-[17px] leading-[1.65] max-w-lg mx-auto">
            Auto-generated from a real Google Maps listing. No design work
            required.
          </p>
        </div>

        {/* Browser mockup */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-t-xl bg-stone-100 border border-stone-200 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-stone-300" />
              <div className="w-3 h-3 rounded-full bg-stone-300" />
              <div className="w-3 h-3 rounded-full bg-stone-300" />
            </div>
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-sm text-stone-400 font-mono truncate border border-stone-200">
              {previewDomain}
            </div>
          </div>
          <div className="border border-t-0 border-stone-200 rounded-b-xl overflow-hidden bg-white">
            <div className="scale-[0.85] origin-top">
              <PreviewComponent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
