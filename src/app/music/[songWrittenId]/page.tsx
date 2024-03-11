import { DragHandle } from "@/components/ui/drag-handle";
import Image from "next/image";
import Link from "next/link";
import { PlatformButton } from "./PlatformButton";
import { getSong } from "@/lib/songs/song-parser";
import { redirect } from "next/navigation";
import { SongInfoCard } from "./SongInfoCard";

export default async function SongPage({
  params,
}: {
  params: { songWrittenId: string };
}) {
  const writtenSongId = params.songWrittenId;

  // gather all info from the database
  const songData = await getSong(writtenSongId);

  // redirect if song not found
  if (!songData) redirect("/music");

  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <div className="relative -left-4 md:left-0 rounded-t-3xl w-screen md:w-full h-[400px] overflow-clip mix-blend-lighten">
        <Image
          alt="cover"
          src={songData?.art_url || ""}
          className="blur-3xl w-full h-[400px]"
          width={256}
          height={256}
        />
        <div className="bg-gradient-to-b from-transparent to-background w-full h-[400px] -translate-y-[400px]" />
        <div className="flex flex-col justify-center items-center gap-2 p-8 w-full h-[336px] -translate-y-[800px]">
          <h1 className="font-semibold text-4xl text-center">
            {songData?.title}
          </h1>
          <span className="text-muted-foreground">
            {songData?.release_artists
              .map((artist) => artist.artists?.name)
              .join(", ")}
          </span>
        </div>
      </div>
      {/* INFO CARD */}
      <SongInfoCard
        description={songData?.description}
        tempo={songData?.tempo}
        songKey={songData?.key}
        label={songData?.labels?.name}
        genre={songData?.genres?.name}
        release_date={songData.release_date}
        type={songData?.release_types?.title}
        downloads={[]}
      />
      {/* LINK SECTION */}
      <div className="flex justify-center items-center w-full h-8">
        <DragHandle width={64} height={2} />
      </div>
      <div>
        {songData.release_links.length > 0 && (
          <div className="flex flex-col gap-2">
            {songData?.release_links.map((link, key) => (
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
