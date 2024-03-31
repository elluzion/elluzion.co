import { AddSongScreen } from "@/app/add/_components/add-song-screen";
import { getSong } from "@/lib/songs/song-parser";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type Params = {
  params: { songId: string };
};

export default async function EditSong({ params }: Params) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <AddSongScreen editing={params.songId} />;
}

// page metadata (dynamic)
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  // gather info for current song
  const song = await getSong(params.songId);

  // return
  return {
    title: `Edit ${song?.title}`,
  };
}
