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

  //#region Constructor
  constructor() {
    this.spotifyApi = SpotifyApi.withClientCredentials(
      process.env.SPOTIFY_CLIENT_ID || "",
      process.env.SPOTIFY_CLIENT_SECRET || ""
    );
    this.soundcloudApi = new Soundcloud();
    this.gCustomSearchApi = customsearch("v1").cse;
    this.YouTubeApi = YouTube;
  }
  //#endregion

  //#region Public functions
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

    // cleanup search query
    searchQuery = this.toUrlSafeString(searchQuery);

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
  //#endregion

  //#region Private functions
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
      if (!search.data[0] || !search.data[0].link) return;
      return {
        url: search.data[0].link,
      };
    } catch (e) {
      console.log(e);
    }
  }
  //#endregion

  //#region Soundcloud import
  async importFromSoundcloud(url: string) {
    if (!url.startsWith("https://") || !url.includes("soundcloud.com")) {
      throw Error("The provided URL has to be a Soundcloud link");
    }

    try {
      const track = await this.soundcloudApi.tracks.getV2(url);

      const parsedQuery = this.parseQuery(track.title);
      const description = track.description?.split("\n")[0] || undefined;
      const permalink = this.toUrlSafeString(parsedQuery.title);
      const releaseDate = new Date(track.release_date || track.display_date);

      return {
        artists: parsedQuery.artists,
        title: parsedQuery.title,
        description: description,
        permalink: permalink,
        release_date: releaseDate,
        label: track.label_name,
        art_url: track.artwork_url,
        genre: track.genre,
      };
    } catch (e) {
      console.log(e);
    }
  }
  //#endregion

  //#region Utilities
  /**
   *
   * @param query A song title query such as "Artist 1 , Artist 2 & Artist 3 - Song Title (feat. Artist 4) - Artist 5 Remix"
   * @returns an object with the title separated into artists and song title
   */
  private parseQuery(query: string) {
    const splitQuery = query.split("-");
    const artistsText = splitQuery[0];
    const titleText = splitQuery[splitQuery.length - 1];

    let artists: string[] = [];
    let title = "";

    /**
     * TITLE
     */
    title = titleText
      .replace("(ft.", "(feat.") // some people use ft. as a short form, we unify it to feat.
      .replace("(featuring", "(feat.") // or they use featuring
      .replaceAll("[", "(") // replace [] with ()
      .replaceAll("]", ")") // ^^
      .trim(); // trim title

    /**
     * MAIN ARTISTS
     */
    // if query has the format of "<artists> - <title>"
    if (splitQuery.length > 1) {
      // add artists from title start, separated by comma or &
      artists = artistsText
        .split(/(?:,|&)+/) // separated by comma or &
        .map((x) => x.trim()); // trim artist names
    }

    /**
     * FEATURE ARTISTS
     */
    try {
      const featureText = title.split("(feat.")[1].split(")")[0];
      // title: remove feature bracket
      title = title.replace(`(feat.${featureText})`, "");
      // feature artists, separated by comma
      const featureArtists = featureText.split(",").map((x) => x.trim());
      artists.push(...featureArtists);
    } catch (e) {
      /* no feature bracket found */
    }

    // remove redundant whitespace
    title = title.replace(/\s+/g, " ").trim();

    return {
      title: title,
      artists: artists,
    };
  }

  private toUrlSafeString(input: string) {
    return input
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "") // remove all characters except letters, numbers and whitespace
      .replace(/\s+/g, "-") // replace multiple whitespaces with one
      .trim(); // trim
  }
  //#endregion
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
