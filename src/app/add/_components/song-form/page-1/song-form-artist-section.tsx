import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Reorder } from "framer-motion";
import { useRef } from "react";
import { useSongFormContext } from "../../../context";
import { SongFormReorderItem } from "../../song-form-reorder-item";

export default function SongFormArtistSection() {
  const artistNameInput = useRef<HTMLInputElement>(null);

  const context = useSongFormContext();

  const artists = context.artists.get;
  const setArtists = (artists: string[]) => context.artists.set(artists);

  function onAddButtonClick() {
    if (!artistNameInput.current) return;

    const newlist = [...artists];
    const name = artistNameInput.current.value;

    if (name != "") {
      newlist.push(name);
      setArtists(newlist);
    }
  }

  function onRemoveArtistClicked(index: number) {
    const newArr = [...artists];
    newArr.splice(index, 1);
    setArtists(newArr);
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="font-medium text-sm">Artists</span>
      {/* added items list */}
      <Reorder.Group
        axis="y"
        values={artists}
        onReorder={setArtists}
        className="has-[:first-child]:flex flex-col gap-2 hidden"
      >
        {artists.map((artist, key) => (
          <SongFormReorderItem
            key={key}
            index={key}
            value={artist}
            title={artist}
            onRemove={onRemoveArtistClicked}
          />
        ))}
      </Reorder.Group>

      {/* form to add new items */}
      <div className="flex items-start gap-2 h-10">
        <Input ref={artistNameInput} placeholder="Artist name" />
      </div>
      <Button type="button" onClick={onAddButtonClick}>
        Add artist
      </Button>
    </div>
  );
}
