import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SongFormBase } from "./_components/song-form-base";

export default async function AddSong() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <SongFormBase />;
}

export const metadata: Metadata = { title: "Add song" };
