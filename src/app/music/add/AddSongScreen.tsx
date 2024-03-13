"use client";

import { Button } from "@/components/ui/button";
import { AddSongHeaderSection } from "./AddSongHeaderContent";
import { useRef, useState } from "react";
import { AddSongForm } from "./AddSongForm";

export function AddSongScreen() {
  const [formPageIndex, setFormPageIndex] = useState(0);
  const formPageIndexMax = 2; // starting from 0, 3 pages

  const [shouldSubmitForm, setShouldSubmitForm] = useState(false);

  const backButton = useRef(null);
  const nextButton = useRef(null);

  return (
    <div className="flex flex-col gap-4 pt-16 h-[calc(100vh-80px)]">
      {/* HEADER SECTION */}
      <AddSongHeaderSection index={formPageIndex} indexMax={formPageIndexMax} />
      {/* FORM CONTENT */}
      <AddSongForm
        shouldSubmit={shouldSubmitForm}
        setShouldSubmitCallback={setShouldSubmitForm}
        index={formPageIndex}
      />
      {/* BOTTOM SECTION */}
      <div className="flex *:grow gap-2">
        {formPageIndex > 0 && (
          <Button
            ref={backButton}
            variant={"secondary"}
            onClick={() => {
              setFormPageIndex(formPageIndex - 1);
            }}
          >
            Back
          </Button>
        )}
        <Button
          ref={nextButton}
          variant={"default"}
          onClick={() => {
            if (formPageIndex != formPageIndexMax) {
              setFormPageIndex(formPageIndex + 1);
            } else {
              // try submitting the form
              setShouldSubmitForm(true);
            }
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
