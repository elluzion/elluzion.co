import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input, TextArea } from "@/components/input";
import { ArtistSection } from "../_components/artist-section";
import SoundcloudImportSection from "../_components/soundcloud-import-section";
import { Artist, FormPageProps } from "../types";

export default function FormPage1(
  props: FormPageProps & {
    artists: Artist[];
    setArtists: (newList: Artist[]) => void;
    handleSoundcloudImport: (songUrl: string) => Promise<boolean>;
  }
) {
  return (
    <div
      className="flex-col gap-4"
      style={{ display: props.index == 0 ? "flex" : "none" }}
    >
      {/* IMPORT SECTION */}
      <SoundcloudImportSection
        show={!props.editing}
        handleSoundcloudImport={props.handleSoundcloudImport}
      />
      {/* SONG TITLE */}
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
      {/* SONG DESCRIPTION */}
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
      {/* SONG WRITTEN ID */}
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

      {/* ARTIST MANAGEMENT */}
      <ArtistSection artists={props.artists} setArtists={props.setArtists} />
    </div>
  );
}
