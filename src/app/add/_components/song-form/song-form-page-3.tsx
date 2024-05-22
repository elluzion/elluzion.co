//#region Imports
import { Button } from "@/components/button";
import { DragHandle } from "@/components/drag-handle";
import { Input } from "@/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggle-group";
import { PlatformItem, Platforms } from "@/lib/songs/platforms";
import { AudioFormat, DownloadLink, StreamLink } from "@/lib/songs/types";
import { useRef, useState } from "react";
import { useSongFormContext } from "../../context";
import SongFormLinkSummary from "./page-3/song-form-link-summary";
//#endregion

export default function SongFormPage3(props: {
  handleFetchPlatformLinks: (selectedPlatformIds: string[]) => void;
}) {
  const context = useSongFormContext();

  const streamLinks = context.streamLinks.get;
  const downloadLinks = context.downloadLinks.get;
  const setStreamLinks = (links: StreamLink[]) => context.streamLinks.set(links);
  const setDownloadLinks = (links: DownloadLink[]) => context.downloadLinks.set(links);

  // Streaming links
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const platformUrl = useRef<HTMLInputElement>(null);

  // Download links
  const addDownloadUrl = useRef<HTMLInputElement>(null);
  const addDownloadEdit = useRef<HTMLInputElement>(null);
  const [addDownloadFormat, setAddDownloadFormat] = useState<AudioFormat>("wav");

  //#region Private Functions
  function fetchPlatforms() {
    props.handleFetchPlatformLinks(selectedPlatforms);
    // reset controls
    setSelectedPlatforms([]);
  }

  function platformHasLink(platform: PlatformItem) {
    const link = streamLinks.find((link) => Platforms.resolve(link.url).id == platform.id);
    return link ? true : false;
  }
  //#endregion

  //#region Events
  function onAddStreamlinkClicked() {
    if (!platformUrl.current) return;

    const url = platformUrl.current.value;
    if (!url.startsWith("https://")) {
      return;
    } else {
      const newlinks: StreamLink[] = [
        ...streamLinks,
        {
          url: url,
        },
      ];
      setStreamLinks(newlinks);
    }
  }

  function onAddDownloadClicked() {
    if (!addDownloadUrl.current || !addDownloadEdit.current) return;

    const url = addDownloadUrl.current.value;
    const edit = addDownloadEdit.current.value;

    if (!url.startsWith("https://") || edit == "") {
      return;
    } else {
      const newlinks: DownloadLink[] = [
        ...downloadLinks,
        {
          url: url,
          edit: edit,
          format: addDownloadFormat,
        },
      ];
      setDownloadLinks(newlinks);
    }
  }
  //#endregion

  //#region Contents
  return (
    <div className="flex-col" style={{ display: context.index.current == 2 ? "flex" : "none" }}>
      {/**
       * STREAMING LINKS
       */}
      <Tabs defaultValue="streaming">
        <TabsList className="w-full *:w-full">
          <TabsTrigger value="streaming">Streaming</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>
        <TabsContent value="streaming">
          <div>
            <ToggleGroup
              value={selectedPlatforms}
              onValueChange={setSelectedPlatforms}
              type={"multiple"}
              className="flex-wrap justify-start gap-2 mb-2 w-full"
            >
              {Platforms.LIST.map((platform) => (
                <ToggleGroupItem
                  key={platform.id}
                  value={platform.id}
                  variant={"outline"}
                  disabled={platformHasLink(platform)}
                >
                  {platform.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button type="button" onClick={fetchPlatforms}>
              Fetch links for selected
            </Button>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <span className="font-semibold">Add</span>

            {/* form to add new items */}
            <div className="flex items-start gap-2 h-10">
              <Input ref={platformUrl} type={"url"} placeholder="URL" />
            </div>
            <Button type="button" onClick={onAddStreamlinkClicked}>
              Add streaming link
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="downloads">
          <div className="flex flex-col gap-4">
            <Input ref={addDownloadUrl} type={"url"} placeholder="URL" />
            <div className="flex items-start gap-2 h-10">
              <Select
                value={"wav"}
                onValueChange={(newitem) => {
                  setAddDownloadFormat(newitem as AudioFormat);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wav">WAV</SelectItem>
                  <SelectItem value="mp3">MP3</SelectItem>
                </SelectContent>
              </Select>
              <Input ref={addDownloadEdit} pattern=".*\S+.*" placeholder="Edit (eg. Extended Mix)" />
            </div>
            <Button type="button" onClick={onAddDownloadClicked}>
              Add download
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center items-center w-full h-8">
        <DragHandle width={64} height={2} />
      </div>

      <SongFormLinkSummary />
    </div>
  );
  //#endregion
}
