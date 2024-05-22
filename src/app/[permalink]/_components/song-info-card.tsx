import { Badge } from "@/components/badge";
import { Card, CardContent } from "@/components/card";
import { DBSong } from "@/lib/songs/types";
import { formatDate } from "@/lib/utils";
import React from "react";
import SongDownloadButton from "./song-download-button";

interface SongInfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  song: DBSong;
}

export const SongInfoCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SongInfoCardProps
>(({ className, song, ...props }, ref) => {
  // split downloads into two sections, wav and mp3
  const downloadsMp3 = song.download_links.filter((item) => item.format == "mp3");
  const downloadsWav = song.download_links.filter((item) => item.format == "wav");

  // parse songData for card sub-title line
  const subTitleContent = [];
  if (song.tempo) subTitleContent.push(song.tempo + "BPM");
  if (song.key) subTitleContent.push(song.key);
  if (song.label) subTitleContent.push(song.label);

  return (
    <Card className="md:mx-4 -mt-16 rounded-3xl">
      <CardContent className="flex flex-col gap-4 pt-6">
        {song.description && <p className="font-mono leading-7">{song.description}</p>}
        <span className="font-mono text-muted-foreground">{subTitleContent.join(" • ")}</span>
        <div className="flex gap-2">
          {song.genre && <Badge>{song.genre}</Badge>}
          {song.release_date && <Badge variant={"secondary"}>{formatDate(song.release_date, true)}</Badge>}
          {song.type && <Badge variant={"outline"}>{song.type}</Badge>}
        </div>
        <div className="gap-4 hidden has-[:first-child]:grid grid-flow-col">
          <SongDownloadButton downloadItems={downloadsMp3} />
          <SongDownloadButton downloadItems={downloadsWav} />
        </div>
      </CardContent>
    </Card>
  );
});
SongInfoCard.displayName = "SongInfoCard";
