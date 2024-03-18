"use client";

import type { Artist, StreamLink, DownloadLink } from "./types";

import { formSchema } from "./formSchema";
import { Form } from "@/components/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useEffect, useRef, useState } from "react";

import { pushSongToDatabase } from "./actions";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@/components/use-toast";
import { SoundcloudTrackV2 } from "soundcloud.ts";
import FormPart1 from "./FormPart1";
import FormPart2 from "./FormPart2";
import FormPart3 from "./FormPart3";
import { createClient } from "@/lib/supabase/client";
import { fetchLinksForPlatforms } from "@/lib/songs/song-fetcher";
import { getSong } from "@/lib/songs/song-parser";

export function AddSongForm(props: {
  editing?: string;
  index: number;
  shouldSubmit: boolean;
  setShouldSubmitCallback: (newState: boolean) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const refSubmitButtom = useRef<HTMLButtonElement>(null);

  const [artists, setArtists] = useState<Array<Artist>>([]);
  const [streamLinks, setStreamLinks] = useState<Array<StreamLink>>([]);
  const [downloadLinks, setDownloadLinks] = useState<Array<DownloadLink>>([]);

  function handleSoundcloudImport(song: SoundcloudTrackV2) {
    const splitTitle = song.title.split("-");
    const formattedTitle =
      splitTitle[splitTitle.length - 1].trim() || song.title;
    form.setValue("songTitle", formattedTitle);
    form.setValue("description", song.description?.split("\n")[0] || "");
    form.setValue("writtenId", song.permalink);
    form.setValue("coverUrl", song.artwork_url);
    form.setValue("genre", song.genre);
    form.setValue("label", song.label_name || "");
    form.setValue(
      "releaseDate",
      new Date(song.release_date || song.display_date)
    );

    const soundcloudLink: StreamLink = {
      platformId: "soundcloud",
      url: song.permalink_url,
    };
    updateStreamLinks([...streamLinks, soundcloudLink]);
  }

  const handleEditImport: () => void = useCallback(() => {
    if (!props.editing) return;
    getSong(props.editing).then((song) => {
      if (!song) {
        redirect("/");
      }

      // page 1
      form.setValue("songTitle", song.title);
      form.setValue("description", song.description || undefined);
      form.setValue("writtenId", song.written_id);
      form.setValue("artists", song.artists);
      setArtists(song.artists);

      // page 2
      form.setValue("coverUrl", song.art_url);
      form.setValue("bpm", song.tempo || undefined);
      form.setValue("genre", song.genre);
      form.setValue("releaseType", song.type);
      form.setValue("key", song.key || undefined);
      form.setValue("releaseDate", new Date(song.release_date));
      form.setValue("label", song.label || undefined);

      // page3
      const parsedStreamLinks: StreamLink[] = song.release_links.map((x) => {
        return {
          platformId: x.platform,
          url: x.url,
        };
      });
      const parsedDownloadLinks: DownloadLink[] = song.release_downloads.map(
        (x) => {
          return {
            format: x.format,
            edit: x.edit,
            url: x.download_url,
          };
        }
      );
      form.setValue("streamLinks", parsedStreamLinks);
      setStreamLinks(parsedStreamLinks);

      form.setValue("downloadLinks", parsedDownloadLinks);
      setDownloadLinks(parsedDownloadLinks);
    });
  }, [props.editing, form]);

  function updateStreamLinks(newList: StreamLink[]) {
    form.setValue("streamLinks", newList);
    setStreamLinks(newList);
  }

  function updateDownloadLinks(newList: DownloadLink[]) {
    form.setValue("downloadLinks", newList);
    setDownloadLinks(newList);
  }

  function updateArtists(newList: Artist[]) {
    setArtists(newList);
    form.setValue("artists", newList);
  }

  function handleFetchPlatformLinks(platformIds: string[]) {
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
    var searchQuery = artists.map((artist) => artist.name).join(", ");
    searchQuery += ` - ${form.getValues("songTitle")}`;

    fetchLinksForPlatforms(searchQuery, platformIds).then((res) => {
      if (!res) return;
      if (res.notFound.length > 0)
        toast({
          title: "Failed searches (tracks not found):",
          description: res.notFound.join(", "),
        });
      if (res.links.length > 0)
        updateStreamLinks([...streamLinks, ...res.links]);
    });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // values are validated

    // abort if writtenID is duplicated
    const supabase = createClient();
    supabase
      .from("releases")
      .select()
      .eq("written_id", values.writtenId)
      .then((res) => {
        if (res.data && res.data.length > 0 && !props.editing) {
          toast({
            title: `Song with ID ${values.writtenId} already exists!`,
          });
          return;
        }

        // wait to re-push in case of editing
        if (props.editing) {
          supabase
            .from("releases")
            .delete()
            .eq("written_id", values.writtenId)
            .then(() => pushSong());
        } else {
          pushSong();
        }
      });

    function pushSong() {
      // push the song up to the DB
      pushSongToDatabase(values)
        .catch((e: any) => {
          toast({
            title: "Adding song failed",
          });
        })
        .then(() => {
          router.refresh();
          router.push("/");
        });
    }
  }

  useEffect(() => {
    if (props.shouldSubmit && refSubmitButtom.current) {
      refSubmitButtom.current.click();
    }
    props.setShouldSubmitCallback(false);
  }, [props, form]);

  useEffect(() => {
    if (props.editing) {
      handleEditImport();
    }
  }, [handleEditImport, props.editing]);

  return (
    <Form {...form}>
      <div className="-ml-4 md:ml-0 p-4 md:p-0 w-screen md:w-full overflow-x-hidden overflow-y-auto grow">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormPart1
            editing={props.editing}
            index={props.index}
            form={form}
            artists={artists}
            setArtists={updateArtists}
            handleSoundcloudImport={handleSoundcloudImport}
          />
          <FormPart2 editing={props.editing} index={props.index} form={form} />
          <FormPart3
            editing={props.editing}
            index={props.index}
            form={form}
            streamLinks={streamLinks}
            setStreamLinks={updateStreamLinks}
            downloadLinks={downloadLinks}
            setDownloadLinks={updateDownloadLinks}
            fetchLinksForPlatforms={handleFetchPlatformLinks}
          />
          <button hidden={true} ref={refSubmitButtom} type="submit" />
        </form>
      </div>
    </Form>
  );
}
