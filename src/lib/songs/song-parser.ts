import supabase from "@/lib/supabase";

/**
 * @returns A list of all songs in the database with including a list of their artists.
 */
export const getSongList = async () => {
  /** TODO: find a way to directly reference columns of referenced tables without them being nested
   * example
   *   labels { name: "xyz" }
   * should instead return
   *   label: "xyz"
   */
  var { data: releases } = await supabase.from("releases").select(
    `
      id,
      written_id,
      title,
      description,
      genre,
      release_date,
      label,
      tempo,
      art_url,
      type,
      key,
      artists(id, name)
    `
  );

  return releases;
};

/**
 *
 * @param songId either the song Id or the "written_id" value of the release, for example from url parameters.
 * @returns All info about a release, including streaming and download links.
 * @type Song
 */
export async function getSong(songId: string | number) {
  // convert songId to number if necessary
  if (typeof songId == "string") {
    songId = await resolveTrackId(songId.toString());
  }

  // fetch release info
  const { data: release } = await supabase
    .from("releases")
    .select(
      `
        id,
        written_id,
        title,
        description,
        genre,
        release_date,
        label,
        tempo,
        art_url,
        type,
        key,
        artists(id, name),
        release_links(platform, url),
        release_downloads(download_url, edit, format)
      `
    )
    .eq("id", songId)
    .single();

  return release;
}

/**
 *
 * @param writtenId the "written_id" value of the release, for example from url parameters.
 * @returns the numeric ID of the release, to be used inside the DB.
 */
const resolveTrackId = async (writtenId: string) => {
  const { data: release } = await supabase
    .from("releases")
    .select("id")
    .eq("written_id", writtenId)
    .single();
  return release?.id || 0;
};
