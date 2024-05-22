"use server";

import SongDatabase from "@/lib/songs/song-database";

export async function getSong(permalink: string) {
  const db = new SongDatabase(true);
  return await db.getSong(permalink);
}

export async function deleteSong(permalink: string) {
  const db = new SongDatabase(true);
  return await db.deleteSong(permalink);
}
