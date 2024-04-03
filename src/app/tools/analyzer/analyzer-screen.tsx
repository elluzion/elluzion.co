"use client";

import { InfoCard } from "@/components/info-card";
import { useToast } from "@/components/use-toast";
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
import { useState } from "react";
import FileUploadInput from "./_components/file-upload-input";
import { getProcessedAudio } from "./_lib/audioUtils";
import AnalysisWorkerAdapter from "./_lib/worker-adapter";
import type { KeyData } from "./types";

export default function AnalyzerScreen() {
  /**
   * LOGIC
   */
  // parsed data of the audio file
  const [key, setKey] = useState<string | null>(null);
  const [scale, setScale] = useState<string | null>(null);
  const [tempo, setTempo] = useState<number | null>(null);
  const [loudness, setLoudness] = useState<number | null>(null);

  /**
   * UI
   */
  // loading/working indicator
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  function handleSubmit(file: File) {
    // reset
    resetAllData();

    const audioContext = new AudioContext();
    const workerAdapter = new AnalysisWorkerAdapter();

    // receiving partial data from worker
    workerAdapter.onData((data) => {
      switch (data.key) {
        case "keyData": {
          const value = data.value as KeyData;
          setKey(value.key);
          setScale(value.scale);
          break;
        }
        case "loudness": {
          setLoudness(data.value as number);
          break;
        }
        case "tempo": {
          setTempo(data.value as number);
          break;
        }
      }
    });

    // worker errored out
    workerAdapter.onError((error) => {
      console.log(error);
      setIsLoading(false);
      toast({
        title: "An error occured ",
        description: "Check console for more info.",
      });
    });

    // work finished
    workerAdapter.onFinished(() => setIsLoading(false));

    // get optimized audio channel for the file and pass it to the worker
    getProcessedAudio(file, audioContext).then((audio) => {
      if (!audio) return;
      workerAdapter.invoke(audio);
      setIsLoading(true);
    });
  }

  function resetAllData() {
    setKey(null);
    setScale(null);
    setTempo(null);
    setLoudness(null);
  }

  const dataAvailable = () => {
    if (key || scale || tempo || loudness) return true;
    return false;
  };

  return (
    <div className="flex flex-col gap-8 grow">
      {/* INPUT UI */}
      <FileUploadInput onFileSubmitted={handleSubmit} isLoading={isLoading} />

      {/* RESULT */}
      {dataAvailable() && (
        <motion.div className="gap-2 grid grid-cols-2">
          {key && scale && (
            <DataCard
              mdiIconPath={mdiPiano}
              title={"Key"}
              subTitle={`${key} ${scale}`}
            />
          )}
          {loudness && (
            <DataCard
              mdiIconPath={mdiSpeaker}
              title={"Loudness"}
              subTitle={`${loudness.toFixed(1)} LUFS`}
            />
          )}
          {tempo && (
            <div className="col-span-2">
              <DataCard
                mdiIconPath={mdiSpeedometer}
                title={"Tempo"}
                subTitle={`${Math.round(doubleIfLow(tempo))} BPM`}
              />
            </div>
          )}
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95, translateY: "16px" }}
      animate={{
        opacity: 1,
        scale: 1,
        translateY: "0px",
        transition: { duration: 0.8, ease: [0, 0.7, 0.2, 1.0] },
      }}
      className={`flex flex-col gap-3 bg-popover p-4 rounded-lg text-card-foreground group`}
    >
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
    </motion.div>
  );
}

export const ALLOWED_FILE_TYPES = ["audio/wav", "audio/flac", "audio/mpeg"];

function doubleIfLow(bpm: number) {
  return bpm < 89 ? bpm * 2 : bpm;
}
