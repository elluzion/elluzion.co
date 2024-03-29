import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AddSongScreen } from "./_components/add-song-screen";

export default async function AddSong() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <AddSongScreen />;
}
