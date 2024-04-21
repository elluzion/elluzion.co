"use client";

import { InfoCard } from "@/components/info-card";
import { useToast } from "@/components/use-toast";
import { mdiPiano, mdiSpeaker, mdiSpeedometer } from "@mdi/js";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
//@ts-ignore
import DataCard from "./_components/data-card";
import FileUploadInput from "./_components/file-upload-input";
import { getProcessedAudio } from "./_lib/audioUtils";
import AnalysisWorkerAdapter from "./_lib/worker-adapter";
import { KeyData, WorkerReturnData } from "./types";

export default function AnalyzerScreen() {
  /**
   * LOGIC
   */
  // parsed data of the audio file
  const [key, setKey] = useState<KeyData["key"] | undefined>(undefined);
  const [scale, setScale] = useState<KeyData["scale"] | undefined>(undefined);
  const [tempo, setTempo] = useState<WorkerReturnData["tempo"]>(undefined);
  const [loudness, setLoudness] =
    useState<WorkerReturnData["loudness"]>(undefined);

  /**
   * UI
   */
  // loading/working indicator
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [progress, setProgress] = useState<number>(0);

  const { toast } = useToast();

  function handleSubmit(file: File) {
    // reset
    resetAllData();

    const audioContext = new AudioContext();
    const workerAdapter = new AnalysisWorkerAdapter();

    // receiving partial data from worker
    workerAdapter.onData((data) => {
      if (data.keyData) {
        setKey(data.keyData.key);
        setScale(data.keyData.scale);
      }
      if (data.loudness) {
        setLoudness(data.loudness);
      }
      if (data.tempo) {
        setTempo(data.tempo);
      }
    });

    // status updates
    workerAdapter.onStatus((status) => {
      setStatus(status.checkpoint);
      setProgress(status.progress);
    });

    // worker errored out
    workerAdapter.onError((error) => {
      console.log(error);
      setIsLoading(false);
      setProgress(0);
      toast({
        title: "An error occured",
        description: "Check console for more info.",
      });
    });

    // work finished
    workerAdapter.onFinished(() => {
      setIsLoading(false);
    });

    // get optimized audio channel for the file and pass it to the worker
    getProcessedAudio(file, audioContext).then((audio) => {
      if (!audio) return;
      workerAdapter.invoke(audio);
      setIsLoading(true);
    });
  }

  function resetAllData() {
    setKey(undefined);
    setScale(undefined);
    setTempo(undefined);
    setLoudness(undefined);
  }

  const dataAvailable = () => {
    if (key || scale || tempo || loudness) return true;
    return false;
  };

  return (
    <div className="flex flex-col gap-8 grow">
      {/* INPUT UI */}
      <FileUploadInput
        onFileSubmitted={handleSubmit}
        isLoading={isLoading}
        loadingStatusMessage={status}
        loadingProgress={progress}
      />

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
          {tempo && (
            <div>
              <DataCard
                mdiIconPath={mdiSpeedometer}
                title={"Tempo"}
                subTitle={`${Math.round(doubleIfLow(tempo))} BPM`}
              />
            </div>
          )}
          {loudness?.overall && (
            <DataCard
              mdiIconPath={mdiSpeaker}
              title={"Overall Loudness"}
              subTitle={`${loudness.overall.toFixed(1)} LUFS`}
            />
          )}
          {loudness?.range && (
            <DataCard
              mdiIconPath={mdiSpeaker}
              title={"Loudness Range"}
              subTitle={`${loudness.range.toFixed(1)} dB`}
            />
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

export const ALLOWED_FILE_TYPES = ["audio/wav", "audio/flac", "audio/mpeg"];

function doubleIfLow(bpm: number) {
  return bpm < 89 ? bpm * 2 : bpm;
}
