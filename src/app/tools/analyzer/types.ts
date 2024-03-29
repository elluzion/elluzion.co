export type AudioWorkerReturnMessage = {
  type: "data" | "status";
  data: AudioWorkerReturnData | "finished";
};

export type AudioWorkerReturnData = {
  key: "keyData" | "tempo" | "loudness" | "analysisFinished";
  value: number | KeyData;
};

export type AudioData = {
  tempo?: number;
  key?: string;
  scale?: string;
  loudness?: number;
};

export type KeyData = {
  key: string;
  scale: string;
  strength: number;
};
