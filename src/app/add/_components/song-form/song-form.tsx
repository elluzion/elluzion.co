"use client";

//#region Imports
import { Form } from "@/components/form";
import { useToast } from "@/components/use-toast";
import { SupportedServicesType } from "@/lib/songs/song-services";
import { DownloadLink, StreamLink } from "@/lib/songs/types";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { getServices, getSong, hasSong, importFromSoundcloud, pushSong } from "../../actions";
import { useSongFormContext } from "../../context";
import { formSchema } from "../../formSchema";
import SongFormPage1 from "./song-form-page-1";
import SongFormPage2 from "./song-form-page-2";
import SongFormPage3 from "./song-form-page-3";
//#endregion

export function SongForm() {
  const { toast } = useToast();

  const context = useSongFormContext();

  const form = context.form;
  const artists = context.artists.get;
  const setArtists = (artists: string[]) => context.artists.set(artists);
  const streamLinks = context.streamLinks.get;
  const setStreamLinks = (links: StreamLink[]) => context.streamLinks.set(links);
  const setDownloadLinks = (links: DownloadLink[]) => context.downloadLinks.set(links);

  // show loading indicator
  const [isLoading, setIsLoading] = useState(true);

  // ref of invisible form submit button, is triggered from @link AddSongControls on the last page of the form
  const refSubmitButtom = useRef<HTMLButtonElement>(null);

  //#region Events

  // triggering the form submit button when "Next" button has been clicked on page 3
  useEffect(() => {
    if (context.shouldSubmit.current) {
      refSubmitButtom.current?.click();
    }
    context.shouldSubmit.set(false);
  }, [context, context.shouldSubmit]);

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
    hasSong(values.permalink).then((exists) => {
      if (exists && !context.editing.is) {
        toast({
          title: `Song with permalink ${values.permalink} already exists!`,
        });
        return;
      }
      // set as loading
      setIsLoading(true);
      // push
      pushSong(values, context.editing.is)
        .then(() => {
          window.location.href = "/" + values.permalink;
        })
        .catch((e) => {
          // pushing song failed
          setIsLoading(false);
          toast({ title: "Process failed" });
        });
    });
  }

  // not all form values are valid
  function onInvalid(values: object) {
    context.index.set(0); // go back to start
    toast({
      title: "Check your inputs!",
      description: Object.keys(values).join(", "),
    });
  }
  //#endregion

  //#region Editing page
  // if this form acts as song edit page, import the data of said song
  useEffect(() => {
    if (!context.editing.is || !context.editing.permalink) {
      setIsLoading(false);
      return;
    }

    getSong(context.editing.permalink)
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
  //#endregion

  //#region Contents
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
          <SongFormPage1 handleSoundcloudImport={handleSoundcloudImport} />
          <SongFormPage2 />
          <SongFormPage3 handleFetchPlatformLinks={handleFetchServiceLinks} />
          <button hidden={true} ref={refSubmitButtom} type="submit" />
        </form>
      </div>
    </Form>
  );
  //#endregion
}
