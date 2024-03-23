import { Song } from "@/lib/songs/song-parser";
import Link from "next/link";
import { PlatformButton } from "./PlatformButton";

export default function LinkSection(props: { song: Song }) {
  return (
    <div>
      <div>
        {props.song.release_links.length > 0 && (
          <div className="flex flex-col gap-2">
            {props.song.release_links.map((link, key) => (
              <Link key={key} href={link.url} target="_blank">
                <PlatformButton entry={key} platform={link.platform} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
