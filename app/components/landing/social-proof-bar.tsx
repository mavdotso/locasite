export default function SocialProofBar() {
  return (
    <section className="bg-brand-cream border-y border-brand-border py-6">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-brand-taupe text-sm font-medium">
          <span>Trusted by local businesses in Orlando, FL</span>
          <span className="hidden sm:inline text-brand-border">|</span>
          <span>7-day delivery guarantee</span>
          <span className="hidden sm:inline text-brand-border">|</span>
          <span>Money-back guarantee</span>
        </div>
      </div>
    </section>
  );
}
