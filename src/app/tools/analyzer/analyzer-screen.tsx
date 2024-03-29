"use client";

import { InfoCard } from "@/components/info-card";
import {
  mdiCheck,
  mdiContentCopy,
  mdiPiano,
  mdiSpeaker,
  mdiSpeedometer,
} from "@mdi/js";
import Icon from "@mdi/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FileUploadInput from "./_components/file-upload-input";
import { getProcessedAudio } from "./_lib/audioUtils";
import type { AudioData } from "./types";

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

    // get optimized audio channel for the file and pass it to the worker
    getProcessedAudio(file, audioContext).then((audio) => {
      if (!audio || !workerRef.current) return;
      workerRef.current.postMessage(audio);
      setIsLoading(true);
    });
  }

  return (
    <div className="flex flex-col gap-8 grow">
      {/* INPUT UI */}
      <FileUploadInput onFileSubmitted={handleSubmit} isLoading={isLoading} />

      {/* RESULT */}
      {audioData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, translateY: "16px" }}
          animate={{
            opacity: 1,
            scale: 1,
            translateY: "0px",
            transition: { duration: 0.8, ease: [0, 0.7, 0.2, 1.0] },
          }}
          className="gap-2 grid grid-cols-2"
        >
          <DataCard
            mdiIconPath={mdiSpeedometer}
            title={"Tempo"}
            subTitle={`${Math.round(doubleIfLow(audioData.tempo))} BPM`}
          />
          <DataCard
            mdiIconPath={mdiPiano}
            title={"Key"}
            subTitle={`${audioData.key} ${audioData.scale}`}
          />
          <DataCard
            mdiIconPath={mdiSpeaker}
            title={"Loudness"}
            subTitle={`${audioData.loudness.toFixed(1)} LUFS`}
          />
        </motion.div>
      )}
      <span className="grow" />
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

function DataCard(props: {
  mdiIconPath: string;
  title: string;
  subTitle: string;
}) {
  const [hasCopied, setHasCopied] = useState(false);

  // Might error out in debug due to insecure origin settings, should be fine in production
  function handleCopyClicked() {
    navigator.clipboard.writeText(props.subTitle).then(() => {
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    });
  }
  return (
    <div className="flex flex-col gap-3 bg-popover p-4 rounded-lg text-card-foreground group">
      <div className="flex items-center gap-2 font-semibold">
        <Icon path={props.mdiIconPath} size={1} />
        <span className="sm:text-lg grow">{props.title}</span>
        <div
          onClick={!hasCopied ? handleCopyClicked : () => {}}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground cursor-pointer"
        >
          <Icon path={hasCopied ? mdiCheck : mdiContentCopy} size={0.8} />
        </div>
      </div>
      <span>{props.subTitle}</span>
    </div>
  );
}

export const ALLOWED_FILE_TYPES = ["audio/wav", "audio/flac", "audio/mpeg"];

function doubleIfLow(bpm: number) {
  return bpm < 89 ? bpm * 2 : bpm;
}
