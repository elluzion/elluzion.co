import { WorkerReturnData, WorkerReturnMessage } from "../types";

export default class AnalysisWorkerAdapter {
  // main worker
  worker: Worker;

  // callbacks
  _onDataCallbacks: ((data: WorkerReturnData) => void)[] = [];
  _onErrorCallbacks: ((error: ErrorEvent) => void)[] = [];
  _onFinishedCallbacks: (() => void)[] = [];

  /**
   * A Typescript adapter for the AnalysisWorker.
   *
   * "Why not just convert the Worker itself to typescript? 🤓"
   * This would mean that we lose the ability of using importScripts() inside that function,
   * which means we have to use classic import statements (and essentia.js uses it to detect workers).
   *
   * Moreover, the worker would error out due to essentia referencing the nodejs "fs" library, which throws an error in the browser.
   * That's why we need a workaround for a simplified and type-safe communication, a.k.a. this adapter.
   */
  constructor() {
    this.worker = new Worker(new URL("./analysisWorker.js", import.meta.url));

    this.worker.addEventListener("message", (event) => {
      const data = event.data as WorkerReturnMessage;
      if (data.type == "data") {
        // new analysis data received
        this._onDataCallbacks.forEach((callback) => {
          if (data.data) callback(data.data);
        });
      } else if (data.type == "status") {
        // work completed
        if (data.status == "finished") {
          this._onFinishedCallbacks.forEach((callback) => callback());
        }
      }
    });

    this.worker.addEventListener("error", (event) => {
      // error occured
      this._onErrorCallbacks.forEach((callback) => {
        callback(event);
      });
      // notifying finishing too
      this._onFinishedCallbacks.forEach((callback) => {
        callback();
      });
    });
  }

  /**
   * PUBLIC FUNCTIONS
   */

  /**
   * Invoke a new Analysis worker and pass it an audiochannel to analyze
   * @param audioChannel The processed audio channel to analyze
   */
  invoke(audioChannel: Float32Array) {
    this.worker.postMessage(audioChannel);
  }

  /**
   * Terminate worker
   */
  kill() {
    this.worker.terminate();
  }

  /**
   * Triggered when the worker reports new analysis data.
   * @param callback Callback to notify when data from the worker has been received
   */
  onData(callback: (data: WorkerReturnData) => void) {
    this._onDataCallbacks.push(callback);
  }

  /**
   * Triggered when the worker reports an error.
   * @param callback Callback to notify when an error occured
   */
  onError(callback: (error: ErrorEvent) => void) {
    this._onErrorCallbacks.push(callback);
  }

  /**
   * Triggered when the work has been completed, both successful or with an error.
   * @param callback Callback to notify when the worker is done working.
   */
  onFinished(callback: () => void) {
    this._onFinishedCallbacks.push(callback);
  }
}
