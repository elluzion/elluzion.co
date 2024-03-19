import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { getSongList } from "@/lib/songs/song-parser";
import Image from "next/image";
import Link from "next/link";
import AddSongButton from "@/components/single-use/AddSongButton";
import { createClient } from "@/lib/supabase/server";

import {
  SiInstagram,
  SiYoutube,
  SiSoundcloud,
  SiSpotify,
  SiDiscord,
} from "@icons-pack/react-simple-icons";
import { mdiInformation } from "@mdi/js";
import Icon from "@mdi/react";

const socialItems = [
  {
    url: "https://instagram.com/elluzion.music",
    icon: <SiInstagram />,
  },
  {
    url: "https://youtube.com/@elluzion.",
    icon: <SiYoutube />,
  },
  {
    url: "https://soundcloud.com/elluzionmusic",
    icon: <SiSoundcloud />,
  },
  {
    url: "https://open.spotify.com/artist/4OgioomMSaD1ier3lIfgzr",
    icon: <SiSpotify />,
  },
  {
    url: "https://discordapp.com/users/317751695213854722",
    icon: <SiDiscord />,
  },
];

export default async function Music() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          <Link className="w-full" href={firstSong.written_id}>
            <Button className="w-full">Stream</Button>
          </Link>
        </CardFooter>
      </Card>
    );

    // remaining entries
    songs = songs.slice(1);

    const secondaryItems = songs.map((song, key) => (
      <Link key={key} href={song.written_id}>
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
        <div>
          <div className="flex items-end mb-3">
            <h1 className="font-bold text-3xl grow">Music</h1>
            <div className="sm:block hidden hover:bg-popover -mb-1 -ml-1 p-1 border rounded-lg transition-colors">
              {socialItems.map((item, key) => (
                <Link href={item.url} key={key} target="_blank">
                  <Button variant="ghost" size="icon" className="*:w-4">
                    {item.icon}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <p className="font-mono text-lg text-muted-foreground">Newest</p>
        </div>
        <span className="flex items-center gap-2 opacity-75 font-mono text-blue-400 text-sm">
          <Icon path={mdiInformation} size={0.75} />
          This website is still highly work in progress. Some bugs may occur.
        </span>
        {mostRecentItem}
        <div className="flex flex-col gap-4">{secondaryItems}</div>
        {user && <AddSongButton />}
      </div>
    );
  }
  return <div>Error!</div>;
}
