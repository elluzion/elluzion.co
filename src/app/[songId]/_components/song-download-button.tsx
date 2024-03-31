"use client";

import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { Song } from "@/lib/songs/song-parser";
import { pascalCase } from "@/lib/utils";

import Link from "next/link";

export default function SongDownloadButton(props: {
  downloadItems: Song["release_downloads"];
}) {
  // list empty
  if (props.downloadItems.length == 0) return;

  const format = props.downloadItems[0].format.toUpperCase();

  // only one download entry - dont render dropdown, link directly
  if (props.downloadItems.length == 1) {
    const item = props.downloadItems[0];
    return (
      <Link href={item.download_url} target="_blank">
        <Button className="w-full">Download {format}</Button>
      </Link>
    );
  }
  // multiple entries
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <Button className="w-full">Download {format}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {props.downloadItems.map((item, key) => {
            return (
              <Link href={item.download_url} key={key} target="_blank">
                <DropdownMenuItem>{pascalCase(item.edit)}</DropdownMenuItem>
              </Link>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
