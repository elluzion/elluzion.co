"use client";

import { Input } from "@/components/input";
import { useToast } from "@/components/use-toast";
import { useOnChange } from "@/hooks/useOnChange";
import { mdiRefresh, mdiUpload } from "@mdi/js";
import Icon from "@mdi/react";
import { useRef, useState } from "react";
import { ALLOWED_FILE_TYPES } from "../analyzer-screen";

export default function FileUploadInput(props: {
  isLoading: boolean;
  loadingProgress: number;
  loadingStatusMessage?: string;
  onFileSubmitted: (file: File) => void;
}) {
  // element over the file input
  const uploadOverlayRef = useRef<HTMLLabelElement>(null);
  const { toast } = useToast();
  const [hideProgress, setHideProgress] = useState(false);

  useOnChange(props.loadingProgress, (prev, next) => {
    if (next == 1) {
      setTimeout(() => {
        setHideProgress(true);
      }, 1000);
    } else {
      setHideProgress(false);
    }
  });

  // type validation when file has been selected
  function handleSubmit(file: File) {
    // file input is empty
    if (!file) return;

    // error: file type invalid
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "File type not allowed!",
        description: `File has to be of type ${ALLOWED_FILE_TYPES.join(", ")}`,
      });
      return;
    }

    // all correct
    props.onFileSubmitted(file);
  }

  function handleInputHoverOn() {
    uploadOverlayRef.current?.classList.add("!ring-2", "!ring-ring", "!ring-offset-2", "!bg-opacity-5");
  }

  function handleInputHoverOff() {
    uploadOverlayRef.current?.classList.remove("!ring-2", "!ring-ring", "!ring-offset-2", "!bg-opacity-5");
  }

  return (
    <div className="h-28">
      {/* PROGRESS INDICATOR */}
      <div className="rounded-lg w-full h-28 overflow-hidden pointer-events-none">
        <div
          className="bg-white h-28 transition-[width,opacity] duration-300 pointer-events-none"
          style={{
            width: props.loadingProgress * 100 + "%",
            opacity: hideProgress ? 0 : 0.05,
          }}
        ></div>
      </div>
      <label
        ref={uploadOverlayRef}
        htmlFor="fileUpload"
        className="flex flex-col justify-center items-center gap-4 bg-white bg-opacity-0 p-6 ring-border rounded-lg w-full h-28 text-center transition-all -translate-y-28 ring-1"
      >
        <div className="flex justify-center items-center gap-2 font-semibold">
          <Icon path={props.isLoading ? mdiRefresh : mdiUpload} size={1} />
          <span>{props.isLoading ? props.loadingStatusMessage || "Analyzing" : "Upload file"}</span>
        </div>
        <span className="w-full font-mono text-muted-foreground text-sm truncate">
          {props.isLoading ? "This will take a few seconds" : ALLOWED_FILE_TYPES.join(", ")}
        </span>
      </label>
      {/* ACTUAL INPUT */}
      <Input
        id="fileUpload"
        type="file"
        accept=".mp3,.wav,.flac"
        className="opacity-0 w-full h-28 -translate-y-56 cursor-pointer"
        onMouseEnter={handleInputHoverOn}
        onMouseLeave={handleInputHoverOff}
        onDragEnter={handleInputHoverOn}
        onDragLeave={handleInputHoverOff}
        onDrop={() => {
          setTimeout(handleInputHoverOff, 500);
        }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleSubmit(e.target.files[0]);
          }
        }}
        required
      />
    </div>
  );
}
