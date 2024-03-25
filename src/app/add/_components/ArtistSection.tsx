import { Button } from "@/components/button";
import { Input } from "@/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import { mdiDragHorizontalVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { Reorder, useDragControls } from "framer-motion";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Artist } from "../types";

export function ArtistSection(props: {
  artists: Artist[];
  setArtists: (newList: Artist[]) => void;
}) {
  const customArtistNameRef = useRef<HTMLInputElement | null>(null);

  // artists
  const [selectedArtistId, setSelectedArtistId] = useState(0);
  const [existingArtists, setExistingArtists] = useState<
    Database["public"]["Tables"]["artists"]["Row"][] | undefined
  >(undefined);

  const supabase = createClient();

  function handleAddButtonClick() {
    const customName = customArtistNameRef?.current?.value || "";
    if (selectedArtistId == 0 && customName == "") {
      return;
    } else {
      const newlist = [...props.artists];

      const artistId = customName ? undefined : selectedArtistId;
      const artistName = customName
        ? customName
        : existingArtists?.find((x) => x.id == selectedArtistId)?.name || "";

      newlist.push({
        id: artistId,
        name: artistName,
      });
      props.setArtists(newlist);
    }
  }

  function handleRemoveArtistClicked(index: number) {
    const newArr = [...props.artists];
    newArr.splice(index, 1);
    props.setArtists(newArr);
  }

  // fetch list of existing artists from database
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

  return (
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
          <ArtistItem
            key={key}
            index={key}
            artist={artist}
            handleRemoveClicked={handleRemoveArtistClicked}
          />
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
          ref={customArtistNameRef}
          placeholder="Custom artist name (empty if unused)"
        />
      </div>
      <Button type="button" onClick={handleAddButtonClick}>
        Add artist
      </Button>
    </div>
  );
}

function ArtistItem(props: {
  index: number;
  artist: Artist;
  handleRemoveClicked: (index: number) => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={props.artist}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center gap-4 bg-popover py-2 pr-2 pl-4 rounded-lg"
    >
      <div className="cursor-grab" onPointerDown={(e) => dragControls.start(e)}>
        <Icon path={mdiDragHorizontalVariant} size={1} />
      </div>

      <span className="grow">{props.artist.name}</span>
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
