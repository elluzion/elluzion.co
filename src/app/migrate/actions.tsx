"use server";

import SongDatabase from "@/lib/songs/song-database";
import { DBSong } from "@/lib/songs/types";
import { createClient } from "@/lib/supabase/server";

export async function migrate() {
  const supabase = createClient();
  const db = new SongDatabase(supabase);
  const songs = await getSongList();
  console.log(songs);
  if (songs) {
    songs.forEach(async (song) => {
      await db.pushSong(song, false);
    });
  }
}

const getSongList = async () => {
  const supabase = createClient();
  /** TODO: find a way to directly reference columns of referenced tables without them being nested
   * example
   *   labels { name: "xyz" }
   * should instead return
   *   label: "xyz"
   */
  var { data: releases } = await supabase
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
    .order("release_date", { ascending: false });

  const newj = releases?.map((r) => {
    const artists = r.artists.map((x) => x.name);
    const stream_links = r.release_links.map((x) => {
      return { url: x.url };
    });
    const download_links = r.release_downloads.map((x) => {
      return {
        url: x.download_url,
        edit: x.edit,
        format: x.format,
      };
    });
    return {
      id: r.id,
      permalink: r.written_id,
      title: r.title,
      description: r.description,
      genre: r.genre,
      release_date: new Date(r.release_date),
      label: r.label,
      tempo: r.tempo,
      art_url: r.art_url,
      type: r.type,
      key: r.key,
      artists: artists,
      stream_links: stream_links,
      download_links: download_links,
    } as DBSong;
  });
  return newj;
};
