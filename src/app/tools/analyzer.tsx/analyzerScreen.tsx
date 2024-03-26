"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { FormEvent, useState } from "react";
import type { AudioData } from "./types";

export default function AnalyzerScreen() {
  const [file, setFile] = useState<File | null>(null);
  // parsed data of the audio file
  const [audioData, setAudioData] = useState<AudioData | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // dont actually submit form
  }

  return (
    <div>
      <form className="mb-4" onSubmit={handleOnSubmit}>
        <div className="flex items-center gap-4 mb-4">
          <span className="font-medium">Upload file:</span>
          <Input
            type="file"
            accept=".wav,.mp3"
            className="w-min"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
            required
          />
        </div>
        <Button type={"submit"}>Analyze</Button>
        {isLoading && (
          <span className="ml-4 font-mono text-muted-foreground">
            Uploading and analyzing...
          </span>
        )}
      </form>
      {/* RESULT */}
      {audioData && <span>{JSON.stringify(audioData)}</span>}
    </div>
  );
}
