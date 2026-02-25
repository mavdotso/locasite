import { Id } from "@/convex/_generated/dataModel";
import ThemeGallery from "./theme-gallery";

interface ThemePageProps {
  params: Promise<{ businessId: string }>;
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { businessId } = await params;
  return <ThemeGallery businessId={businessId as Id<"businesses">} />;
}
