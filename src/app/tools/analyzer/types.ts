export type WorkerReturnMessage = {
  data?: WorkerReturnData;
  status?: WorkerReturnStatus;
};

export type WorkerReturnData = {
  keyData?: KeyData;
  tempo?: number;
  loudness?: number;
};

export type WorkerReturnStatus = "started" | "finished";

export type KeyData = {
  key: string;
  scale: string;
  strength: number;
};
