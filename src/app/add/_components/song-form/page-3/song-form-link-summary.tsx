import { Button } from "@/components/button";
import { DownloadLink, StreamLink } from "@/lib/songs/types";
import { Reorder } from "framer-motion";
import { XIcon } from "lucide-react";
import { useSongFormContext } from "../../../context";
import { SongFormReorderItem } from "../../song-form-reorder-item";

export default function SongFormLinkSummary() {
  const context = useSongFormContext();

  const streamLinks = context.streamLinks.get;
  const downloadLinks = context.downloadLinks.get;
  const setStreamLinks = (links: StreamLink[]) => context.streamLinks.set(links);
  const setDownloadLinks = (links: DownloadLink[]) => context.downloadLinks.set(links);

  //#region Private functions
  function onStreamLinkRemoveClicked(index: number) {
    const newArr = [...streamLinks];
    newArr.splice(index, 1);
    setStreamLinks(newArr);
  }

  function onDownloadLinkRemoveClicked(index: number) {
    const newArr = [...downloadLinks];
    newArr.splice(index, 1);
    setDownloadLinks(newArr);
  }
  //#endregion

  //#region Contents
  return (
    <div className="flex flex-col">
      <span className="my-4 font-mono text-muted-foreground text-sm">Streaming links</span>
      <Reorder.Group
        axis="y"
        values={streamLinks}
        onReorder={(things: any) => {
          setStreamLinks(things);
        }}
        className="has-[:first-child]:flex flex-col gap-2 hidden"
      >
        {streamLinks.map((link, key) => (
          <SongFormReorderItem
            onRemove={onStreamLinkRemoveClicked}
            index={key}
            key={key}
            value={link}
            title={link.url}
          />
        ))}
      </Reorder.Group>

      {/* DOWNLOADS */}
      <span className="my-4 font-mono text-muted-foreground text-sm">Download links</span>
      <ul className="has-[:first-child]:flex flex-col gap-2 hidden">
        {downloadLinks.map((link, key) => (
          <li className="flex items-center gap-4 bg-popover py-2 pr-2 pl-4 rounded-lg" key={key}>
            <span className="grow">{link.format + " • " + link.edit}</span>
            <Button
              type="button"
              variant={"ghost"}
              size={"icon"}
              className="text-red-500"
              onClick={() => onDownloadLinkRemoveClicked(key)}
            >
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
  //#endregion
}
