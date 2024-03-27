importScripts("/scripts/essentia-wasm.es.js");
const EssentiaWASM = Module;

addEventListener("message", (msg) => {
  const essentia = new EssentiaWASM.EssentiaJS(false);
  essentia.arrayToVector = EssentiaWASM.arrayToVector;

  // convert passed audio to vector signal
  const vectorSignal = essentia.arrayToVector(msg.data);

  // bpm
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

  // loudness
  const loudness = essentia.DynamicComplexity(
    vectorSignal,
    0.2,
    16000 // downsampled
  ).loudness;

  // return data
  const data = {
    tempo: bpm,
    key: keyData.key,
    scale: keyData.scale,
    loudness: loudness,
  };
  postMessage(data);
});
