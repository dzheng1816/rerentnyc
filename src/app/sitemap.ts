import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rerentnyc.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const { data } = await supabase
    .from("listings")
    .select("id, last_seen")
    .eq("active", true);

  const listingPages: MetadataRoute.Sitemap = (data || []).map((listing) => ({
    url: `${baseUrl}/listing/${listing.id}`,
    lastModified: new Date(listing.last_seen),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...listingPages];
}
