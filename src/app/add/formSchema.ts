import type { DBSong } from "@/lib/songs/types";
import { z } from "zod";

/**
 * In sync with {@link DBSong}
 */
export const formSchema = z.object({
  id: z.number().default(0),
  // first page
  permalink: z.string().min(1).max(20),
  title: z.string().min(1).max(100),
  description: z.optional(z.string().max(200)),
  genre: z.string().max(15),
  release_date: z.coerce.date(),
  artists: z.array(z.string().min(1).max(100)),

  // second page
  label: z.optional(z.string().max(25)),
  tempo: z.optional(z.coerce.number().min(0).multipleOf(0.01)),
  art_url: z.string().url().min(1),
  type: z.string().max(15),
  key: z.optional(z.string().max(15)),

  // third page
  stream_links: z
    .array(
      z.object({
        url: z.string().url().min(1),
      })
    )
    .default([]),
  download_links: z
    .array(
      z.object({
        url: z.string().url().min(1),
        edit: z.string().min(1),
        format: z.enum(["wav", "mp3"]),
      })
    )
    .default([]),
});
