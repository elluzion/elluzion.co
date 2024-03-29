importScripts("/scripts/essentia-wasm.es.js");
const EssentiaWASM = Module;

addEventListener("message", (msg) => {
  const essentia = new EssentiaWASM.EssentiaJS(false);
  essentia.arrayToVector = EssentiaWASM.arrayToVector;

  // convert passed audio to vector signal
  const vectorSignal = essentia.arrayToVector(msg.data);

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
  postMessage({ type: "data", data: { key: "keyData", value: keyData } });

  // loudness
  const loudness = essentia.DynamicComplexity(
    vectorSignal,
    0.2,
    16000 // downsampled
  ).loudness;
  postMessage({ type: "data", data: { key: "loudness", value: loudness } });

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
  postMessage({ type: "data", data: { key: "tempo", value: bpm } });

  // all done
  postMessage({ type: "status", data: "finished" });
});
