"use client";

import type { Artist, StreamLink, DownloadLink } from "./types";

import { formSchema } from "./formSchema";
import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";

import { pushSongToDatabase } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { SoundcloudTrackV2 } from "soundcloud.ts";
import FormPart1 from "./FormPart1";
import FormPart2 from "./FormPart2";
import FormPart3 from "./FormPart3";
import { createClient } from "@/lib/supabase/client";
import { fetchLinksForPlatforms } from "@/lib/songs/song-fetcher";

export function AddSongForm(props: {
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

  useEffect(() => {
    if (props.shouldSubmit && refSubmitButtom.current) {
      refSubmitButtom.current.click();
    }
    props.setShouldSubmitCallback(false);
  }, [props, props.shouldSubmit]);

  function populateImportData(song: SoundcloudTrackV2) {
    const splitTitle = song.title.split("-");
    const formattedTitle =
      splitTitle[splitTitle.length - 1].trim() || song.title;
    form.setValue("songTitle", formattedTitle);
    form.setValue("description", song.description?.split("\n")[0] || "");
    form.setValue("writtenId", song.permalink);
    form.setValue("coverUrl", song.artwork_url);
    form.setValue("genre", song.genre);
    form.setValue("label", song.label_name || "");
    form.setValue("releaseDate", new Date(song.release_date));

    const soundcloudLink: StreamLink = {
      name: "Soundcloud",
      platformId: "soundcloud",
      url: song.permalink_url,
    };
    updateStreamLinks([...streamLinks, soundcloudLink]);
  }

  function updateStreamLinks(newList: StreamLink[]) {
    form.setValue("streamLinks", newList);
    setStreamLinks(newList);
  }

  function updateDownloadLinks(newList: DownloadLink[]) {
    form.setValue("downloadLinks", newList);
    setDownloadLinks(newList);
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
        if (res.data && res.data.length > 0) {
          toast({
            title: `Song with ID ${values.writtenId} already exists!`,
          });
          return;
        }
      });

    // push the song up to the DB
    pushSongToDatabase(values)
      .catch((e: any) => {
        toast({
          title: "Error",
          description: e.toString(),
        });
      })
      .then(() => router.push("/music"));
  }

  return (
    <Form {...form}>
      <div className="-ml-4 md:ml-0 p-4 md:p-0 w-screen md:w-full overflow-x-hidden overflow-y-auto grow">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormPart1
            index={props.index}
            form={form}
            artists={artists}
            setArtists={setArtists}
            populateImportData={populateImportData}
          />
          <FormPart2 index={props.index} form={form} />
          <FormPart3
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
