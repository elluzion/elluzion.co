import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { Song } from "@/lib/songs/song-parser";
import { pascalCase } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface SongInfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  song: Song;
}

export const SongInfoCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SongInfoCardProps
>(({ className, song, ...props }, ref) => {
  // split downloads into two sections, wav and mp3
  const downloadsMp3 = song.release_downloads.filter(
    (item) => item.format == "mp3"
  );
  const downloadsWav = song.release_downloads.filter(
    (item) => item.format == "wav"
  );

  // parse songData for card sub-title line
  const subTitleContent = [];
  if (song.tempo) subTitleContent.push(song.tempo + "BPM");
  if (song.key) subTitleContent.push(song.key);
  if (song.label) subTitleContent.push(song.label);

  return (
    <Card className="md:mx-4 -mt-16 rounded-3xl">
      <CardContent className="flex flex-col gap-4 pt-6">
        {song.description && (
          <p className="font-mono leading-7">{song.description}</p>
        )}
        <span className="font-mono text-muted-foreground">
          {subTitleContent.join(" • ")}
        </span>
        <div className="flex gap-2">
          {song.genre && <Badge>{song.genre}</Badge>}
          {song.release_date && (
            <Badge variant={"secondary"}>{song.release_date}</Badge>
          )}
          {song.type && <Badge variant={"outline"}>{song.type}</Badge>}
        </div>
        <div className="gap-4 hidden has-[:first-child]:grid grid-flow-col">
          {downloadsMp3.length > 0 && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <Button className="w-full">Download MP3</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {downloadsMp3.map((item, key) => {
                    return (
                      <Link href={item.download_url} key={key} target="_blank">
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
          {downloadsWav.length > 0 && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <Button className="w-full">Download WAV</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {downloadsWav.map((item, key) => {
                    return (
                      <Link href={item.download_url} key={key} target="_blank">
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
  );
});
SongInfoCard.displayName = "SongInfoCard";
