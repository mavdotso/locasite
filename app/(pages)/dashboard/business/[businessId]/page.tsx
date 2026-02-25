import { redirect } from "next/navigation";

interface BusinessDashboardPageProps {
  params: Promise<{
    businessId: string;
  }>;
}

export default async function BusinessDashboardPage({
  params,
}: BusinessDashboardPageProps) {
  const { businessId } = await params;
  redirect(`/business/${businessId}/edit`);
}
