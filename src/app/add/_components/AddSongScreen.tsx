"use client";

import { useState } from "react";

import { AddSongHeader } from "./AddSongHeader";
import { AddSongForm } from "../_form/AddSongForm";
import AddSongControls from "./AddSongControls";

export function AddSongScreen(props: { editing?: string }) {
  const [formIndex, setFormIndex] = useState(0);
  const formIndexMax = 2; // starting from 0, 3 pages

  const [shouldSubmitForm, setShouldSubmitForm] = useState(false);

  return (
    <div className="flex flex-col gap-4 pt-16 h-[calc(100vh-80px)]">
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
    </div>
  );
}
