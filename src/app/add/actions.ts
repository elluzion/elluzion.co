"use server";

import SongServices, { SupportedServicesType } from "@/lib/songs/song-services";

const services = new SongServices();

export async function importFromSoundcloud(url: string) {
  return await services.importFromSoundcloud(url);
}

export async function getServices(
  searchQuery: string,
  platforms: SupportedServicesType[]
) {
  return await services.get(searchQuery, platforms);
}
