import { getSong } from "@/lib/songs/song-parser";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SongDisplay } from "./_components/song-display";

type Params = {
  params: { songId: string };
};

export default async function SongPage({ params }: Params) {
  // gather all info from the database
  const song = await getSong(params.songId);
  // return to home page if track not found
  if (!song) redirect("/");

  return <SongDisplay song={song} />;
}

// page metadata (dynamic)
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const fallbackImageUrl =
    "https://i1.sndcdn.com/avatars-Sen1bkxTWtJUDjut-zCRlvQ-large.jpg";

  // gather info for current song
  const song = await getSong(params.songId);

  // generate description
  // "Song <songname> released on <dd-mm-yyyy> (via <label>)."
  const description = `${song?.title} released on ${song?.release_date}
  ${song?.label ? " via " + song?.label : ""}.`;

  /**
   * Note: this is a hacky way of getting a larger image, since Souncloud could potentially change their API and break it
   */
  const image = song?.art_url.replace("large", "t500x500") || fallbackImageUrl;
  // return
  return {
    title: song?.title,
    description: description,
    openGraph: {
      images: [image],
    },
  };
}
