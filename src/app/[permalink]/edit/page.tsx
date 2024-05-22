import { SongFormBase } from "@/app/add/_components/song-form-base";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSong } from "../actions";

type Params = {
  params: { permalink: string };
};

export default async function EditSong({ params }: Params) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <SongFormBase editing={params.permalink} />;
}

// page metadata (dynamic)
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  // gather info for current song
  const song = await getSong(params.permalink);

  // return
  return {
    title: `Edit ${song?.title}`,
  };
}
