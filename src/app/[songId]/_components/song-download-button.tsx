"use client";

import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { DBSong } from "@/lib/songs/types";
import { pascalCase } from "@/lib/utils";

import Link from "next/link";

export default function SongDownloadButton(props: {
  downloadItems: DBSong["release_downloads"];
}) {
  // list empty
  if (props.downloadItems.length == 0) return;

  const format = props.downloadItems[0].format.toUpperCase();

  // only one download entry - dont render dropdown, link directly
  if (props.downloadItems.length == 1) {
    const item = props.downloadItems[0];
    return (
      <Link href={parseDownloadLink(item.download_url)} target="_blank">
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
              <Link
                href={parseDownloadLink(item.download_url)}
                key={key}
                target="_blank"
              >
                <DropdownMenuItem>{pascalCase(item.edit)}</DropdownMenuItem>
              </Link>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const parseDownloadLink = (inputLink: string) => {
  if (inputLink.includes("https://drive.google.com/file/d/")) {
    // The file ID is located between "d/" and the next "/"
    const startOfId = inputLink.indexOf("d/") + 2;
    const endOfId = inputLink.indexOf("/", startOfId);

    // Extract the file ID
    const fileId = inputLink.substring(
      startOfId,
      endOfId != -1 ? endOfId : undefined
    );

    const directLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
    return directLink;
  }
  return inputLink;
};
