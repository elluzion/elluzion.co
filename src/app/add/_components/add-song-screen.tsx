"use client";

import { useState } from "react";
import { AddSongForm } from "../_form/add-song-form";
import AddSongControls from "./add-song-controls";
import { AddSongHeader } from "./add-song-header";

export function AddSongScreen(props: { editing?: string }) {
  const [formIndex, setFormIndex] = useState(0);
  const formIndexMax = 2; // starting from 0, 3 pages

  const [shouldSubmitForm, setShouldSubmitForm] = useState(false);

  return (
    <main className="h-contentDvh">
      {/* HEADER SECTION */}
      <AddSongHeader
        editing={props.editing}
        index={formIndex}
        indexMax={formIndexMax}
      />
      {/* FORM CONTENT */}
      <AddSongForm
        editing={props.editing}
        shouldSubmit={shouldSubmitForm}
        setShouldSubmitCallback={setShouldSubmitForm}
        index={formIndex}
      />
      {/* BOTTOM SECTION */}
      <AddSongControls
        index={formIndex}
        setIndex={setFormIndex}
        maxIndex={formIndexMax}
        setShouldSubmitForm={setShouldSubmitForm}
      />
    </main>
  );
}
