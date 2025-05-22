// Vosk WASM browser integration
// Assumes vosk-worker.js and vosk.wasm are in /public, and model in /public/vosk-model-small-en-us-0.15

let worker: Worker | null = null;
let ready: Promise<void> | null = null;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker('/vosk-worker.js');
  }
  return worker;
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (!ready) {
    ready = new Promise((resolve, reject) => {
      const w = getWorker();
      w.postMessage({
        command: 'init',
        modelUrl: '/vosk-model-small-en-us-0.15',
        wasmUrl: '/vosk.wasm',
      });
      w.onmessage = (event) => {
        if (event.data.status === 'init-done') {
          resolve();
        } else if (event.data.status === 'error') {
          reject(event.data.error);
        }
      };
    });
  }
  await ready;

  // Convert audioBlob to ArrayBuffer
  const arrayBuffer = await audioBlob.arrayBuffer();
  // Send audio to worker
  return new Promise((resolve, reject) => {
    const w = getWorker();
    w.onmessage = (event) => {
      if (event.data.result) {
        resolve(event.data.result.text);
      } else if (event.data.status === 'error') {
        reject(event.data.error);
      }
    };
    w.postMessage({
      command: 'recognize',
      audio: arrayBuffer,
    }, [arrayBuffer]);
  });
}

export async function cleanupSTT() {
  if (worker) {
    worker.terminate();
    worker = null;
    ready = null;
  }
} 