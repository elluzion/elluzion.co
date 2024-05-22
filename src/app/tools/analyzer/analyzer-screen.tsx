"use client";

import { useToast } from "@/components/use-toast";
import { mdiPiano, mdiSpeaker, mdiSpeedometer } from "@mdi/js";
import { motion } from "framer-motion";
import { useState } from "react";
//@ts-ignore
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DataCard from "./_components/data-card";
import FileUploadInput from "./_components/file-upload-input";
import InfoDrawer from "./_components/info-drawer";
import { getProcessedAudio } from "./_lib/audioUtils";
import AnalysisWorkerAdapter from "./_lib/worker-adapter";
import { HistoryEntry, KeyData, WorkerReturnData } from "./types";

export default function AnalyzerScreen() {
  /**
   * LOGIC
   */
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // parsed data of the audio file
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [tempo, setTempo] = useState<WorkerReturnData["tempo"]>(undefined);
  const [key, setKey] = useState<KeyData["key"] | undefined>(undefined);
  const [scale, setScale] = useState<KeyData["scale"] | undefined>(undefined);
  const [loudness, setLoudness] = useState<WorkerReturnData["loudness"]>(undefined);

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

    setFileName(file.name);

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
    if (dataAvailable()) {
      // add existing analysis data to history
      setHistory([
        {
          name: fileName || "",
          key: key || "",
          scale: scale || "",
          tempo: tempo,
          loudness: loudness,
        },
        ...history,
      ]);
    }

    // reset
    setKey(undefined);
    setScale(undefined);
    setTempo(undefined);
    setLoudness(undefined);
    setFileName(undefined);
  }

  const dataAvailable = () => {
    if (key || scale || tempo || loudness) return true;
    return false;
  };

  return (
    <div className="flex flex-col gap-6 grow">
      {/* INPUT UI */}
      <FileUploadInput
        onFileSubmitted={handleSubmit}
        isLoading={isLoading}
        loadingStatusMessage={status}
        loadingProgress={progress}
      />

      {/* FILE NAME */}
      <span
        className="font-mono text-muted-foreground transition-opacity"
        style={{ opacity: fileName ? 1 : 0 }}
      >
        {fileName}
      </span>

      {/* RESULT */}
      {dataAvailable() && (
        <motion.div className="gap-2 grid grid-cols-2">
          {key && scale && <DataCard mdiIconPath={mdiPiano} title={"Key"} subTitle={`${key} ${scale}`} />}
          {tempo && (
            <div>
              <DataCard mdiIconPath={mdiSpeedometer} title={"Tempo"} subTitle={`${tempo} BPM`} />
            </div>
          )}
          {loudness?.overall && (
            <DataCard
              mdiIconPath={mdiSpeaker}
              title={"Overall Loudness"}
              subTitle={`${loudness.overall} LUFS`}
            />
          )}
          {loudness?.range && (
            <DataCard mdiIconPath={mdiSpeaker} title={"Loudness Range"} subTitle={`${loudness.range} dB`} />
          )}
        </motion.div>
      )}
      <div
        className="flex flex-col gap-2 transition-opacity duration-500 delay-300 ease-out"
        style={{
          opacity: history.length > 0 ? 1 : 0,
          pointerEvents: history.length > 0 ? "auto" : "none",
        }}
      >
        <span className="font-bold">Previous</span>
        <Table>
          <TableHeader>
            <TableRow className="*:whitespace-nowrap">
              <TableHead>File name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Tempo</TableHead>
              <TableHead className="text-right">Loudness</TableHead>
              <TableHead className="text-right">Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry, index) => (
              <TableRow key={index} className="*:whitespace-nowrap">
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell className="text-right">
                  {entry.key} {entry.scale}
                </TableCell>
                <TableCell className="text-right">{entry.tempo} BPM</TableCell>
                <TableCell className="text-right">{entry.loudness?.overall} LUFS</TableCell>
                <TableCell className="text-right">{entry.loudness?.range} dB</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <span className="grow" />
      <InfoDrawer />
    </div>
  );
}

export const ALLOWED_FILE_TYPES = ["audio/wav", "audio/flac", "audio/mpeg"];
