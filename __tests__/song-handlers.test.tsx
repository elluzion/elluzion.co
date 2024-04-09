import SongDatabase from "@/lib/songs/song-database";
import SongServices, { SupportedServices } from "@/lib/songs/song-services";
import { createClient } from "@/lib/supabase/client";

const db = new SongDatabase(createClient());
const services = new SongServices();

it("Song Handlers instantiated successfully", () => {
  expect(db).not.toBe(null);
  expect(services).not.toBe(null);
});

it("Try to return all songs", async () => {
  let songs = await db.getSongs();
  expect(songs).not.toBeNull();
});

it("Try to return existing song", async () => {
  let songs = await db.getSongs();
  if (!songs) return;

  let song = await db.getSong(songs[0].permalink);
  expect(song).not.toBeNull();
});

it("Try to return non-existing song", async () => {
  let song = await db.getSong("NONEXISTENTIDSONG_ABCDEFGHIJKLMNOPQRSTUVXYZ");
  expect(song).toBeNull();
});

it("Song does exist on database", async () => {
  let songs = await db.getSongs();
  if (!songs) return;
  let exists = await db.hasSong(songs[0].permalink);
  expect(exists).toBe(true);
});

it("Song doesn't exist on database", async () => {
  let exists = await db.hasSong("NONEXISTENTIDSONG_ABCDEFGHIJKLMNOPQRSTUVXYZ");
  expect(exists).toBe(false);
});

it("Can find links for track on platforms", async () => {
  let tracks = await services.get(
    "Elluzion & Alvin Mo - Dreaming",
    SupportedServices
  );
  expect(tracks.links.length).toBe(SupportedServices.length);
});
