"use server";

import SongDatabase from "@/lib/songs/song-database";
import SongServices, { SupportedServicesType } from "@/lib/songs/song-services";
import { DBSong } from "@/lib/songs/types";

const services = new SongServices();

export async function importFromSoundcloud(url: string) {
  return await services.importFromSoundcloud(url);
}

export async function getServices(searchQuery: string, platforms: SupportedServicesType[]) {
  return await services.get(searchQuery, platforms);
}

export async function hasSong(permalink: string) {
  const db = new SongDatabase(true);
  return await db.hasSong(permalink);
}

export async function getSong(permalink: string) {
  const db = new SongDatabase(true);
  return await db.getSong(permalink);
}

export async function pushSong(song: DBSong, isUpdate: boolean) {
  const db = new SongDatabase(true);
  return await db.pushSong(song, isUpdate);
}
