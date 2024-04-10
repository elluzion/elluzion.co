import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input, TextArea } from "@/components/input";
import { ArtistSection } from "./_components/artist-section";
import SoundcloudImportSection from "./_components/soundcloud-import-section";
import { useSongFormContext } from "./contexts";

export default function FormPage1(props: {
  artists: string[];
  setArtists: (newList: string[]) => void;
  handleSoundcloudImport: (songUrl: string) => Promise<boolean>;
}) {
  const context = useSongFormContext();

  return (
    <div
      className="flex-col gap-4"
      style={{ display: context.index.current == 0 ? "flex" : "none" }}
    >
      {/* IMPORT SECTION */}
      <SoundcloudImportSection
        show={!context.editing.is}
        handleSoundcloudImport={props.handleSoundcloudImport}
      />
      {/* SONG TITLE */}
      <FormField
        control={context.form.control}
        name="title"
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
      {/* SONG DESCRIPTION */}
      <FormField
        control={context.form.control}
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
      {/* SONG WRITTEN ID */}
      <FormField
        control={context.form.control}
        name="permalink"
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

      {/* ARTIST MANAGEMENT */}
      <ArtistSection artists={props.artists} setArtists={props.setArtists} />
    </div>
  );
}
