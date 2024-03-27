"use server";

import type { StreamLink } from "@/app/add/types";
import { customsearch } from "@googleapis/customsearch";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import Soundcloud from "soundcloud.ts";
import YouTube from "youtube-sr";

const URL_SPOTIFY = (trackId: string) =>
  `https://open.spotify.com/track/${trackId}`;

const URL_SOUNDCLOUD = (accountId: string, trackId: string) =>
  `https://soundcloud.com/${accountId}/${trackId}`;

const URL_YOUTUBE = (videoId: string) =>
  `https://youtube.com/watch?v=${videoId}`;

const URL_DEEZER = (trackId: string) =>
  `https://www.deezer.com/track/${trackId}`;

/**
 * Needs to supply one of the two parameters
 * @param songUrl A direct link to the song. No short links
 * @param searchQuery a search query leading to the song
 * @returns the object of the song, or the first search query result
 */
export const fetchSoundcloudSong = async (
  songUrl: string | null = null,
  searchQuery: string | null = null
) => {
  const soundcloud = new Soundcloud();

  if (songUrl) {
    return await soundcloud.tracks.getV2(songUrl);
  } else if (searchQuery) {
    const search = await soundcloud.tracks.searchV2({ q: searchQuery });
    return search.collection[0];
  } else {
    throw new Error("One needs to be supplied!");
  }
};

const fetchSpotifySong = async (searchQuery: string) => {
  const spotifyApi = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID || "",
    process.env.SPOTIFY_CLIENT_SECRET || ""
  );

  const search = await spotifyApi.search(searchQuery, ["track"], undefined, 1);
  return search.tracks.items[0];
};

/*
this workaround scrapes google for the song from apple music
success rate is "okay", it might throw wrong results when the track just released
and is not yet scraped by google 
*/
const fetchAppleMusicSong = async (searchQuery: string) => {
  const { data } = await customsearch("v1").cse.list({
    q: searchQuery,
    cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
    key: process.env.GOOGLE_API_KEY,
    siteSearch: "music.apple.com",
    siteSearchFilter: "i",
  });

  const songTitle = searchQuery.split(" - ")[1];

  if (!data.items) return;
  const item = data.items.find((item) => item.title?.includes(songTitle));
  return item;
};

const fetchYoutubeSong = async (searchQuery: string) => {
  const search = await YouTube.search(searchQuery, { type: "video", limit: 1 });
  return search[0];
};

const fetchDeezerSong = async (searchQuery: string) => {
  const request = await fetch(
    `https://api.deezer.com/search/track?q=${searchQuery}`
  );
  const search = await request.json();
  return search.data[0];
};

export const fetchLinksForPlatforms = async (
  query: string,
  platforms: string[]
) => {
  // the collection of links
  const links: StreamLink[] = [];

  // isrc for more reliable fetching, needs to be obtained over time
  var isrc: string | null = null;

  const removePlatform = (id: string) =>
    platforms.splice(platforms.indexOf(id), 1);

  // request and parse songs
  // spotify
  if (platforms.includes("spotify")) {
    const song = await fetchSpotifySong(query);
    if (song) {
      if (!isrc) isrc = song.external_ids.isrc;
      links.push({
        platformId: "spotify",
        url: URL_SPOTIFY(song.id),
      });
      removePlatform("spotify");
    }
  }

  // apple music
  // workaround through google search, might take some time to find a link for a song on release day
  // due to slow indexing of new releases
  if (platforms.includes("applemusic")) {
    const song = await fetchAppleMusicSong(query);
    if (song && song.link) {
      links.push({
        platformId: "applemusic",
        url: song.link,
      });
    }
  }

  // youtube
  if (platforms.includes("youtube")) {
    const song = await fetchYoutubeSong(query);
    if (song) {
      links.push({
        platformId: "youtube",
        url: song.id ? URL_YOUTUBE(song.id) : song.url,
      });
      removePlatform("youtube");
    }
  }

  // soundcloud
  if (platforms.includes("soundcloud")) {
    const song = await fetchSoundcloudSong(null, query);
    if (song) {
      links.push({
        platformId: "soundcloud",
        url: URL_SOUNDCLOUD(song.user.permalink, song.permalink),
      });
      removePlatform("soundcloud");
    }
  }

  // amazon
  // TODO: https://developer.amazon.com/de/docs/music/API_web_overview.html

  // deezer
  if (platforms.includes("deezer")) {
    const song = await fetchDeezerSong(query);
    if (song) {
      links.push({
        platformId: "deezer",
        url: URL_DEEZER(song.id),
      });
      removePlatform("deezer");
    }
  }

  // tidal
  // TODO: https://developer.tidal.com/documentation/api/api-overview

  // pandora
  // NOT PUBLICLY AVAILABLE YET

  // return found links
  return {
    links: links,
    notFound: platforms,
  };
};
