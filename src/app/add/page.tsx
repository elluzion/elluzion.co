import { createClient } from "@/lib/supabase/server";
import { AddSongScreen } from "./_components/AddSongScreen";
import { redirect } from "next/navigation";

export default async function AddSong() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <AddSongScreen />;
}
