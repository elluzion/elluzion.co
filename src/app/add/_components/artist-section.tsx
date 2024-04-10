import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { mdiDragHorizontalVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { Reorder, useDragControls } from "framer-motion";
import { XIcon } from "lucide-react";
import { useState } from "react";

export function ArtistSection(props: {
  artists: string[];
  setArtists: (newList: string[]) => void;
}) {
  const [newArtistName, setNewArtistName] = useState("");

  function handleAddButtonClick() {
    const newlist = [...props.artists];

    if (newArtistName != "") {
      newlist.push(newArtistName);
      props.setArtists(newlist);
    }
  }

  function handleRemoveArtistClicked(index: number) {
    const newArr = [...props.artists];
    newArr.splice(index, 1);
    props.setArtists(newArr);
  }

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
        <Input
          onChange={(e) => {
            setNewArtistName(e.target.value);
          }}
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
  artist: string;
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

      <span className="grow">{props.artist}</span>
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
