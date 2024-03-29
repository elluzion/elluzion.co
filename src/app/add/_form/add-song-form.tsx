"use client";

import { Form } from "@/components/form";
import { useToast } from "@/components/use-toast";
import { useOnChange } from "@/hooks/useOnChange";
import {
  fetchLinksForPlatforms,
  fetchSoundcloudSong,
} from "@/lib/songs/song-fetcher";
import { getSong, trackExists } from "@/lib/songs/song-parser";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { pushSongToDatabase } from "../actions";
import { formSchema } from "../formSchema";
import type { Artist, DownloadLink, StreamLink } from "../types";
import FormPage1 from "./form-page-1";
import FormPage2 from "./form-page-2";
import FormPage3 from "./form-page-3";

export function AddSongForm(props: {
  editing?: string;
  index: number;
  shouldSubmit: boolean;
  setShouldSubmitCallback: (newState: boolean) => void;
}) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // ref of invisible form submit button, is triggered from @link AddSongControls on the last page of the form
  const refSubmitButtom = useRef<HTMLButtonElement>(null);

  // STATES
  const [artists, setArtists] = useState<Array<Artist>>([]);
  const [streamLinks, setStreamLinks] = useState<Array<StreamLink>>([]);
  const [downloadLinks, setDownloadLinks] = useState<Array<DownloadLink>>([]);

  // update form on state change
  useOnChange(artists, () => form.setValue("artists", artists));
  useOnChange(streamLinks, () => form.setValue("streamLinks", streamLinks));
  useOnChange(downloadLinks, () =>
    form.setValue("downloadLinks", downloadLinks)
  );

  /* store written ID at the beginning of editing in case it gets changed,
    so the old entry gets removed properly when commiting the edit */
  const [preEditWrittenId, setPreEditWrittenId] = useState<string>("");

  /**
   * Function to be executed once the song has been fetched from soundcloud,
   * filling out the form's matching values
   *
   * @param songUrl Soundcloud URL
   * @returns boolean, whether import went successful
   */
  async function handleSoundcloudImport(songUrl: string): Promise<boolean> {
    let song = null;
    try {
      song = await fetchSoundcloudSong(songUrl);
    } catch (e) {
      // on error
      toast({
        title: "Error importing song",
        description: "Track doesn't exist at URL.",
      });
      return false;
    }

    // format data
    const splitTitle = song.title.split("-");
    const formattedTitle =
      splitTitle[splitTitle.length - 1].trim() || song.title;
    const releaseDate = new Date(song.release_date || song.display_date);

    // fill out form
    form.setValue("songTitle", formattedTitle);
    form.setValue("description", song.description?.split("\n")[0] || "");
    form.setValue("writtenId", song.permalink);
    form.setValue("coverUrl", song.artwork_url);
    form.setValue("genre", song.genre);
    form.setValue("label", song.label_name || "");
    form.setValue("releaseDate", releaseDate);

    // add soundcloud link to streamlinks
    const soundcloudLink: StreamLink = {
      platformId: "soundcloud",
      url: song.permalink_url,
    };
    setStreamLinks([...streamLinks, soundcloudLink]);

    // all done
    toast({
      title: "Imported song!",
      description: song.title,
    });
    return true;
  }

  function handleFetchPlatformLinks(platformIds: string[]) {
    /* to search for links on other platforms, we need a reliable search query.
      In this case, this query exists of the artist names and the track name.
      In case one of them is empty, abort the fetch
    */
    if (artists.length == 0) {
      toast({
        title: "No artists set!",
        description: "Needed to continue",
      });
      return;
    }
    if (form.getValues("songTitle") == "") {
      toast({
        title: "No song title set!",
        description: "Needed to continue",
      });
      return;
    }

    // fetch the platforms
    fetchLinksForPlatforms(
      artists,
      form.getValues("songTitle"),
      platformIds
    ).then((res) => {
      if (!res) return;
      if (res.notFound.length > 0)
        toast({
          title: "Failed searches (tracks not found):",
          description: res.notFound.join(", "),
        });
      if (res.links.length > 0) setStreamLinks([...streamLinks, ...res.links]);
    });
  }

  // gets triggered when the form data has been validated
  function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();

    // check if track with ID already exists, abort if it does when submitting a new entry
    trackExists(values.writtenId).then((exists) => {
      if (exists && !props.editing) {
        toast({
          title: `Song with ID ${values.writtenId} already exists!`,
        });
        return;
      }

      // if editing, remove existing entry and push new one
      if (props.editing) {
        supabase
          .from("releases")
          .delete()
          .eq("written_id", preEditWrittenId)
          .then(() => pushSong());
      } else {
        pushSong();
      }
    });

    function pushSong() {
      // push the song up to the DB
      pushSongToDatabase(values)
        .then(() => {
          window.location.href = "/" + values.writtenId;
        })
        .catch((e) => {
          toast({ title: "Process failed" });

          if (!props.editing) {
            // remove again when something bad happens
            supabase
              .from("releases")
              .delete()
              .eq("written_id", values.writtenId);
          }
        });
    }
  }

  // triggering the form submit button when "Next" button has been clicked on page 3
  useEffect(() => {
    if (props.shouldSubmit && refSubmitButtom.current) {
      refSubmitButtom.current.click();
    }
    props.setShouldSubmitCallback(false);
  }, [props, form]);

  // if this form acts as song edit page, import the data of said song
  useEffect(() => {
    if (!props.editing) return;
    getSong(props.editing).then((song) => {
      if (!song) {
        redirect("/");
      }

      // page 1
      setArtists(song.artists);
      setPreEditWrittenId(song.written_id);
      form.setValue("songTitle", song.title);
      form.setValue("description", song.description || undefined);
      form.setValue("writtenId", song.written_id);

      // page 2
      form.setValue("coverUrl", song.art_url);
      form.setValue("bpm", song.tempo || undefined);
      form.setValue("genre", song.genre);
      form.setValue("releaseType", song.type);
      form.setValue("key", song.key || undefined);
      form.setValue("releaseDate", new Date(song.release_date));
      form.setValue("label", song.label || undefined);

      // page3
      const parsedStreamLinks: StreamLink[] = song.release_links.map((link) => {
        return {
          platformId: link.platform,
          url: link.url,
        };
      });
      const parsedDownloadLinks: DownloadLink[] = song.release_downloads.map(
        (link) => {
          return {
            format: link.format,
            edit: link.edit,
            url: link.download_url,
          };
        }
      );
      setStreamLinks(parsedStreamLinks);
      setDownloadLinks(parsedDownloadLinks);
    });
  }, [form, props.editing]);

  return (
    <Form {...form}>
      <div className="-ml-4 md:ml-0 px-4 md:p-0 w-screen md:w-full overflow-x-hidden overflow-y-auto grow">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormPage1
            editing={props.editing}
            index={props.index}
            form={form}
            artists={artists}
            setArtists={setArtists}
            handleSoundcloudImport={handleSoundcloudImport}
          />
          <FormPage2 editing={props.editing} index={props.index} form={form} />
          <FormPage3
            editing={props.editing}
            index={props.index}
            form={form}
            streamLinks={streamLinks}
            setStreamLinks={setStreamLinks}
            downloadLinks={downloadLinks}
            setDownloadLinks={setDownloadLinks}
            handleFetchPlatformLinks={handleFetchPlatformLinks}
          />
          <button hidden={true} ref={refSubmitButtom} type="submit" />
        </form>
      </div>
    </Form>
  );
}
