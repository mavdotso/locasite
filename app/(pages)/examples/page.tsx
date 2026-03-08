import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Scale, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Example Website — Carter & Associates Law",
  description: "See what a Locosite website looks like. This is a sample site for a fictional law firm in Orlando, FL.",
};

function SampleNav() {
  return (
    <nav className="bg-[#1a2332] text-white">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-[#c9a96e]" />
          <span className="font-display font-bold text-xl tracking-tight">
            Carter & Associates
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <span className="text-gray-300 hover:text-white cursor-default">About</span>
          <span className="text-gray-300 hover:text-white cursor-default">Practice Areas</span>
          <span className="text-gray-300 hover:text-white cursor-default">Testimonials</span>
          <span className="text-gray-300 hover:text-white cursor-default">Contact</span>
          <span className="bg-[#c9a96e] text-[#1a2332] font-semibold px-4 py-2 rounded text-sm cursor-default">
            Free Consultation
          </span>
        </div>
      </div>
    </nav>
  );
}

function SampleHero() {
  return (
    <section className="bg-[#1a2332] text-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-[#c9a96e] text-sm font-semibold uppercase tracking-wider mb-4">
            Orlando Family Law
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-6">
            Protecting what matters most to you
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
            Trusted family law attorneys serving Orlando and Central Florida for over 15 years. Divorce, custody, adoption, and estate planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <span className="bg-[#c9a96e] text-[#1a2332] font-semibold px-6 py-3 rounded text-center cursor-default">
              Schedule Free Consultation
            </span>
            <span className="border border-gray-500 text-white font-semibold px-6 py-3 rounded text-center cursor-default">
              (407) 555-0192
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SamplePracticeAreas() {
  const areas = [
    { title: "Family Law", desc: "Divorce, separation, prenuptial agreements" },
    { title: "Child Custody", desc: "Custody arrangements, visitation, modifications" },
    { title: "Estate Planning", desc: "Wills, trusts, powers of attorney" },
    { title: "Adoption", desc: "Domestic, international, stepparent adoption" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display font-bold text-[#1a2332] text-3xl mb-8">Practice Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {areas.map((area) => (
            <div key={area.title} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition">
              <h3 className="font-display font-bold text-[#1a2332] text-xl mb-2">{area.title}</h3>
              <p className="text-gray-600 text-sm">{area.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleTestimonial() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display font-bold text-[#1a2332] text-3xl mb-8">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-4 italic">
              &ldquo;Attorney Carter handled our custody case with compassion and professionalism. She fought for us and got the outcome we needed.&rdquo;
            </p>
            <p className="text-sm font-semibold text-[#1a2332]">— Sarah M., Orlando</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-4 italic">
              &ldquo;The best decision we made was hiring Carter & Associates for our estate planning. Professional, thorough, and genuinely caring.&rdquo;
            </p>
            <p className="text-sm font-semibold text-[#1a2332]">— James T., Winter Park</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SampleContact() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display font-bold text-[#1a2332] text-3xl mb-6">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#c9a96e] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1a2332]">Office</p>
                  <p className="text-gray-600 text-sm">123 Orange Ave, Suite 400<br />Orlando, FL 32801</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#c9a96e] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1a2332]">Phone</p>
                  <p className="text-gray-600 text-sm">(407) 555-0192</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#c9a96e] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1a2332]">Email</p>
                  <p className="text-gray-600 text-sm">info@carterlaw.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#c9a96e] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1a2332]">Hours</p>
                  <p className="text-gray-600 text-sm">Mon - Fri: 8:30am - 5:30pm</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-display font-bold text-[#1a2332] text-lg mb-4">Request a Free Consultation</h3>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded px-4 py-3 text-gray-400 text-sm">Full Name</div>
              <div className="bg-white border border-gray-200 rounded px-4 py-3 text-gray-400 text-sm">Phone Number</div>
              <div className="bg-white border border-gray-200 rounded px-4 py-3 text-gray-400 text-sm">Email Address</div>
              <div className="bg-white border border-gray-200 rounded px-4 py-3 text-gray-400 text-sm h-24">Tell us about your case...</div>
              <div className="bg-[#c9a96e] text-[#1a2332] font-semibold px-6 py-3 rounded text-center text-sm cursor-default">
                Submit Request
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SampleFooter() {
  return (
    <footer className="bg-[#1a2332] text-gray-400 py-8">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm">
        <p>&copy; 2026 Carter & Associates Law. All rights reserved.</p>
        <p className="mt-1 text-gray-500">123 Orange Ave, Suite 400, Orlando, FL 32801 &middot; (407) 555-0192</p>
      </div>
    </footer>
  );
}

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Banner linking back to Locosite */}
      <div className="bg-brand-forest text-brand-cream py-3 px-6 text-center text-sm">
        <span className="text-brand-sage">This is a sample website built by Locosite.</span>
        {" "}
        <Link href="/#pricing" className="font-semibold text-brand-amber hover:underline inline-flex items-center gap-1">
          Get yours for $149 <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Sample Law Firm Website */}
      <SampleNav />
      <SampleHero />
      <SamplePracticeAreas />
      <SampleTestimonial />
      <SampleContact />
      <SampleFooter />
    </div>
  );
}
