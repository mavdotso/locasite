import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ThemeEditorPage } from "./theme-editor-page";

export default async function BusinessThemePage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId: businessIdParam } = await params;
  const businessId = businessIdParam as Id<"businesses">;
  const preloadedBusiness = await preloadQuery(api.businesses.getById, { id: businessId });
  
  return <ThemeEditorPage businessId={businessId} preloadedBusiness={preloadedBusiness} />;
}