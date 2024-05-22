import { Database } from "@/types/supabase";
import { createClient } from "../supabase/client";
import { createClient as createServerClient } from "../supabase/server";
import { DBSong, DownloadLink, StreamLink } from "./types";

// database object
export default class SongDatabase {
  private supabase;
  constructor(isServer: boolean) {
    this.supabase = isServer ? createServerClient() : createClient();
  }

  /**
   * @param songId the written ID of the song
   * @returns whether song exists on database
   */
  async hasSong(permalink: string) {
    const song = await this.getSong(permalink);
    return song ? true : false;
  }

  /**
   * @returns A collection of all songs stored in the database
   */
  async getSongs() {
    let { data: releases } = await this.supabase
      .from(RELEASES_TABLE)
      .select(DBSONG_QUERY)
      .order("release_date", { ascending: false });

    if (releases) {
      const releasesFixed = releases.map((release) => {
        return {
          ...release,
          release_date: new Date(release.release_date),
        } as DBSong;
      });
      return releasesFixed;
    } else {
      return undefined;
    }
  }

  /**
   * @param permalink the permalink of the song
   * @returns A song object matching the songId
   */
  async getSong(permalink: string) {
    // fetch release info
    let { data: release } = await this.supabase
      .from(RELEASES_TABLE)
      .select(DBSONG_QUERY)
      .eq("permalink", permalink)
      .single();

    if (release) {
      // convert release date string to date object
      const releaseFixed = {
        ...release,
        release_date: new Date(release.release_date),
      };
      return releaseFixed as DBSong;
    } else {
      return undefined;
    }
  }

  /**
   * @throws {PostgrestError}
   * @param song the full DBSong object to be added or updated to the Database, ID can be set to anything
   * @param isUpdate Whether the action is updating an existing song or adding a new one
   * @returns the release permalink
   */
  async pushSong(song: DBSong, isUpdate: boolean) {
    // releases row
    const { data: release, error } = await this.supabase
      .from(RELEASES_TABLE)
      .upsert({
        id: isUpdate ? song.id : undefined,
        permalink: song.permalink,
        artists: song.artists,
        art_url: song.art_url,
        description: song.description,
        genre: song.genre,
        key: song.key,
        label: song.label,
        release_date: song.release_date.toISOString(),
        tempo: song.tempo,
        title: song.title,
        type: song.type,
      })
      .select()
      .single();
    if (error) throw error;

    // if update, clean up platform and download links before
    if (isUpdate) {
      const { error: removeLinksError } = await this.supabase
        .from(LINKS_TABLE)
        .delete()
        .eq("release_id", song.id);
      if (removeLinksError) throw removeLinksError;

      const { error: removeDownloadsError } = await this.supabase
        .from(DOWNLOADS_TABLE)
        .delete()
        .eq("release_id", song.id);
      if (removeDownloadsError) throw removeDownloadsError;
    }
    // release_links row
    this.insertStreamLinks(release.id, song.stream_links);

    // release_downloads row
    this.insertDownloadLinks(release.id, song.download_links);

    return release.permalink;
  }

  /**
   * @param permalink the permalink of the song to be deleted
   * @returns Whether deletion is successfull
   */
  async deleteSong(permalink: string) {
    const { error } = await this.supabase.from(RELEASES_TABLE).delete().eq("permalink", permalink);
    return error ? false : true;
  }

  /**
   * @throws {PostgrestError}
   */
  private async insertStreamLinks(id: number, links: StreamLink[]) {
    if (links.length > 0) {
      const streamlinks: LinksInsert = links.map((link) => {
        return {
          url: link.url,
          release_id: id,
        };
      });
      const { error } = await this.supabase.from(LINKS_TABLE).insert(streamlinks);
      if (error) throw error;
    }
  }

  /**
   * @throws {PostgrestError}
   */
  private async insertDownloadLinks(id: number, links: DownloadLink[]) {
    if (links.length > 0) {
      const downloadLinks: DownloadsInsert = links.map((link) => {
        return {
          url: link.url,
          release_id: id,
          edit: link.edit,
          format: link.format,
        };
      });
      const { error } = await this.supabase.from(DOWNLOADS_TABLE).insert(downloadLinks);
      if (error) throw error;
    }
  }
}

// Constants
const RELEASES_TABLE = "releases_v2";
const LINKS_TABLE = "release_links_v2";
const DOWNLOADS_TABLE = "release_downloads_v2";

const DBSONG_QUERY = `
    id,
    permalink,
    artists,
    title,
    description,
    stream_links:${LINKS_TABLE}(url),
    download_links:${DOWNLOADS_TABLE}(url, edit, format),
    genre,
    release_date,
    label,
    tempo,
    art_url,
    type,
    key
  `;

// Types
type LinksInsert = Database["public"]["Tables"]["release_links_v2"]["Insert"][];
type DownloadsInsert = Database["public"]["Tables"]["release_downloads_v2"]["Insert"][];
