import { z } from "zod";

export const formSchema = z.object({
  // first page
  songTitle: z.string().min(1).max(100),
  description: z.optional(z.string().max(200)),
  writtenId: z.string().min(1).max(20),
  artists: z.array(
    z.object({
      id: z.optional(z.coerce.number().multipleOf(1)),
      name: z.string(),
    })
  ),
  // second page
  coverUrl: z.string().url().min(1),
  bpm: z.optional(z.coerce.number().min(0).multipleOf(0.01)),
  genre: z.string().max(15),
  releaseType: z.string().max(15),
  key: z.optional(z.string().max(15)),
  label: z.optional(z.string().max(25)),
  releaseDate: z.coerce.date(),

  // third page
  streamLinks: z.array(
    z.object({
      platformId: z.string().min(1),
      url: z.string().url().min(1),
    })
  ),
  downloadLinks: z.optional(
    z.array(
      z.object({
        format: z.string().min(1),
        edit: z.string().min(1),
        url: z.string().url().min(1),
      })
    )
  ),
});
