"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useToast } from "@/components/use-toast";
import { mdiInformation } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { getProcessedAudio } from "./_lib/audioUtils";
import type { AudioData } from "./types";

const ALLOWED_FILE_TYPES = ["audio/wav", "audio/flac", "audio/mpeg"];

export default function AnalyzerScreen() {
  // audio file to be selected through the input
  const [file, setFile] = useState<File | null>(null);
  // parsed data of the audio file
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  // loading/working indicator
  const [isLoading, setIsLoading] = useState(false);

  // analyzer worker
  const workerRef = useRef<Worker>();

  // UI toast for user error reporting
  const { toast } = useToast();

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

  function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // dont actually submit form

    // reset audio data
    setAudioData(null);

    const audioContext = new AudioContext();

    // no file selected
    if (!file) return;
    // error: file type invalid
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "File type not allowed!",
        description: `${file.type}, has to be ${ALLOWED_FILE_TYPES.join(", ")}`,
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

  function doubleIfLow(bpm: number) {
    return bpm < 89 ? bpm * 2 : bpm;
  }

  return (
    <div className="flex flex-col gap-8">
      <form className="mb-4" onSubmit={handleOnSubmit}>
        <div className="flex items-center gap-4 mb-4">
          <span className="font-medium">Upload:</span>
          <Input
            type="file"
            accept=""
            className="w-min"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
            required
          />
        </div>
        <div>
          <Button type={"submit"}>Analyze</Button>
          {isLoading && (
            <span className="ml-4 font-mono text-muted-foreground">
              Analyzing...
            </span>
          )}
        </div>
      </form>
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
      <p className="flex items-center gap-4 bg-popover opacity-75 p-4 rounded-lg font-mono text-popover-foreground text-sm">
        <Icon path={mdiInformation} size={0.75} />
        This website uses{" "}
        <Link
          href="https://mtg.github.io/essentia.js/"
          target="_blank"
          className="underline underline-offset-4"
        >
          essentia.js
        </Link>{" "}
        and may produce wrong results from time to time.
      </p>
    </div>
  );
}
