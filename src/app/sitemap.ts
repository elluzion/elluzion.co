import SongDatabase from "@/lib/songs/song-database";
import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const db = new SongDatabase(supabase);

  const trackLinks: MetadataRoute.Sitemap =
    (await db.getSongs())?.map((song) => {
      return {
        url: `https://elluzion.co/${song.permalink}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 0.5,
      };
    }) || [];
  const links: MetadataRoute.Sitemap = [
    {
      url: "https://elluzion.co",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: "https://elluzion.co/tools/analyzer",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...trackLinks,
  ];

  return links;
}
