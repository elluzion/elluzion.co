"use client";

import { Form } from "@/components/form";
import { useToast } from "@/components/use-toast";
import { useOnChange } from "@/hooks/useOnChange";
import SongDatabase from "@/lib/songs/song-database";
import { SupportedServicesType } from "@/lib/songs/song-services";
import { DownloadLink, StreamLink } from "@/lib/songs/types";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { getServices, importFromSoundcloud } from "./actions";
import { useSongFormContext } from "./contexts";
import FormPage1 from "./form-page-1";
import FormPage2 from "./form-page-2";
import FormPage3 from "./form-page-3";
import { formSchema } from "./formSchema";

export function AddSongForm() {
  const { toast } = useToast();

  const supabase = createClient();
  const db = new SongDatabase(supabase);
  const context = useSongFormContext();
  const form = context.form;

  // show loading indicator
  const [isLoading, setIsLoading] = useState(true);

  // ref of invisible form submit button, is triggered from @link AddSongControls on the last page of the form
  const refSubmitButtom = useRef<HTMLButtonElement>(null);

  // STATES (needed as these values are interactive in the UI (reordering)), get synced with the form
  const [artists, setArtists] = useState<string[]>([]);
  const [streamLinks, setStreamLinks] = useState<StreamLink[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);

  // update form on state change
  useOnChange(artists, () => {
    form.setValue("artists", artists);
  });
  useOnChange(streamLinks, () => {
    form.setValue("stream_links", streamLinks);
  });
  useOnChange(downloadLinks, () => {
    form.setValue("download_links", downloadLinks);
  });

  /**
   * Function to be executed once the song has been fetched from soundcloud,
   * filling out the form's matching values
   *
   * @param songUrl Soundcloud URL
   * @returns boolean, whether import went successful
   */
  async function handleSoundcloudImport(songUrl: string): Promise<boolean> {
    setIsLoading(true);
    const song = await importFromSoundcloud(songUrl);

    if (!song) {
      setIsLoading(false);
      return false;
    }

    // fill out form
    if (song.artists) {
      setArtists(song.artists);
    }
    form.setValue("title", song.title);
    form.setValue("description", song.description || "");
    form.setValue("permalink", song.permalink);
    form.setValue("release_date", song.release_date);
    form.setValue("label", song.label || "");
    form.setValue("art_url", song.art_url);
    form.setValue("genre", song.genre);

    // add soundcloud link to streamlinks
    const soundcloudLink: StreamLink = {
      url: songUrl,
    };
    setStreamLinks([...streamLinks, soundcloudLink]);

    // all done
    toast({
      title: "Imported song!",
      description: song.title,
    });
    setIsLoading(false);
    return true;
  }

  function handleFetchServiceLinks(platforms: string[]) {
    if (!(platforms as SupportedServicesType[])) {
      toast({
        title: "Invalid service link list!",
      });
      return;
    }
    if (artists.length == 0) {
      toast({
        title: "No artists set!",
        description: "Needed to continue",
      });
      return;
    }
    if (form.getValues("title") == "") {
      toast({
        title: "No song title set!",
        description: "Needed to continue",
      });
      return;
    }

    // build query for request
    let query = artists.join(", ");
    query += " - ";
    query += form.getValues("title");

    getServices(query, platforms as SupportedServicesType[]).then((res) => {
      if (!res) return;
      if (res.failed.length > 0)
        toast({
          title: "Failed searches (tracks not found):",
          description: res.failed.join(", "),
        });
      if (res.links.length > 0) setStreamLinks([...streamLinks, ...res.links]);
    });
  }

  // gets triggered when the form data has been validated
  function onSubmit(values: z.infer<typeof formSchema>) {
    // check if track with ID already exists, abort if it does when submitting a new entry
    db.hasSong(values.permalink).then((exists) => {
      if (exists && !context.editing.is) {
        toast({
          title: `Song with permalink ${values.permalink} already exists!`,
        });
        return;
      }
      pushSong();
    });
    function pushSong() {
      setIsLoading(true);
      // push the song up to the DB
      db.pushSong(values, context.editing.is)
        .then(() => {
          window.location.href = "/" + values.permalink;
        })
        .catch((e) => {
          setIsLoading(false);
          toast({ title: "Process failed" });
        });
    }
  }

  // not all form values are valid
  function onInvalid(values: object) {
    context.index.set(0); // go back to start
    toast({
      title: "Check your inputs!",
      description: Object.keys(values).join(", "),
    });
  }

  // triggering the form submit button when "Next" button has been clicked on page 3
  useEffect(() => {
    if (context.shouldSubmit.current) {
      refSubmitButtom.current?.click();
    }
    context.shouldSubmit.set(false);
  }, [context, context.shouldSubmit]);

  // if this form acts as song edit page, import the data of said song
  useEffect(() => {
    if (!context.editing.is || !context.editing.permalink) {
      setIsLoading(false);
      return;
    }

    // TODO: IMPORT STUFF
    db.getSong(context.editing.permalink)
      .then((song) => {
        if (!song) {
          redirect("/");
        }

        // fill out form
        setArtists(song.artists);
        setStreamLinks([...song.stream_links]);
        setDownloadLinks([...song.download_links]);

        form.setValue("id", song.id);
        form.setValue("title", song.title);
        form.setValue("description", song.description || "");
        form.setValue("permalink", song.permalink);
        form.setValue("release_date", song.release_date);
        form.setValue("label", song.label || "");
        form.setValue("art_url", song.art_url);
        form.setValue("genre", song.genre);
        form.setValue("tempo", song.tempo);
        form.setValue("type", song.type);
        form.setValue("key", song.key || "");
      })
      .finally(() => {
        setIsLoading(false);
      });
    // DON'T ADD OTHERS, OTHERWISE THIS WILL FIRE EVERY TIME THE FORM CHANGES
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.editing.is, context.editing.permalink]);

  return (
    <Form {...form}>
      <div
        className="-ml-4 md:ml-0 px-4 md:p-0 w-screen md:w-full transition-[filter] duration-300 overflow-x-hidden overflow-y-auto grow"
        style={{
          userSelect: isLoading ? "none" : "auto",
          pointerEvents: isLoading ? "none" : "all",
          opacity: isLoading ? 0.5 : 1,
          filter: isLoading ? "blur(4px)" : "blur(0px)",
        }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <FormPage1
            artists={artists}
            setArtists={setArtists}
            handleSoundcloudImport={handleSoundcloudImport}
          />
          <FormPage2 />
          <FormPage3
            streamLinks={streamLinks}
            setStreamLinks={setStreamLinks}
            downloadLinks={downloadLinks}
            setDownloadLinks={setDownloadLinks}
            handleFetchPlatformLinks={handleFetchServiceLinks}
          />
          <button hidden={true} ref={refSubmitButtom} type="submit" />
        </form>
      </div>
    </Form>
  );
}
