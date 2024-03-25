import { LoadingContainer } from "@/components/loading-container";
import { getSong } from "@/lib/songs/song-parser";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SongDisplay } from "./_components/SongDisplay";

export default async function SongPage({
  params,
}: {
  params: { songId: string };
}) {
  // gather all info from the database
  const song = await getSong(params.songId);
  // return to home page if track not found
  if (!song) redirect("/");

  return (
    <Suspense fallback={LoadingContainer()}>
      <SongDisplay song={song} />
    </Suspense>
  );
}
