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
  written_id: string;
  title: string;
  description: string | null;
  genre: string;
  release_date: string;
  label: string | null;
  tempo: number | null;
  art_url: string | null;
  type: string;
  key: string | null;
  artists: {
    id: number;
    name: string;
  }[];
  release_links: {
    platform: string | null;
    url: string;
  }[];
  release_downloads: {
    download_url: string;
    edit: string;
    format: "mp3" | "wav";
  }[];
};
