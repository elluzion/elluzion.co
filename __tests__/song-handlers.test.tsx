import SongDatabase from "@/lib/songs/song-database";
import SongServices, { SupportedServices } from "@/lib/songs/song-services";

const db = new SongDatabase(false);
const services = new SongServices();

it("Song Handlers instantiated successfully", () => {
  expect(db).not.toBeNull();
  expect(services).not.toBeNull();
});

it("Try to return all songs", async () => {
  let songs = await db.getSongs();
  expect(songs).not.toBeUndefined();
});

it("Try to return existing song", async () => {
  let songs = await db.getSongs();
  if (!songs) return;

  let song = await db.getSong(songs[0].permalink);
  expect(song).not.toBeUndefined();
});

it("Try to return non-existing song", async () => {
  let song = await db.getSong("NONEXISTENTIDSONG_ABCDEFGHIJKLMNOPQRSTUVXYZ");
  expect(song).toBeUndefined();
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
    SupportedServices.map((x) => x)
  );
  console.log(tracks);
  expect(tracks.links.length).toBe(SupportedServices.length);
});
