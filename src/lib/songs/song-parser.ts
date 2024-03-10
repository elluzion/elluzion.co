import { createClient } from "@/lib/supabase/server";

const supabase = createClient();

/**
 * @returns A list of all songs in the database with including a list of their artists.
 */
export const getSongList = async () => {
  const { data: releases } = await supabase
    .from("releases")
    .select(
      "id, written_id, title, description, genres(name), release_date, labels(name), tempo, art_url, release_types(title), key, release_artists(artists(id, name))"
    );

  return releases;
};

/**
 *
 * @param writtenId the "written_id" value of the release, for example from url parameters.
 * @returns the numeric ID of the release, to be used inside the DB.
 */
export const resolveTrackId = async (writtenId: string) => {
  const { data: release } = await supabase
    .from("releases")
    .select("id")
    .eq("written_id", writtenId);
  return release;
};
