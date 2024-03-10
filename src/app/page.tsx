import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  SiInstagram,
  SiYoutube,
  SiSoundcloud,
  SiSpotify,
  SiTelegram,
  SiGithub,
  SiDiscord,
} from "@icons-pack/react-simple-icons";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
      url: "https://t.me/elluzion",
      icon: <SiTelegram />,
    },
    {
      url: "https://github.com/elluzion",
      icon: <SiGithub />,
    },
    {
      url: "https://discordapp.com/users/317751695213854722",
      icon: <SiDiscord />,
    },
  ];

  return (
    <main className="flex flex-col mt-16 mb-8 w-full">
      <Card>
        <div className="flex flex-row gap-4">
          <div>
            <CardHeader>
              <CardTitle>Fynn Rübenach</CardTitle>
              <CardDescription>elluzion</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                I am Fynn, a music producer, software developer and overall
                creative that loves to work on projects on the internet, born in
                2004 in Germany.
              </p>
            </CardContent>
          </div>
          <Image
            src="https://avatars.githubusercontent.com/u/26468783?v=4"
            className="m-8 ml-0 rounded-3xl w-20 h-20 select-none"
            alt="me"
            width="64"
            height="64"
          />
        </div>
        <CardFooter>
          <div className="hover:bg-popover -mb-1 -ml-1 p-1 border rounded-lg transition-colors">
            {socialItems.map((item, key) => (
              <Link href={item.url} key={key} target="_blank">
                <Button variant="ghost" size="icon" className="*:w-4">
                  {item.icon}
                </Button>
              </Link>
            ))}
          </div>
        </CardFooter>
      </Card>

      <div className="flex flex-col mt-8 max-w-full prose-invert prose prose-zinc">
        <p>
          since 2018, i've been a <b>music producer</b>. ever since i first
          picked up FL Studio, i have spent countless hours in it, working on
          music, sound designing, mixing and mastering my own EDM tracks, some
          of which you can listen to on{" "}
          <a
            href="http://soundcloud.com/elluzion.music"
            target="_blank"
            className="text-orange-400"
          >
            SoundCloud
          </a>
          ,{" "}
          <a
            href="https://open.spotify.com/artist/4OgioomMSaD1ier3lIfgzr"
            target="_blank"
            className="text-green-400"
          >
            Spotify
          </a>{" "}
          or{" "}
          <a
            href="https://youtube.com/@elluzion."
            target="_blank"
            className="text-red-400"
          >
            YouTube
          </a>
          , amassing roughly over 800k streams globally.
          <br />
          <br />
          moreover, i've been working on various (mostly private) software
          projects, such as{" "}
          <a href="https://github.com/project-fluid" target="_blank">
            Project Fluid
          </a>
          , a redesigned AOSP-based custom rom, as well as device-side
          development for the Xiaomi Mi 9 for roughly 2 years. nowadays i really
          like working on the web, using frameworks like next.js (which this
          website is written in) or NUXT in combination with TailwindCSS.
        </p>

        <h4>what else?</h4>
        <p>
          uh, i love cars and tech. driving a '99 mazda mx-5 (miata), i have a
          special interest in both old and new JDM cars, and believe that fun
          and emotion should always play a role in the future of cars, also the
          EVs. nevertheless, i am always looking forward to the future and new
          exciting technologies and opportunities!
        </p>
      </div>
    </main>
  );
}
