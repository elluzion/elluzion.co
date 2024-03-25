import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AddSongScreen } from "./_components/AddSongScreen";

export default async function AddSong() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <AddSongScreen />;
}
