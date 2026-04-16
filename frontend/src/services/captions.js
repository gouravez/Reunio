// services/captions.js

const TARGET_SAMPLE_RATE = 16000;
const CHUNK_DURATION_MS = 200;
const CHUNK_SIZE = (TARGET_SAMPLE_RATE * CHUNK_DURATION_MS) / 1000;

function downsampleBuffer(buffer, inputRate, outputRate) {
  if (inputRate === outputRate) return buffer;

  const ratio = inputRate / outputRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);

  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < newLength) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);

    let accum = 0;
    let count = 0;

    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }

    result[offsetResult++] = count ? accum / count : 0;
    offsetBuffer = nextOffsetBuffer;
  }

  return result;
}

export const startAudioStream = async (stream, userId, socket, roomId) => {
  const audioContext = new AudioContext();
  await audioContext.resume();

  const source = audioContext.createMediaStreamSource(stream);

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 6;

  const compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
  compressor.knee.setValueAtTime(40, audioContext.currentTime);
  compressor.ratio.setValueAtTime(12, audioContext.currentTime);
  compressor.attack.setValueAtTime(0, audioContext.currentTime);
  compressor.release.setValueAtTime(0.25, audioContext.currentTime);

  const processor = audioContext.createScriptProcessor(4096, 1, 1);

  let bufferQueue = new Float32Array(CHUNK_SIZE * 4);
  let queueLength = 0;

  source.connect(gainNode);
  gainNode.connect(compressor);
  compressor.connect(processor);
  processor.connect(audioContext.destination);

  processor.onaudioprocess = (event) => {
    const input = event.inputBuffer.getChannelData(0);

    const downsampled = downsampleBuffer(
      input,
      audioContext.sampleRate,
      TARGET_SAMPLE_RATE,
    );

    for (let i = 0; i < downsampled.length; i++) {
      if (queueLength < bufferQueue.length) {
        bufferQueue[queueLength++] = downsampled[i];
      }
    }

    while (queueLength >= CHUNK_SIZE) {
      const int16 = new Int16Array(CHUNK_SIZE);

      for (let i = 0; i < CHUNK_SIZE; i++) {
        const s = Math.max(-1, Math.min(1, bufferQueue[i]));
        int16[i] = s * 32767;
      }

      bufferQueue.copyWithin(0, CHUNK_SIZE, queueLength);
      queueLength -= CHUNK_SIZE;

      socket.emit("audio-chunk", int16.buffer, {
        userId,
        roomId,
      });
    }
  };

  return () => {
    processor.disconnect();
    source.disconnect();
    audioContext.close();
  };
};
