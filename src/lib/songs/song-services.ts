import { customsearch } from "@googleapis/customsearch";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import Soundcloud from "soundcloud.ts";
import YouTube from "youtube-sr";
import { StreamLink } from "./types";

export default class SongServices {
  private spotifyApi;
  private soundcloudApi;
  private gCustomSearchApi;
  private YouTubeApi;

  constructor() {
    this.spotifyApi = SpotifyApi.withClientCredentials(
      process.env.SPOTIFY_CLIENT_ID || "",
      process.env.SPOTIFY_CLIENT_SECRET || ""
    );
    this.soundcloudApi = new Soundcloud();
    this.gCustomSearchApi = customsearch("v1").cse;
    this.YouTubeApi = YouTube;
  }

  /**
   *
   * @param searchQuery A search query for the song, such as "Artist 1 & Artist 2 - Song Title"
   * @param platforms List of platforms to get the links for. Supported ones are {@link SupportedPlatforms}
   * @returns
   */
  async get(
    searchQuery: string,
    platforms: SupportedServicesType[]
  ): Promise<{ links: StreamLink[]; failed: string[] }> {
    const fetchedPlatforms: StreamLink[] = [];
    const failedPlatforms: string[] = [];

    for (const platform of platforms) {
      let link = null;

      switch (platform) {
        case "applemusic":
          link = await this.getAppleMusic(searchQuery);
          break;
        case "deezer":
          link = await this.getDeezer(searchQuery);
          break;
        case "soundcloud":
          link = await this.getSoundcloud(searchQuery);
          break;
        case "spotify":
          link = await this.getSpotify(searchQuery);
          break;
        case "youtube":
          link = await this.getYoutube(searchQuery);
          break;
      }

      if (link) fetchedPlatforms.push(link);
      else failedPlatforms.push(platform);
    }

    return {
      links: fetchedPlatforms,
      failed: failedPlatforms,
    };
  }

  async importFromSoundcloud(url: string) {
    if (!url.startsWith("https://") || !url.includes("soundcloud.com")) {
      throw Error("The provided URL has to be a Soundcloud link");
    }

    try {
      const track = await this.soundcloudApi.tracks.getV2(url);

      const parsedTitle = this.parseQuery(track.title);
      const description = track.description?.split("\n")[0] || undefined;
      const releaseDate = new Date(track.release_date || track.display_date);

      return {
        artists: parsedTitle.artists,
        title: parsedTitle.title,
        description: description,
        permalink: track.permalink,
        release_date: releaseDate,
        label: track.label_name,
        art_url: track.artwork_url,
        genre: track.genre,
      };
    } catch (e) {
      console.log(e);
    }
  }

  private async getSoundcloud(
    searchQuery: string
  ): Promise<StreamLink | undefined> {
    try {
      const search = await this.soundcloudApi.tracks.searchV2({
        q: searchQuery,
      });

      const url = search.collection[0].permalink_url;

      return {
        url: url,
      };
    } catch (e) {
      console.log(e);
    }
  }

  private async getSpotify(
    searchQuery: string
  ): Promise<StreamLink | undefined> {
    try {
      const search = await this.spotifyApi.search(
        searchQuery,
        ["track"],
        undefined,
        1
      );

      if (!search.tracks.items[0]) return;
      return {
        url: `https://open.spotify.com/track/${search.tracks.items[0].id}`,
      };
    } catch (e) {
      console.log(e);
    }
  }

  private async getAppleMusic(
    searchQuery: string
  ): Promise<StreamLink | undefined> {
    try {
      const { data } = await this.gCustomSearchApi.list({
        q: searchQuery,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        key: process.env.GOOGLE_API_KEY,
        siteSearch: "music.apple.com",
        siteSearchFilter: "i",
      });

      if (!data.items) return;
      const item = data.items.find((item) =>
        item.title?.includes(this.parseQuery(searchQuery).title)
      );
      if (!item?.link) return;
      return {
        url: item.link,
      };
    } catch (e) {
      console.log(e);
    }
  }

  private async getYoutube(
    searchQuery: string
  ): Promise<StreamLink | undefined> {
    try {
      const searchItem = (
        await this.YouTubeApi.search(searchQuery, {
          type: "video",
          limit: 1,
        })
      )[0];

      if (!searchItem) return;
      return {
        url: searchItem.url,
      };
    } catch (e) {
      console.log(e);
    }
  }

  private async getDeezer(
    searchQuery: string
  ): Promise<StreamLink | undefined> {
    try {
      const request = await fetch(
        `https://api.deezer.com/search/track?q=${searchQuery}`
      );
      const search = await request.json();
      if (!search.data[0].link) return;
      return {
        url: search.data[0].link,
      };
    } catch (e) {
      console.log(e);
    }
  }

  /**
   *
   * @param query A song title query such as "Artist 1 , Artist 2 & Artist 3 - Song Title"
   * @returns an object with the title separated into artists and song title
   */
  private parseQuery(query: string) {
    const split = query.split("-");
    const hasArtists = split.length == 1 ? false : true;
    const title = split[split.length - 1].trim();
    const artists = split[0].split(/(?:,|&)+/).map((x) => x.trim());
    return {
      title: title,
      artists: hasArtists ? artists : undefined,
    };
  }
}

/*
 * Services that are supported to automatically fetch links for.
 */
export const SupportedServices = [
  "soundcloud",
  "spotify",
  "applemusic",
  "youtube",
  "deezer",
] as const;

/**
 * {@link SupportedServices} as type
 */
export type SupportedServicesType = (typeof SupportedServices)[number];
