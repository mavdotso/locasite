import { Id } from "@/convex/_generated/dataModel";

interface EngagementData {
  pageViews: number;
  phoneClicks: number;
  emailClicks: number;
  directionsClicks: number;
}

interface EngagementClaimBannerProps {
  businessId: Id<"businesses">;
  businessDomain: string;
  engagement?: EngagementData | null;
}

export function EngagementClaimBanner({
  businessId,
  businessDomain,
  engagement,
}: EngagementClaimBannerProps) {
  const statMessage = getStatMessage(engagement);

  return (
    <div className="px-4 py-2 bg-amber-50 border-b border-amber-200">
      <div className="container flex items-center justify-between mx-auto">
        <div>
          <p className="text-sm font-medium text-amber-800">
            Are you the owner of this business?
          </p>
          <p className="text-xs text-amber-600">
            {statMessage ||
              "Claim your business to manage information and respond to customers"}
          </p>
        </div>
        <a
          href={`/${businessDomain}/claim/${businessId}`}
          className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shrink-0"
        >
          Claim this Business
        </a>
      </div>
    </div>
  );
}

function getStatMessage(
  engagement: EngagementData | null | undefined,
): string | null {
  if (!engagement) return null;

  const { pageViews, phoneClicks, emailClicks, directionsClicks } = engagement;
  const totalClicks = phoneClicks + emailClicks + directionsClicks;

  if (phoneClicks >= 3) {
    return `${phoneClicks} people called your phone number this month. Claim your page to see the full report.`;
  }
  if (totalClicks >= 3) {
    return `${totalClicks} people tried to contact you this month. Claim your page to see the full report.`;
  }
  if (pageViews >= 10) {
    return `${pageViews} people viewed your business this month. Claim your page to see the full report.`;
  }

  return null;
}
