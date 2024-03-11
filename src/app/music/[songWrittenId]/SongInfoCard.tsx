import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pascalCase } from "@/lib/utils";
import { Database } from "@/types/supabase";
import Link from "next/link";

interface SongInfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  description: string | null;
  tempo: number | null;
  songKey: string | null;
  label: string | undefined | undefined;
  genre: string | undefined;
  release_date: string | undefined;
  type: string | undefined;
  downloads: Database["public"]["Tables"]["release_downloads"]["Row"][];
}

export const SongInfoCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SongInfoCardProps
>(
  (
    {
      className,
      description,
      tempo,
      songKey,
      label,
      genre,
      release_date,
      type,
      downloads,
      ...props
    },
    ref
  ) => {
    // split downloads into two sections, wav and mp3
    const downloadsMp3 = downloads.filter((item) => item.format == "mp3");
    const downloadsWav = downloads.filter((item) => item.format == "wav");

    // parse songData for card sub-title line
    const subTitleContent = [];
    if (tempo) subTitleContent.push(tempo + "BPM");
    if (songKey) subTitleContent.push(songKey);
    if (label) subTitleContent.push(label);

    return (
      <Card className="md:mx-4 -mt-16 rounded-3xl">
        <CardContent className="flex flex-col gap-4 pt-6">
          <p className="font-mono leading-7">{description}</p>
          <span className="font-mono text-muted-foreground">
            {subTitleContent.join(" • ")}
          </span>
          <div className="flex gap-2">
            {genre && <Badge>{genre}</Badge>}
            {release_date && (
              <Badge variant={"secondary"}>{release_date}</Badge>
            )}
            {type && <Badge variant={"outline"}>{type}</Badge>}
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
                        <Link
                          href={item.download_url}
                          key={key}
                          target="_blank"
                        >
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
                        <Link
                          href={item.download_url}
                          key={key}
                          target="_blank"
                        >
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
  }
);
SongInfoCard.displayName = "Card";
