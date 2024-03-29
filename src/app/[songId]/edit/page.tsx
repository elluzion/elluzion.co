import { AddSongScreen } from "@/app/add/_components/add-song-screen";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EditSong({
  params,
}: {
  params: { songId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <AddSongScreen editing={params.songId} />;
}
