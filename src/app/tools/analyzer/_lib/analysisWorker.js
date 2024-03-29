importScripts("/scripts/essentia-wasm.es.js");
const EssentiaWASM = Module;

addEventListener("message", (msg) => {
  const essentia = new EssentiaWASM.EssentiaJS(false);
  essentia.arrayToVector = EssentiaWASM.arrayToVector;

  // convert passed audio to vector signal
  const vectorSignal = essentia.arrayToVector(msg.data);

  /**
   * workaround for type safety inside this worker
   * @param {import("../types.ts").WorkerReturnMessage} msg
   */
  const postTypedMessage = (msg) => postMessage(msg);

  // key
  const keyData = essentia.KeyExtractor(
    vectorSignal,
    true,
    4096,
    4096,
    12,
    3500,
    60,
    25,
    0.2,
    "bgate",
    16000,
    0.0001,
    440,
    "cosine",
    "hann"
  );
  postTypedMessage({ type: "data", data: { key: "keyData", value: keyData } });

  // loudness
  const loudness = essentia.DynamicComplexity(
    vectorSignal,
    0.2,
    16000 // downsampled
  ).loudness;
  postTypedMessage({
    type: "data",
    data: { key: "loudness", value: loudness },
  });

  // bpm - slowest, so it's at the end of the chain
  const bpm = essentia.PercivalBpmEstimator(
    vectorSignal,
    1024,
    2048,
    128,
    128,
    210,
    50,
    16000
  ).bpm;
  postTypedMessage({ type: "data", data: { key: "tempo", value: bpm } });

  // all done
  postTypedMessage({ type: "status", status: "finished" });
});
