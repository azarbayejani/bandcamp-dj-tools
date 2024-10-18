import { analyze } from 'web-audio-beat-detector';
import browser from 'webextension-polyfill';
import { FetchAudioBufferFromUrlMessage } from '../types';

function mergeChunks(chunks: Uint8Array[]) {
  let length = 0;
  chunks.forEach((chunk) => (length += chunk.length));
  const mergedArray = new Uint8Array(length);
  let offset = 0;
  chunks.forEach((chunk) => {
    mergedArray.set(chunk, offset);
    offset += chunk.length;
  });
  return mergedArray;
}

// note that this function must be initiated from a user action!
export async function analyzeAudio(url: string) {
  let audioContext = new AudioContext();

  return new Promise<number>((resolve, reject) => {
    const port = browser.runtime.connect({ name: 'AnalyzeAudio#' + url });
    const chunks: Uint8Array[] = [];
    const onMessage = async (message: FetchAudioBufferFromUrlMessage) => {
      // if data, add the data
      // if end, disconnect
      switch (message.type) {
        case 'START':
          break;
        case 'END':
          port.disconnect();
          port.onMessage.removeListener(onMessage);
          const mergedArray = mergeChunks(chunks);
          const decodedAudio = await audioContext.decodeAudioData(
            mergedArray.buffer
          );

          const bpm = await analyze(decodedAudio);
          resolve(bpm);
          break;
        case 'DATA': {
          const { data } = message;
          chunks.push(new Uint8Array(data));
          break;
        }
        case 'ERROR': {
          const { reason } = message;
          reject(reason);
        }
      }
    };
    port.onMessage.addListener(onMessage);
  });
}
