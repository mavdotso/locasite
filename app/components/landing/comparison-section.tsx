export default function ComparisonSection() {
  const rows = [
    {
      option: "DIY (Wix, Squarespace)",
      upfront: "$0",
      monthly: "$17\u2013$40",
      time: "1\u20134 weeks",
      who: "You",
      highlight: false,
    },
    {
      option: "Freelancer",
      upfront: "$500\u2013$3,000",
      monthly: "$50\u2013$100",
      time: "2\u20136 weeks",
      who: "A stranger",
      highlight: false,
    },
    {
      option: "Agency",
      upfront: "$2,000\u2013$10,000",
      monthly: "$200\u2013$1,000",
      time: "4\u201312 weeks",
      who: "An agency",
      highlight: false,
    },
    {
      option: "Locosite",
      upfront: "$0",
      monthly: "$0\u2013$29",
      time: "Instant",
      who: "Locosite",
      highlight: true,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-brand-cream">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-brand-forest uppercase tracking-[0.12em] mb-3 block">
            Compare
          </span>
          <h2 className="font-display font-extrabold text-brand-ink text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
            What&apos;s a website actually cost?
          </h2>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-brand-border">
                <th className="py-3 pr-4 text-sm font-semibold text-brand-ink">
                  Option
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-brand-ink">
                  Upfront
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-brand-ink">
                  Monthly
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-brand-ink">
                  Time to Launch
                </th>
                <th className="py-3 pl-4 text-sm font-semibold text-brand-ink">
                  Who Builds It
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.option}
                  className={`border-b border-brand-border ${
                    row.highlight
                      ? "bg-brand-forest text-brand-cream"
                      : ""
                  }`}
                >
                  <td
                    className={`py-4 pr-4 text-[15px] font-semibold ${
                      row.highlight ? "text-brand-cream" : "text-brand-ink"
                    }`}
                  >
                    {row.option}
                  </td>
                  <td
                    className={`py-4 px-4 text-[15px] ${
                      row.highlight
                        ? "text-brand-cream font-bold"
                        : "text-brand-taupe"
                    }`}
                  >
                    {row.upfront}
                  </td>
                  <td
                    className={`py-4 px-4 text-[15px] ${
                      row.highlight
                        ? "text-brand-cream font-bold"
                        : "text-brand-taupe"
                    }`}
                  >
                    {row.monthly}
                  </td>
                  <td
                    className={`py-4 px-4 text-[15px] ${
                      row.highlight
                        ? "text-brand-cream font-bold"
                        : "text-brand-taupe"
                    }`}
                  >
                    {row.time}
                  </td>
                  <td
                    className={`py-4 pl-4 text-[15px] ${
                      row.highlight
                        ? "text-brand-cream font-bold"
                        : "text-brand-taupe"
                    }`}
                  >
                    {row.who}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-brand-taupe text-[15px] leading-[1.65] mt-8 max-w-lg mx-auto italic">
          Your website is already built — publish it for free in seconds.
          Upgrade anytime to edit content, add your domain, and more.
        </p>
      </div>
    </section>
  );
}
