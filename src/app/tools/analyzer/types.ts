export type WorkerReturnMessage = {
  type: "data" | "status";
  data?: WorkerReturnData;
  status?: WorkerReturnStatus;
};

export type WorkerReturnData = {
  key: "keyData" | "tempo" | "loudness";
  value: number | KeyData;
};

export type WorkerReturnStatus = "started" | "finished";

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
