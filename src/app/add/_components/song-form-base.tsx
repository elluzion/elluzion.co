"use client";

import { useOnChange } from "@/hooks/useOnChange";
import { DownloadLink, StreamLink } from "@/lib/songs/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SongFormContext, SongFormContextType } from "../context";
import { formSchema } from "../formSchema";
import SongFormControls from "./song-form-controls";
import SongFormHeader from "./song-form-header";
import { SongForm } from "./song-form/song-form";

export function SongFormBase(props: { editing?: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [index, setIndex] = useState(0);
  const [shouldSubmitForm, setShouldSubmitForm] = useState(false);

  // form data which is controlled through multiple, more complex components
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

  const contextState: SongFormContextType = {
    form: form,
    editing: {
      is: props.editing ? true : false,
      permalink: props.editing,
    },
    index: {
      current: index,
      max: 2,
      set: setIndex,
    },
    shouldSubmit: {
      current: shouldSubmitForm,
      set: setShouldSubmitForm,
    },
    streamLinks: {
      get: streamLinks,
      set: setStreamLinks,
    },
    downloadLinks: {
      get: downloadLinks,
      set: setDownloadLinks,
    },
    artists: {
      get: artists,
      set: setArtists,
    },
  };

  return (
    <SongFormContext.Provider value={contextState}>
      <main className="h-contentDvh">
        {/* HEADER SECTION */}
        <SongFormHeader />
        {/* FORM CONTENT */}
        <SongForm />
        {/* BOTTOM SECTION */}
        <SongFormControls />
      </main>
    </SongFormContext.Provider>
  );
}
