import { redirect } from "next/navigation";
import { Song, getSong } from "@/lib/songs/song-parser";
import { SongDisplay } from "./SongDisplay";
import { Suspense } from "react";
import { LoadingContainer } from "@/components/ui/loading-container";

export default async function SongPage({
  params,
}: {
  params: { songId: string };
}) {
  // gather all info from the database

  const song: Song | null = await getSong(params.songId);
  if (!song) redirect("/music");

  return (
    <Suspense fallback={LoadingContainer()}>
      <SongDisplay song={song} />
    </Suspense>
  );
}
