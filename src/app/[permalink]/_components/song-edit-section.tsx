import { Button } from "@/components/button";
import SongDatabase from "@/lib/songs/song-database";
import { DBSong } from "@/lib/songs/types";
import { createClient } from "@/lib/supabase/client";
import { mdiNoteEdit, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SongEditSection(props: { song: DBSong }) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  const supabase = createClient();
  const db = new SongDatabase(supabase);

  function deleteSongAndReturn() {
    db.deleteSong(props.song.permalink).then(() => {
      router.push("/");
    });
  }

  useEffect(() => {
    supabase.auth
      .getSession()
      .then((data) => setLoggedIn(data.data.session ? true : false));
  }, [loggedIn, supabase]);

  return (
    <div
      style={{ display: loggedIn ? "flex" : "none" }}
      className="flex gap-2 *:grow"
    >
      <Button
        variant={"secondary"}
        className="mt-4"
        onClick={() => {
          router.push(window.location.href + "/edit");
        }}
      >
        <Icon path={mdiNoteEdit} size={0.75} />
        Edit
      </Button>
      <Button
        variant={"destructive"}
        className="mt-4"
        onClick={deleteSongAndReturn}
      >
        <Icon path={mdiTrashCan} size={0.75} />
        Delete
      </Button>
    </div>
  );
}
