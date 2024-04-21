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
