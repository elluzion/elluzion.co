import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { getSong } from "@/lib/songs/song-parser";

import Image from "next/image";
import Link from "next/link";

import { PlatformButton } from "./PlatformButton";
import { DragHandle } from "@/components/ui/drag-handle";

export default async function SongPage({
  params,
}: {
  params: { songWrittenId: string };
}) {
  const writtenSongId = params.songWrittenId;

  const songInfo = await getSong(writtenSongId);

  const downloadsMp3 = songInfo?.downloads.filter(
    (item) => item.format == "mp3"
  );
  const downloadsWav = songInfo?.downloads.filter(
    (item) => item.format == "wav"
  );

  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <div className="relative -left-4 md:left-0 rounded-t-3xl w-screen md:w-full h-[400px] overflow-clip mix-blend-lighten">
        <Image
          alt="cover"
          src={songInfo?.art_url || ""}
          className="blur-3xl w-full h-[400px]"
          width={256}
          height={256}
        />
        <div className="bg-gradient-to-b from-transparent to-background w-full h-[400px] -translate-y-[400px]" />
        <div className="flex flex-col justify-center items-center gap-2 p-8 w-full h-[336px] -translate-y-[800px]">
          <h1 className="font-semibold text-4xl">{songInfo?.title}</h1>
          <span className="text-muted-foreground">
            {songInfo?.artists.map((artist) => artist.artists?.name).join(", ")}
          </span>
        </div>
      </div>
      {/* INFO CARD */}
      <Card className="md:mx-4 -mt-16 rounded-3xl">
        <CardContent className="flex flex-col gap-4 pt-6">
          <p className="font-mono">{songInfo?.description}</p>
          <span className="font-mono text-muted-foreground">
            {songInfo?.tempo}BPM • {songInfo?.key} • {songInfo?.label?.name}
          </span>
          <div className="flex gap-2">
            <Badge>{songInfo?.genre?.name}</Badge>
            <Badge variant={"secondary"}>{songInfo?.release_date}</Badge>
            <Badge variant={"outline"}>{songInfo?.type?.title}</Badge>
          </div>
          <div className="gap-4 hidden has-[:first-child]:grid grid-flow-col">
            {downloadsMp3 != null && downloadsMp3.length > 0 && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full">
                    <Button className="w-full">Download MP3</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {downloadsMp3?.map((item, key) => {
                      return (
                        <Link href={item.url} key={key} target="_blank">
                          <DropdownMenuItem>
                            {pascalCase(item.edit)}
                          </DropdownMenuItem>
                        </Link>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            {downloadsWav != null && downloadsWav.length > 0 && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full">
                    <Button className="w-full">Download WAV</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {downloadsWav?.map((item, key) => {
                      return (
                        <Link href={item.url} key={key} target="_blank">
                          <DropdownMenuItem>
                            {pascalCase(item.edit)}
                          </DropdownMenuItem>
                        </Link>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* LINK SECTION */}
      <div className="flex justify-center items-center w-full h-8">
        <DragHandle width={64} height={2} />
      </div>
      <div>
        {songInfo?.links != null && songInfo.links.length > 0 && (
          <div className="flex flex-col gap-2">
            {songInfo?.links.map((link, key) => (
              <Link key={key} href={link.url} target="_blank">
                <PlatformButton platform={link.platform} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const pascalCase = (input: string) => input[0].toUpperCase() + input.slice(1);
