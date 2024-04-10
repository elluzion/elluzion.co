import { DBSong } from "@/lib/songs/types";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { PlatformButton } from "./platform-button";

export default function LinkSection(props: { song: DBSong }) {
  const supa = createClient();

  return (
    <div>
      <div>
        {props.song.stream_links.length > 0 && (
          <div className="flex flex-col gap-2">
            {props.song.stream_links.map((link, key) => (
              <Link key={key} href={link.url} target="_blank">
                <PlatformButton entry={key} url={link.url} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
