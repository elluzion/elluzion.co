"use server";

import SongDatabase from "@/lib/songs/song-database";

export async function getSongs() {
  const db = new SongDatabase(true);
  return await db.getSongs();
}
