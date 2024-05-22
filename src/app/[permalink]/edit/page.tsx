import { SongFormBase } from "@/app/add/_components/song-form-base";
import SongDatabase from "@/lib/songs/song-database";
import { createClient as createClientClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type Params = {
  params: { permalink: string };
};

export default async function EditSong({ params }: Params) {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <SongFormBase editing={params.permalink} />;
}

// page metadata (dynamic)
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const supabase = createClientClient();
  const db = new SongDatabase(supabase);

  // gather info for current song
  const song = await db.getSong(params.permalink);

  // return
  return {
    title: `Edit ${song?.title}`,
  };
}
