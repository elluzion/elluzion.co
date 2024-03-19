import { Button } from "@/components/button";
import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/form";
import { Input, TextArea } from "@/components/input";
import { useToast } from "@/components/use-toast";
import { fetchSoundcloudSong } from "@/lib/songs/song-fetcher";
import { mdiDragHorizontalVariant, mdiImport } from "@mdi/js";
import Icon from "@mdi/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/select";
import { useDragControls, Reorder } from "framer-motion";
import { XIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { SoundcloudTrackV2 } from "soundcloud.ts";
import { FormPartProps, Artist } from "./types";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";

export default function FormPart1(
  props: FormPartProps & {
    artists: Artist[];
    setArtists: (newList: Artist[]) => void;
    handleSoundcloudImport: (imported: SoundcloudTrackV2) => void;
  }
) {
  const supabase = createClient();
  const { toast } = useToast();

  // artists
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
          if (res.data) {
            // sort by alphabet
            const sorted = res.data.sort((a, b) => {
              return a.name.localeCompare(b.name);
            });
            setExistingArtists(sorted);
          }
        });
    }
  }, [supabase, existingArtists]);

  function ArtistItem(_props: { index: number; artist: Artist }) {
    const dragControls = useDragControls();

    return (
      <Reorder.Item
        value={_props.artist}
        dragListener={false}
        dragControls={dragControls}
        className="flex items-center gap-4 bg-popover py-2 pr-2 pl-4 rounded-lg"
      >
        <div
          className="cursor-grab"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <Icon path={mdiDragHorizontalVariant} size={1} />
        </div>

        <span className="grow">{_props.artist.name}</span>
        <Button
          type="button"
          variant={"ghost"}
          size={"icon"}
          className="text-red-500"
          onClick={(e) => {
            const newArr = [...props.artists];
            newArr.splice(_props.index, 1);
            props.setArtists(newArr);
          }}
        >
          <XIcon />
        </Button>
      </Reorder.Item>
    );
  }

  // song import
  const [showImportSection, setShowImportSection] = useState<boolean>(
    !props.editing
  );
  const songImportRef = useRef<HTMLInputElement | null>(null);

  function handleImportSong() {
    const songUrl = songImportRef.current?.value || "";
    if (!songUrl.startsWith("https://")) {
      return;
    }
    fetchSoundcloudSong(songUrl)
      .then((song) => {
        try {
          props.handleSoundcloudImport(song);
          toast({
            title: "Imported song!",
            description: song.title,
          });
          setShowImportSection(false);
        } catch (e: any) {
          toast({
            title: "Error",
            description: e.toString(),
          });
        }
      })
      .catch(() => {
        toast({
          title: "Song not found!",
          description: songUrl,
        });
      });
  }

  return (
    <div
      className="flex-col gap-4"
      style={{ display: props.index == 0 ? "flex" : "none" }}
    >
      <FormItem style={{ display: showImportSection ? "block" : "none" }}>
        <FormLabel>Import from Soundcloud</FormLabel>
        <div className="flex gap-2">
          <Input
            ref={songImportRef}
            className="bg-popover w-auto grow"
            placeholder="Enter Soundcloud URL"
            type="url"
          />
          <Button
            type="button"
            size={"icon"}
            onClick={(event) => {
              handleImportSong();
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
                maxLength={200}
                className="min-h-12 focus:min-h-28 transition-[min-height] resize-none"
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
              <FormLabel>elluzion.co/</FormLabel>
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
        <Reorder.Group
          axis="y"
          values={props.artists}
          onReorder={props.setArtists}
          className="has-[:first-child]:flex flex-col gap-2 hidden"
        >
          {props.artists.map((artist, key) => (
            <ArtistItem key={key} index={key} artist={artist} />
          ))}
        </Reorder.Group>

        {/* form to add new items */}
        <div className="flex items-start gap-2 h-10">
          <Select
            onValueChange={(newitem) => {
              const idNum = parseInt(newitem);
              setSelectedArtistId(idNum);
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
              props.setArtists(newlist);
            }
          }}
        >
          Add artist
        </Button>
      </div>
    </div>
  );
}
