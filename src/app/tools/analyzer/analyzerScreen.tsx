"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useToast } from "@/components/use-toast";
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

  return (
    <div>
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
        <div className="mb-8">
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
            <td>{Math.round(audioData.tempo)} BPM</td>
            <td>
              {audioData.key} {audioData.scale}
            </td>
            <td>{audioData.loudness.toFixed(1)} LUFS</td>
          </tr>
        </table>
      )}
    </div>
  );
}
