/**
@typedef {import("../types.ts").WorkerReturnMessage} WorkerReturnMessage
 */
importScripts("/scripts/essentia-wasm.es.js");
const EssentiaWASM = Module;

addEventListener("message", (msg) => {
  const essentia = new EssentiaWASM.EssentiaJS(false);
  essentia.arrayToVector = EssentiaWASM.arrayToVector;

  // convert passed audio to vector signal
  const vectorSignal = essentia.arrayToVector(msg.data);

  /**
   * workaround for type safety inside this worker
   * @param {WorkerReturnMessage} msg
   */
  const postTypedMessage = (msg) => postMessage(msg);

  postTypedMessage({
    status: {
      progress: 0,
      checkpoint: "Calculating key data",
    },
  });

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
  postTypedMessage({
    data: {
      keyData: {
        key: keyData.key,
        scale: keyData.scale,
      },
    },
  });

  postTypedMessage({
    status: {
      progress: 0.33,
      checkpoint: "Calculating tempo",
    },
  });

  // tempo
  const tempo = essentia.PercivalBpmEstimator(vectorSignal, 1024, 2048, 128, 128, 210, 50, 16000).bpm;
  postTypedMessage({ data: { tempo: Math.round(doubleIfLow(tempo)) } });

  postTypedMessage({
    status: {
      progress: 0.67,
      checkpoint: "Calculating loudness data",
    },
  });

  // loudness - slowest, so it's at the end of the chain
  const loudness = essentia.LoudnessEBUR128(
    vectorSignal,
    vectorSignal,
    0.1,
    16000, // downsampled
    false
  );
  postTypedMessage({
    data: {
      loudness: {
        overall: loudness.integratedLoudness.toFixed(1),
        range: loudness.loudnessRange.toFixed(1),
      },
    },
  });

  // all done
  postTypedMessage({
    status: {
      progress: 1,
      checkpoint: "Finished!",
    },
  });
});

function doubleIfLow(bpm) {
  return bpm < 89 ? bpm * 2 : bpm;
}
