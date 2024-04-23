import SongDatabase from "@/lib/songs/song-database";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SongDisplay } from "./_components/song-display";

type Params = {
  params: { permalink: string };
};

export const revalidate = 300; // revalidate data every 5 minutes to capture changes in the database

const supabase = createClient();
const db = new SongDatabase(supabase);

export default async function SongPage({ params }: Params) {
  // gather all info from the database
  const song = await db.getSong(params.permalink);

  // return to home page if track not found
  if (!song) redirect("/");

  return <SongDisplay song={song} />;
}

// page metadata (dynamic)
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const fallbackImageUrl =
    "https://i1.sndcdn.com/avatars-Sen1bkxTWtJUDjut-zCRlvQ-t500x500.jpg";

  // gather all info from the database
  const song = await db.getSong(params.permalink);

  if (!song) {
    return {
      title: `Song ${params.permalink} doesn't exist`,
    };
  }

  // generate description
  // "<songname (is a <genre> track that) released on <date> (via <label>)."
  const description = `${song.title} ${
    song.genre ? "is a " + song.genre + "track that " : ""
  }released on ${formatDate(song.release_date, false)}${
    song.label ? " via " + song.label : ""
  }.`;

  /**
   * Note: this is a hacky way of getting a larger image, since Souncloud could potentially change their API and break it
   */
  const image = song.art_url.replace("large", "t500x500") || fallbackImageUrl;

  return {
    title: song.title,
    description: description,
    openGraph: {
      images: [image],
    },
  };
}
