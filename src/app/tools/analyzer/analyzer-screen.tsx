"use client";

import { InfoCard } from "@/components/info-card";
import { Input } from "@/components/input";
import { useToast } from "@/components/use-toast";
import { mdiRefresh, mdiUpload } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getProcessedAudio } from "./_lib/audioUtils";
import type { AudioData } from "./types";

const ALLOWED_FILE_TYPES = ["audio/wav", "audio/flac", "audio/mpeg"];

export default function AnalyzerScreen() {
  /**
   * LOGIC
   */
  // parsed data of the audio file
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  // analyzer worker
  const workerRef = useRef<Worker>();

  /**
   * UI
   */
  // toast for user error reporting
  const { toast } = useToast();
  // element over the file input
  const uploadOverlayRef = useRef<HTMLLabelElement>(null);
  // loading/working indicator
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // load worker
    workerRef.current = new Worker(
      new URL("./_lib/essentiaWorker.js", import.meta.url)
    );
    // analysis response
    workerRef.current.addEventListener("message", (event) => {
      setAudioData(event.data);
      setIsLoading(false);
    });
    // analysis error
    workerRef.current.addEventListener("error", (event) => {
      console.log(event.error);
      setIsLoading(false);
    });
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  function handleSubmit(file: File) {
    // reset audio data
    setAudioData(null);

    const audioContext = new AudioContext();

    // no file selected
    if (!file) return;

    // error: file type invalid
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "File type not allowed!",
        description: `File has to be of type ${ALLOWED_FILE_TYPES.join(", ")}`,
      });
      return;
    }
    // get optimized audio channel for the file and pass it to the worker
    getProcessedAudio(file, audioContext).then((audio) => {
      if (!audio || !workerRef.current) return;
      workerRef.current.postMessage(audio);
      setIsLoading(true);
    });
  }

  function handleInputHoverOn() {
    uploadOverlayRef.current?.classList.add(
      "!ring-2",
      "!ring-ring",
      "!ring-offset-2",
      "!bg-opacity-5"
    );
  }

  function handleInputHoverOff() {
    uploadOverlayRef.current?.classList.remove(
      "!ring-2",
      "!ring-ring",
      "!ring-offset-2",
      "!bg-opacity-5"
    );
  }

  function doubleIfLow(bpm: number) {
    return bpm < 89 ? bpm * 2 : bpm;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* INPUT UI */}
      <div className="h-28">
        <label
          ref={uploadOverlayRef}
          htmlFor="fileUpload"
          className="flex flex-col justify-center items-center gap-4 bg-white bg-opacity-0 p-6 ring-border rounded-lg w-full h-28 text-center transition-all ring-1"
        >
          <div className="flex justify-center items-center gap-2 font-semibold">
            <Icon path={isLoading ? mdiRefresh : mdiUpload} size={1} />
            <span>{isLoading ? "Analyzing" : "Upload file"}</span>
          </div>
          <span className="w-full font-mono text-muted-foreground text-sm truncate">
            {isLoading
              ? "This will take a few seconds"
              : ALLOWED_FILE_TYPES.join(", ")}
          </span>
        </label>
        {/* ACTUAL INPUT - HIDDEN */}
        <Input
          id="fileUpload"
          type="file"
          accept=".mp3,.wav,.flac"
          className="opacity-0 w-full h-28 -translate-y-28 cursor-pointer"
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

      {/* RESULT */}
      {audioData && (
        <table className="border-collapse w-full text-center">
          <tr>
            <th>Tempo</th>
            <th>Key</th>
            <th>Loudness</th>
          </tr>
          <tr>
            <td>{Math.round(doubleIfLow(audioData.tempo))} BPM</td>
            <td>
              {audioData.key} {audioData.scale}
            </td>
            <td>{audioData.loudness.toFixed(1)} LUFS</td>
          </tr>
        </table>
      )}
      <InfoCard>
        This website uses{" "}
        <Link
          href="https://mtg.github.io/essentia.js/"
          target="_blank"
          className="underline underline-offset-4"
        >
          essentia.js
        </Link>{" "}
        and may produce wrong results from time to time.
      </InfoCard>
    </div>
  );
}
