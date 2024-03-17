"use client";

import type { Artist, StreamLink, DownloadLink } from "./types";

import { formSchema } from "./formSchema";

import { Platforms } from "@/lib/songs/platforms";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Input, TextArea } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";

import { XIcon } from "lucide-react";
import Icon from "@mdi/react";
import { mdiImport, mdiPlay } from "@mdi/js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pascalCase } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragHandle } from "@/components/ui/drag-handle";
import { addSong, fetchSoundcloudSongData } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { SoundcloudTrackV2 } from "soundcloud.ts";

export function AddSongForm(props: {
  index: number;
  shouldSubmit: boolean;
  setShouldSubmitCallback: (newState: boolean) => void;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const refSubmitButtom = useRef<HTMLButtonElement>(null);

  const [artists, setArtists] = useState<Array<Artist>>([]);
  const [streamLinks, setStreamLinks] = useState<Array<StreamLink>>([]);
  const [downloadLinks, setDownloadLinks] = useState<Array<DownloadLink>>([]);

  const { toast } = useToast();

  useEffect(() => {
    if (props.shouldSubmit && refSubmitButtom.current) {
      refSubmitButtom.current.click();
    }
    props.setShouldSubmitCallback(false);
  }, [props, props.shouldSubmit]);

  function populateImportData(song: SoundcloudTrackV2) {
    console.log(song);
    form.setValue("songTitle", song.title);
    form.setValue("description", song.description || "");
    form.setValue("writtenId", song.permalink);
    form.setValue("coverUrl", song.artwork_url);
    form.setValue("genre", song.genre);
    form.setValue("label", song.label_name || "");
    form.setValue("releaseDate", new Date(song.release_date));

    const soundcloudStreamLink = [
      {
        name: "Soundcloud",
        platformId: "soundcloud",
        url: song.permalink_url,
      },
    ];
    form.setValue("streamLinks", soundcloudStreamLink);
    setStreamLinks(soundcloudStreamLink);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    addSong(values)
      .catch((e: any) => {
        toast({
          title: "Error",
          description: e.toString(),
        });
      })
      .then(() => router.push("/music"));
  }

  return (
    <Form {...form}>
      <ScrollArea className="h-full">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormPart1
            index={props.index}
            form={form}
            artists={artists}
            setArtists={setArtists}
            populateImportData={populateImportData}
          />
          <FormPart2 index={props.index} form={form} />
          <FormPart3
            index={props.index}
            form={form}
            streamLinks={streamLinks}
            setStreamLinks={setStreamLinks}
            downloadLinks={downloadLinks}
            setDownloadLinks={setDownloadLinks}
          />
          <button hidden={true} ref={refSubmitButtom} type="submit" />
        </form>
      </ScrollArea>
    </Form>
  );
}

type FormPartProps = {
  index: number;
  form: UseFormReturn<any, any, undefined>;
};

function FormPart1(
  props: FormPartProps & {
    artists: Artist[];
    setArtists: (newList: Artist[]) => void;
    populateImportData: (imported: SoundcloudTrackV2) => void;
  }
) {
  const supabase = createClient();
  const { toast } = useToast();

  const songImportRef = useRef<HTMLInputElement | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState(0);
  const [customArtistName, setCustomArtistName] = useState("");

  const [existingArtists, setExistingArtists] = useState<
    Database["public"]["Tables"]["artists"]["Row"][] | undefined
  >(undefined);

  useEffect(() => {
    if (!existingArtists) {
      supabase
        .from("artists")
        .select("*")
        .then((res) => {
          if (res.data) setExistingArtists(res.data);
        });
    }
  }, [supabase, existingArtists]);

  function updateArtists(newList: Artist[]) {
    props.setArtists(newList);
    props.form.setValue("artists", newList);
  }

  function handleImportSong() {
    const songUrl = songImportRef.current?.value || "";
    if (!songUrl.startsWith("https://soundcloud.com/")) {
      return;
    }
    fetchSoundcloudSongData(songUrl)
      .catch(() => {
        toast({
          title: "Song not found!",
          description: songUrl,
        });
      })
      .then((res) => {
        try {
          const song = res as SoundcloudTrackV2;
          props.populateImportData(song);
          toast({
            title: "Imported song!",
            description: song.title,
          });
        } catch (e: any) {
          toast({
            title: "Error",
            description: e.toString(),
          });
        }
      });
  }

  return (
    <div
      className="space-y-4"
      style={{ display: props.index == 0 ? "block" : "none" }}
    >
      <FormItem>
        <FormLabel>Import from Soundcloud</FormLabel>
        <div className="flex gap-2">
          <Input
            ref={songImportRef}
            className="bg-popover w-auto grow"
            placeholder="Enter Soundcloud URL"
            type="url"
          />
          <Button
            size={"icon"}
            onClick={(event) => {
              handleImportSong();
              event.preventDefault();
            }}
          >
            <Icon size={0.75} path={mdiImport} />
          </Button>
        </div>
      </FormItem>

      <FormField
        control={props.form.control}
        name="songTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Song Name</FormLabel>
            <FormControl>
              <Input placeholder="Enemy (Elluzion Remix)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <TextArea
                placeholder="Write something here..."
                {...field}
                rows={3}
                className="min-h-28 resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name="writtenId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Song URL</FormLabel>
            <div className="flex items-center gap-3">
              <FormLabel>elluzion.co/music/</FormLabel>
              <FormControl>
                <Input placeholder="enemy" {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      {/**
       * ARTISTS
       */}
      <div className="flex flex-col gap-4">
        <span className="font-medium text-sm">Artists</span>
        {/* added items list */}
        <ul className="has-[:first-child]:flex flex-col gap-2 hidden">
          {props.artists.map((artist, key) => (
            <li
              className="flex items-center gap-4 bg-popover py-2 pr-2 pl-4 rounded-lg"
              key={key}
            >
              <span className="grow">{artist.name}</span>
              <Button
                type="button"
                variant={"ghost"}
                size={"icon"}
                className="text-red-500"
                onClick={(e) => {
                  const newArr = [...props.artists];
                  newArr.splice(key, 1);
                  updateArtists(newArr);
                  e.preventDefault();
                }}
              >
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
        {/* form to add new items */}
        <div className="flex items-start gap-2 h-10">
          <Select
            onValueChange={(newitem) => {
              setSelectedArtistId(parseInt(newitem));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Artist" />
            </SelectTrigger>
            <SelectContent>
              {existingArtists?.map((artist, key) => (
                <SelectItem key={key} value={artist.id.toString()}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            onChange={(e) => {
              setCustomArtistName(e.target.value);
            }}
            placeholder="Custom artist name (empty if unused)"
          />
        </div>
        <Button
          type="button"
          onClick={(e) => {
            if (selectedArtistId == 0 && customArtistName == "") {
              return;
            } else {
              const newlist = [...props.artists];

              const artistId = customArtistName ? undefined : selectedArtistId;
              const artistName = customArtistName
                ? customArtistName
                : existingArtists?.find((x) => x.id == selectedArtistId)
                    ?.name || "";

              newlist.push({
                id: artistId,
                name: artistName,
              });
              updateArtists(newlist);
              e.preventDefault();
            }
          }}
        >
          Add artist
        </Button>
      </div>
    </div>
  );
}

function FormPart2(props: FormPartProps) {
  return (
    <div
      className="space-y-4"
      style={{ display: props.index == 1 ? "block" : "none" }}
    >
      <FormField
        control={props.form.control}
        name="coverUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Album cover URL (or Soundcloud URL)</FormLabel>
            <FormControl>
              <Input placeholder="https://i1.sndcdn.com/..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <span className="font-medium text-sm">
        <br />
        Additional Info
      </span>
      <div className="gap-4 grid grid-cols-2">
        <FormField
          control={props.form.control}
          name="bpm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BPM</FormLabel>
              <FormControl>
                <Input placeholder="128" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input placeholder="Future Bass" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="releaseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Type</FormLabel>
              <FormControl>
                <Input placeholder="Remix" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input placeholder="E minor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="releaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release date</FormLabel>
              <FormControl>
                <Input
                  type={"date"}
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="Futurized" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function FormPart3(
  props: FormPartProps & {
    streamLinks: StreamLink[];
    setStreamLinks: (newList: StreamLink[]) => void;
    downloadLinks: DownloadLink[];
    setDownloadLinks: (newList: DownloadLink[]) => void;
  }
) {
  // Streaming links
  const [addStreamingLinkUrl, setAddStreamingLinkUrl] = useState("");
  const [selectedPlatformId, setSelectedPlatformId] = useState("");
  const [customPlatformId, setCustomPlatformId] = useState("");

  // Download links
  const [addDownloadUrl, setAddDownloadUrl] = useState("");
  const [addDownloadFormat, setAddDownloadFormat] = useState("");
  const [addDownloadEdit, setAddDownloadEdit] = useState("");

  function updateStreamLinks(newList: StreamLink[]) {
    props.form.setValue("streamLinks", newList);
    props.setStreamLinks(newList);
  }

  function updateDownloadLinks(newList: DownloadLink[]) {
    props.form.setValue("downloadLinks", newList);
    props.setDownloadLinks(newList);
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
          <div className="flex flex-col gap-4">
            <Input
              type={"url"}
              onChange={(e) => {
                setAddStreamingLinkUrl(e.target.value);
              }}
              placeholder="URL"
            />
            {/* form to add new items */}
            <div className="flex items-start gap-2 h-10">
              <Select
                onValueChange={(newitem) => {
                  setSelectedPlatformId(newitem);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  {Platforms.map((platform, key) => (
                    <SelectItem key={key} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                pattern=".*\S+.*"
                onChange={(e) => {
                  setCustomPlatformId(e.target.value);
                }}
                placeholder="Custom platform (empty if unused)"
              />
            </div>
            <Button
              type="button"
              onClick={() => {
                if (
                  !addStreamingLinkUrl.startsWith("https://") ||
                  (selectedPlatformId == "" && customPlatformId == "")
                ) {
                  return;
                } else {
                  const platformId = customPlatformId
                    ? customPlatformId
                    : selectedPlatformId;

                  const newlinks = [
                    ...props.streamLinks,
                    {
                      platformId: platformId,
                      name:
                        Platforms.find((platform) => platform.id == platformId)
                          ?.name || pascalCase(platformId),
                      url: addStreamingLinkUrl,
                    },
                  ];
                  updateStreamLinks(newlinks);
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
              onClick={() => {
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
                  updateDownloadLinks(newlinks);
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
      <ul className="has-[:first-child]:flex flex-col gap-2 hidden">
        {props.streamLinks.map((link, key) => (
          <li
            className="flex items-center gap-4 bg-popover py-2 pr-2 pl-4 rounded-lg"
            key={key}
          >
            {Platforms.find((item) => {
              return item.id == link.platformId;
            })?.icon || <Icon path={mdiPlay} size={1.2} />}
            <span className="grow">{link.name}</span>
            <Button
              type="button"
              variant={"ghost"}
              size={"icon"}
              className="text-red-500"
              onClick={() => {
                const newArr = [...props.streamLinks];
                newArr.splice(key, 1);
                updateStreamLinks(newArr);
              }}
            >
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
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
                updateDownloadLinks(newArr);
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
