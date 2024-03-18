"use server";

import { z } from "zod";
import { formSchema } from "./formSchema";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

/**
 *
 * NEEDS AUTHORIZATION
 *
 */
export async function pushSongToDatabase(data: z.infer<typeof formSchema>) {
  const supabase = createClient();

  try {
    /**
     * main data
     */
    const release: Database["public"]["Tables"]["releases"]["Insert"] = {
      written_id: data.writtenId,
      release_date: data.releaseDate.toISOString(),
      title: data.songTitle,
      art_url: data.coverUrl,
      type: data.releaseType,
      genre: data.genre,
      description: data.description,
      tempo: data.bpm,
      key: data.key,
      label: data.label,
    };
    const { data: newRow, error: error1 } = await supabase
      .from("releases")
      .insert(release)
      .select()
      .single();
    if (!newRow || error1) throw error1;
    const releaseId = newRow.id;

    /**
     * artists
     */
    // fetch existing
    const { data: existingArtists, error: error2 } = await supabase
      .from("artists")
      .select("*");
    if (!existingArtists || error2) throw error2;

    // add new + return their rows
    const artistsWithId = data.artists.filter((x) => x.id != null);
    const artistsWithoutId = data.artists.filter((x) => x.id == null);

    const { data: artistsAdded, error: error3 } = await supabase
      .from("artists")
      .insert(artistsWithoutId)
      .select();
    if (!artistsAdded || error3) throw error3;

    const newArtists = artistsAdded;
    artistsWithId.map((artist) => {
      newArtists.push({
        name: artist.name,
        id: artist.id || 0, // will never happen because of earlier filtering
      });
    });

    // release-artists
    const releaseArtists: Database["public"]["Tables"]["release_artists"]["Insert"][] =
      newArtists.map((artist) => {
        return {
          artist_id: artist.id,
          release_id: releaseId,
        };
      });
    const { error: error4 } = await supabase
      .from("release_artists")
      .insert(releaseArtists);
    if (error4) throw error4;

    /**
     * stream links
     */
    const formattedStreamlinks: Database["public"]["Tables"]["release_links"]["Insert"][] =
      data.streamLinks.map((link) => {
        return {
          url: link.url,
          release_id: releaseId,
          platform: link.platformId,
        };
      });

    const { error: error5 } = await supabase
      .from("release_links")
      .insert(formattedStreamlinks);
    if (error5) throw error5;

    /**
     * download links
     */
    const formattedDownloadlinks:
      | Database["public"]["Tables"]["release_downloads"]["Insert"][]
      | undefined = data.downloadLinks?.map((link) => {
      return {
        download_url: link.url,
        release_id: releaseId,
        edit: link.edit,
        format:
          link.format == "mp3" || link.format == "wav" ? link.format : "mp3",
      };
    });
    if (formattedDownloadlinks && formattedDownloadlinks?.length > 0) {
      const { error: error6 } = await supabase
        .from("release_downloads")
        .insert(formattedDownloadlinks);
      if (error6) throw error6;
    }
  } catch (e) {
    // remove again when something bad happens
    await supabase.from("releases").delete().eq("written_id", data.writtenId);

    throw e;
  }
}
