export type WorkerReturnMessage = {
  data?: WorkerReturnData;
  status?: WorkerReturnStatus;
};

export type WorkerReturnData = {
  keyData?: KeyData;
  tempo?: number;
  loudness?: {
    overall: number;
    range: number;
  };
};

export type WorkerReturnStatus = {
  progress: number;
  checkpoint: string;
};

export type KeyData = {
  key: string;
  scale: string;
};

export type HistoryEntry = {
  name: string;
  key: KeyData["key"];
  scale: KeyData["scale"];
  tempo: WorkerReturnData["tempo"];
  loudness: WorkerReturnData["loudness"];
};
