import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSongList } from "@/lib/songs/song-parser";
import Image from "next/image";
import Link from "next/link";

export default async function Music() {
  var songs = await getSongList();

  if (songs) {
    // first song is a card, others are list items
    const firstSong = songs[0];
    const mostRecentItem = (
      <Card className="bg-gradient-to-br from-popover to-background">
        <div className="flex">
          <CardHeader className="flex flex-row gap-2 w-full">
            <div className="flex flex-col gap-1 grow">
              <CardTitle>{firstSong.title}</CardTitle>
              <h3 className="font-sans">
                {firstSong.release_artists
                  .map((artist) => artist.artists?.name)
                  .join(", ")}
              </h3>
              <CardDescription className="font-medium">
                {firstSong.genres?.name}
              </CardDescription>
            </div>
            <Image
              src={firstSong.art_url || ""}
              alt="album cover"
              width={128}
              height={128}
              className="rounded-sm w-16 h-16"
            />
          </CardHeader>
        </div>
        <CardContent className="flex gap-2">
          <Badge variant={"secondary"}>{firstSong.release_date}</Badge>
          <Badge variant={"outline"}>{firstSong.release_types?.title}</Badge>
        </CardContent>
        <CardFooter>
          <Link className="w-full" href={"music/" + firstSong.written_id}>
            <Button className="w-full">Stream</Button>
          </Link>
        </CardFooter>
      </Card>
    );

    // remaining entries
    songs = songs.slice(1);

    const secondaryItems = songs.map((song, key) => (
      <Link key={key} href={"music/" + song.written_id}>
        <div className="flex items-center gap-4 py-2 rounded-lg cursor-pointer">
          <Image
            src={song.art_url || ""}
            alt="album cover"
            width={128}
            height={128}
            className="rounded-sm w-16 h-16"
          />
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{song.title}</span>
            <div className="flex gap-3">
              <span className="text-muted-foreground">
                {song.release_artists
                  .map((artist) => artist.artists?.name)
                  .join(", ")}
              </span>
              <span className="bg-secondary px-3 py-1 rounded-full font-medium font-mono text-muted-foreground text-xs">
                {song.genres?.name}
              </span>
            </div>
          </div>
        </div>
      </Link>
    ));
    return (
      <div className="flex flex-col gap-4">
        <div className="prose-invert prose">
          <h1 className="mb-3 font-bold">Music</h1>
          <p className="font-mono text-lg text-muted-foreground">Newest</p>
        </div>
        {mostRecentItem}
        <div className="flex flex-col gap-4">{secondaryItems}</div>
      </div>
    );
  }
  return <div>Error!</div>;
}
