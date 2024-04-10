"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AddSongForm } from "../add-song-form";
import { SongFormContext, SongFormContextType } from "../contexts";
import { formSchema } from "../formSchema";
import AddSongControls from "./add-song-controls";
import AddSongHeader from "./add-song-header";

export function AddSongScreen(props: { editing: boolean; permalink?: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [index, setIndex] = useState(0);
  const [shouldSubmitForm, setShouldSubmitForm] = useState(false);

  const contextState: SongFormContextType = {
    form: form,
    editing: {
      is: props.editing,
      permalink: props.permalink,
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
  };

  return (
    <SongFormContext.Provider value={contextState}>
      <main className="h-contentDvh">
        {/* HEADER SECTION */}
        <AddSongHeader />
        {/* FORM CONTENT */}
        <AddSongForm />
        {/* BOTTOM SECTION */}
        <AddSongControls />
      </main>
    </SongFormContext.Provider>
  );
}
