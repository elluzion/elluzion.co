/**
 * OPTIMIZATION UTILITIES USED IN THE OFFICAL ESSENTIA.JS EXAMPLES:
 * https://github.com/MTG/essentia.js/blob/819c00e8f034dc709e3d330ed8ac9ed37dfdb767/examples/demos/mood-classifiers/src/audioUtils.js
 */

/**
 *
 * @param file audio file
 * @param audioContext passed audiocontext from the window
 * @returns a preprocessed audio channel
 */
export async function getProcessedAudio(
  file: File,
  audioContext: AudioContext
) {
  // get arraybuffer from audio file
  const arrayBuffer = await file.arrayBuffer();

  try {
    // decode file into arraybuffer
    const audioBuffer = await new Promise<AudioBuffer>((resolve) => {
      return audioContext.decodeAudioData(arrayBuffer, resolve);
    });

    // preprocess the file, mono + downsampling, to improve performance
    return preprocess(audioBuffer);
  } catch (error) {
    return undefined;
  }
}

/**
 *
 * @param audioBuffer source audio buffer
 * @returns optimized audio channel
 */
export function preprocess(audioBuffer: AudioBuffer) {
  const mono = monomix(audioBuffer);
  // downmix to mono, and downsample to 16kHz sr for essentia tensorflow models
  return downsampleArray(mono, audioBuffer.sampleRate, 16000);
}

/**
 * Converting a multi-channel audiobuffer into a single audio channel
 * @param buffer The Audiobuffer of the audio file
 * @returns mono audiochannel
 */
function monomix(buffer: AudioBuffer) {
  // downmix to mono
  let monoAudio;
  if (buffer.numberOfChannels > 1) {
    console.log("mixing down to mono...");
    const leftCh = buffer.getChannelData(0);
    const rightCh = buffer.getChannelData(1);
    monoAudio = leftCh.map((sample, i) => 0.5 * (sample + rightCh[i]));
  } else {
    monoAudio = buffer.getChannelData(0);
  }

  return monoAudio;
}

/**
 * Downsampling an audio channel to a target value
 * @param audioIn mono Audio Channel from the AudioBuffer
 * @param sampleRateIn source sample rate
 * @param sampleRateOut target sample rate
 * @returns downsampled Audio Channel
 */
function downsampleArray(
  audioIn: Float32Array,
  sampleRateIn: number,
  sampleRateOut: number
) {
  if (sampleRateOut === sampleRateIn) {
    return audioIn;
  }
  let sampleRateRatio = sampleRateIn / sampleRateOut;
  let newLength = Math.round(audioIn.length / sampleRateRatio);
  let result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetAudioIn = 0;

  console.log(`Downsampling to ${sampleRateOut} kHz...`);
  while (offsetResult < result.length) {
    let nextOffsetAudioIn = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0,
      count = 0;
    for (
      let i = offsetAudioIn;
      i < nextOffsetAudioIn && i < audioIn.length;
      i++
    ) {
      accum += audioIn[i];
      count++;
    }
    result[offsetResult] = accum / count;
    offsetResult++;
    offsetAudioIn = nextOffsetAudioIn;
  }

  return result;
}
