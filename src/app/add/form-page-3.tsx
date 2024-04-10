import { Button } from "@/components/button";
import { DragHandle } from "@/components/drag-handle";
import { Input } from "@/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggle-group";
import { Platforms } from "@/lib/songs/platforms";
import { DBSong, DownloadLink, StreamLink } from "@/lib/songs/types";
import { mdiDragHorizontalVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { Reorder, useDragControls } from "framer-motion";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useSongFormContext } from "./contexts";

export default function FormPage3(props: {
  streamLinks: StreamLink[];
  setStreamLinks: (newList: StreamLink[]) => void;
  downloadLinks: DownloadLink[];
  setDownloadLinks: (newList: DownloadLink[]) => void;
  handleFetchPlatformLinks: (selectedPlatformIds: string[]) => void;
}) {
  const context = useSongFormContext();

  // Streaming links
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const [customPlatformUrl, setCustomPlatformUrl] = useState("");

  // Download links
  const [addDownloadUrl, setAddDownloadUrl] = useState("");
  const [addDownloadFormat, setAddDownloadFormat] =
    useState<AudioFormat>("wav");
  const [addDownloadEdit, setAddDownloadEdit] = useState("");

  function handleFetchPlatforms() {
    props.handleFetchPlatformLinks(selectedPlatforms);
    setSelectedPlatforms([]);
  }

  function handleAddStreamlinkClicked() {
    if (!customPlatformUrl.startsWith("https://")) {
      return;
    } else {
      const newlinks = [
        ...props.streamLinks,
        {
          url: customPlatformUrl,
        },
      ];
      props.setStreamLinks(newlinks);
    }
  }

  function handleAddDownloadClicked() {
    if (!addDownloadUrl.startsWith("https://") || addDownloadEdit == "") {
      return;
    } else {
      const newlinks = [
        ...props.downloadLinks,
        {
          url: addDownloadUrl,
          edit: addDownloadEdit,
          format: addDownloadFormat,
        },
      ];
      props.setDownloadLinks(newlinks);
    }
  }

  function handleStreamLinkRemoveClicked(index: number) {
    const newArr = [...props.streamLinks];
    newArr.splice(index, 1);
    props.setStreamLinks(newArr);
  }

  function handleDownloadLinkRemoveClicked(index: number) {
    const newArr = [...props.downloadLinks];
    newArr.splice(index, 1);
    props.setDownloadLinks(newArr);
  }

  return (
    <div
      className="flex-col"
      style={{ display: context.index.current == 2 ? "flex" : "none" }}
    >
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
                  disabled={
                    props.streamLinks.find(
                      (link) => Platforms.resolve(link.url).id == platform.id
                    )
                      ? true
                      : false
                  }
                >
                  {platform.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button type="button" onClick={handleFetchPlatforms}>
              Fetch links for selected
            </Button>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <span className="font-semibold">Add</span>

            {/* form to add new items */}
            <div className="flex items-start gap-2 h-10">
              <Input
                type={"url"}
                onChange={(e) => setCustomPlatformUrl(e.target.value)}
                placeholder="URL"
              />
            </div>
            <Button type="button" onClick={handleAddStreamlinkClicked}>
              Add streaming link
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="downloads">
          <div className="flex flex-col gap-4">
            <Input
              type={"url"}
              onChange={(e) => setAddDownloadUrl(e.target.value)}
              placeholder="URL"
            />
            <div className="flex items-start gap-2 h-10">
              <Select
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
              <Input
                pattern=".*\S+.*"
                onChange={(e) => setAddDownloadEdit(e.target.value)}
                placeholder="Edit (eg. Extended Mix)"
              />
            </div>
            <Button type="button" onClick={handleAddDownloadClicked}>
              Add download
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center items-center w-full h-8">
        <DragHandle width={64} height={2} />
      </div>

      {/* STREAM LINKS */}
      <span className="my-4 font-mono text-muted-foreground text-sm">
        Streaming links
      </span>
      <Reorder.Group
        axis="y"
        values={props.streamLinks}
        onReorder={props.setStreamLinks}
        className="has-[:first-child]:flex flex-col gap-2 hidden"
      >
        {props.streamLinks.map((link, key) => (
          <StreamLinkReoderItem
            handleRemoveClicked={handleStreamLinkRemoveClicked}
            index={key}
            key={key}
            link={link}
          />
        ))}
      </Reorder.Group>

      {/* DOWNLOADS */}
      <span className="my-4 font-mono text-muted-foreground text-sm">
        Download links
      </span>
      <ul className="has-[:first-child]:flex flex-col gap-2 hidden">
        {props.downloadLinks.map((link, key) => (
          <li
            className="flex items-center gap-4 bg-popover py-2 pr-2 pl-4 rounded-lg"
            key={key}
          >
            <span className="grow">{link.format + " • " + link.edit}</span>
            <Button
              type="button"
              variant={"ghost"}
              size={"icon"}
              className="text-red-500"
              onClick={() => handleDownloadLinkRemoveClicked(key)}
            >
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StreamLinkReoderItem(props: {
  index: number;
  link: StreamLink;
  handleRemoveClicked: (index: number) => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={props.link}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center gap-4 bg-popover py-2 pr-2 pl-4 rounded-lg"
    >
      <div className="cursor-grab" onPointerDown={(e) => dragControls.start(e)}>
        <Icon path={mdiDragHorizontalVariant} size={1} />
      </div>
      {Platforms.resolve(props.link.url).icon}
      <a
        className="font-mono text-sm truncate grow"
        href={props.link.url}
        target="_blank"
      >
        {props.link.url}
      </a>
      <Button
        type="button"
        variant={"ghost"}
        size={"icon"}
        className="text-red-500"
        onClick={() => props.handleRemoveClicked(props.index)}
      >
        <XIcon />
      </Button>
    </Reorder.Item>
  );
}

type AudioFormat = DBSong["download_links"][0]["format"];
