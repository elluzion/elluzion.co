import { redirect } from "next/navigation";
import { Song, getSong } from "@/lib/songs/song-parser";
import { SongDisplay } from "./_components/SongDisplay";
import { Suspense } from "react";
import { LoadingContainer } from "@/components/loading-container";

export default async function SongPage({
  params,
}: {
  params: { songId: string };
}) {
  // gather all info from the database
  const song: Song | null = await getSong(params.songId);
  // return to home page if track not found
  if (!song) redirect("/");

  return (
    <Suspense fallback={LoadingContainer()}>
      <SongDisplay song={song} />
    </Suspense>
  );
}
