import { Button } from "@/components/button";
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

  function deleteSongAndReturn() {
    supabase
      .from("releases")
      .delete()
      .eq("written_id", props.song.written_id)
      .then(() => {
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
