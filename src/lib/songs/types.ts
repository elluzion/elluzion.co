/**
 *
 * TYPES
 *
 */

/**
 * The type of the returned song object gained through {@link getSong(songId)}
 */
export type DBSong = {
  id: number;
  permalink: string;
  title: string;
  description?: string;
  genre: string;
  release_date: Date;
  label?: string;
  tempo?: number;
  art_url: string;
  type: string;
  key?: string;
  artists: string[];
  stream_links: {
    url: string;
  }[];
  download_links: {
    url: string;
    edit: string;
    format: "mp3" | "wav";
  }[];
};

export type StreamLink = DBSong["stream_links"][0];

export type DownloadLink = DBSong["download_links"][0];

export type AudioFormat = DBSong["download_links"][0]["format"];
