import AddSongButton from "@/app/_components/add-song-button";
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
import SongDatabase from "@/lib/songs/song-database";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import {
  SiDiscord,
  SiInstagram,
  SiSoundcloud,
  SiSpotify,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import Image from "next/image";
import Link from "next/link";

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
  const db = new SongDatabase(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  var songs = await db.getSongs();

  if (songs) {
    // first song is a card, others are list items
    const firstSong = songs[0];
    const mostRecentItem = (
      <Card>
        <div className="flex">
          <CardHeader className="flex flex-row gap-2 w-full">
            <div className="flex flex-col gap-1 grow">
              <CardTitle>{firstSong.title}</CardTitle>
              <h3 className="font-sans">{firstSong.artists.join(", ")}</h3>
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
            <Badge variant={"secondary"}>
              {formatDate(firstSong.release_date, true)}
            </Badge>
          )}
          {firstSong.type && (
            <Badge variant={"outline"}>{firstSong.type}</Badge>
          )}
        </CardContent>
        <CardFooter>
          <Link className="w-full" href={firstSong.permalink}>
            <Button className="w-full">Stream</Button>
          </Link>
        </CardFooter>
      </Card>
    );

    // remaining entries
    songs = songs.slice(1);

    const secondaryItems = songs.map((song, key) => (
      <Link key={key} href={song.permalink}>
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
                {song.artists.join(", ")}
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
      <main>
        <div>
          <div className="flex items-end mb-3 w-full h-16">
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
        {user && <AddSongButton />}
        {mostRecentItem}
        <div className="flex flex-col gap-4">{secondaryItems}</div>
      </main>
    );
  }
  return <div>Error!</div>;
}
