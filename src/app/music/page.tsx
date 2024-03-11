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
      <Card>
        <div className="flex">
          <CardHeader className="flex flex-row gap-2 w-full">
            <div className="flex flex-col gap-1 grow">
              <CardTitle>{firstSong.title}</CardTitle>
              <h3 className="font-sans">
                {firstSong.artists.map((artist) => artist.name).join(", ")}
              </h3>
              <CardDescription className="font-medium">
                {firstSong.genre}
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
        <CardContent className="has-[:first-child]:flex gap-2 hidden">
          {firstSong.release_date && (
            <Badge variant={"secondary"}>{firstSong.release_date}</Badge>
          )}
          {firstSong.type && (
            <Badge variant={"outline"}>{firstSong.type}</Badge>
          )}
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
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                {song.artists.map((artist) => artist.name).join(", ")}
              </span>
              <Badge variant={"secondary"} className="h-6">
                {song.genre}
              </Badge>
            </div>
          </div>
        </div>
      </Link>
    ));
    return (
      <div className="flex flex-col gap-4 mt-16">
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
