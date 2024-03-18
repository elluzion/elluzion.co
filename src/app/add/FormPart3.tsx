import { Button } from "@/components/button";
import { DragHandle } from "@/components/drag-handle";
import { Input } from "@/components/input";
import { Platforms } from "@/lib/songs/platforms";
import { pascalCase } from "@/lib/utils";
import { mdiPlay } from "@mdi/js";
import Icon from "@mdi/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggle-group";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { DownloadLink, FormPartProps, StreamLink } from "./types";
import { Reorder } from "framer-motion";

export default function FormPart3(
  props: FormPartProps & {
    streamLinks: StreamLink[];
    setStreamLinks: (newList: StreamLink[]) => void;
    downloadLinks: DownloadLink[];
    setDownloadLinks: (newList: DownloadLink[]) => void;
    fetchLinksForPlatforms: (selectedPlatformIds: string[]) => void;
  }
) {
  // Streaming links
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const [customPlatformUrl, setCustomPlatformUrl] = useState("");
  const [customPlatformId, setCustomPlatformId] = useState("");

  // Download links
  const [addDownloadUrl, setAddDownloadUrl] = useState("");
  const [addDownloadFormat, setAddDownloadFormat] = useState("");
  const [addDownloadEdit, setAddDownloadEdit] = useState("");

  const handleFetchPlatforms = () =>
    props.fetchLinksForPlatforms(selectedPlatforms);

  function formatCustomPlatformName(id: string) {
    return id
      .split(" ") // separate into array
      .map((word) => (word = pascalCase(word))) // format each word
      .join(" "); /* combine back together */
  }

  return (
    <div
      className="flex-col"
      style={{ display: props.index == 2 ? "flex" : "none" }}
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
              {Platforms.map((platform) => (
                <ToggleGroupItem
                  key={platform.id}
                  value={platform.id}
                  variant={"outline"}
                  disabled={
                    props.streamLinks.find(
                      (link) => link.platformId == platform.id
                    )
                      ? true
                      : false
                  }
                >
                  {platform.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button
              type="button"
              onClick={(e) => {
                handleFetchPlatforms();
                setSelectedPlatforms([]);
              }}
            >
              Fetch links for selected
            </Button>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <span className="font-semibold">Add custom</span>

            {/* form to add new items */}
            <div className="flex items-start gap-2 h-10">
              <Input
                type={"url"}
                onChange={(e) => {
                  setCustomPlatformUrl(e.target.value);
                }}
                placeholder="URL"
              />
              <Input
                pattern=".*\S+.*"
                className="w-min"
                onChange={(e) => {
                  setCustomPlatformId(
                    e.target.value.toLowerCase().replaceAll(/\s/g, "")
                  );
                }}
                placeholder="Custom platform name"
              />
            </div>
            <Button
              type="button"
              onClick={(e) => {
                if (
                  !customPlatformUrl.startsWith("https://") ||
                  customPlatformId == ""
                ) {
                  return;
                } else {
                  const newlinks = [
                    ...props.streamLinks,
                    {
                      platformId: customPlatformId,
                      name: formatCustomPlatformName(customPlatformId),
                      url: customPlatformUrl,
                    },
                  ];
                  props.setStreamLinks(newlinks);
                }
              }}
            >
              Add streaming link
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="downloads">
          <div className="flex flex-col gap-4">
            <Input
              type={"url"}
              onChange={(e) => {
                setAddDownloadUrl(e.target.value);
              }}
              placeholder="URL"
            />
            <div className="flex items-start gap-2 h-10">
              <Select
                onValueChange={(newitem) => {
                  setAddDownloadFormat(newitem);
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
                onChange={(e) => {
                  setAddDownloadEdit(e.target.value);
                }}
                placeholder="Edit (eg. Extended Mix)"
              />
            </div>
            <Button
              type="button"
              onClick={(e) => {
                if (
                  !addDownloadUrl.startsWith("https://") ||
                  addDownloadFormat == "" ||
                  addDownloadEdit == ""
                ) {
                  return;
                } else {
                  const newlinks = [
                    ...props.downloadLinks,
                    {
                      format: addDownloadFormat,
                      edit: addDownloadEdit,
                      url: addDownloadUrl,
                    },
                  ];
                  props.setDownloadLinks(newlinks);
                }
              }}
            >
              Add download
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center items-center w-full h-8">
        <DragHandle width={64} height={2} />
      </div>

      {/* LINK SECTION */}
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
          <Reorder.Item
            value={link}
            className="flex items-center gap-4 bg-popover py-2 pr-2 pl-4 rounded-lg"
            key={key}
          >
            {Platforms.find((item) => {
              return item.id == link.platformId;
            })?.icon || <Icon path={mdiPlay} size={1.2} />}
            <a
              className="font-mono text-sm truncate grow"
              href={link.url}
              target="_blank"
            >
              {link.url}
            </a>
            <Button
              type="button"
              variant={"ghost"}
              size={"icon"}
              className="text-red-500"
              onClick={() => {
                const newArr = [...props.streamLinks];
                newArr.splice(key, 1);
                props.setStreamLinks(newArr);
              }}
            >
              <XIcon />
            </Button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
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
              onClick={() => {
                const newArr = [...props.downloadLinks];
                newArr.splice(key, 1);
                props.setDownloadLinks(newArr);
              }}
            >
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
