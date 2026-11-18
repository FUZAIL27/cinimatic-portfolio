const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

function writeWav(filename, sampleRate, samples) {
  const byteRate = sampleRate * 2; // 16-bit mono
  const blockAlign = 2;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 = Mono)
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write 16-bit PCM samples
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7FFF, 44 + i * 2);
  }

  fs.writeFileSync(path.join(audioDir, filename), buffer);
  console.log(`Generated ${filename} (${samples.length / sampleRate}s)`);
}

const sampleRate = 44100;

// 1. Web-Shooting "THWIP" (Quick high-frequency noise burst + resonant whistle)
{
  const duration = 0.45;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 18);
    const noise = (Math.random() * 2 - 1) * 0.6;
    const tone = Math.sin(2 * Math.PI * (1200 - t * 1800) * t) * 0.4;
    samples[i] = (noise + tone) * env;
  }
  writeWav('web-shoot.wav', sampleRate, samples);
}

// 2. Rooftop Landing Impact (Deep cinematic sub-bass thump + rubble crunch)
{
  const duration = 1.2;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const subEnv = Math.exp(-t * 4);
    const sub = Math.sin(2 * Math.PI * (80 * Math.exp(-t * 5)) * t) * 0.85;
    const crunch = (Math.random() * 2 - 1) * Math.exp(-t * 25) * 0.35;
    samples[i] = (sub + crunch) * subEnv;
  }
  writeWav('landing-impact.wav', sampleRate, samples);
}

// 3. Holographic Contact Energy Ripple (Cyan shimmer / resonant bell pulse)
{
  const duration = 1.5;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 2.2);
    const f1 = Math.sin(2 * Math.PI * 440 * t);
    const f2 = Math.sin(2 * Math.PI * 880 * t) * 0.5;
    const f3 = Math.sin(2 * Math.PI * 1320 * t) * 0.25;
    const shimmer = Math.sin(2 * Math.PI * 8 * t) * 0.2;
    samples[i] = (f1 + f2 + f3 + shimmer) * env * 0.4;
  }
  writeWav('energy-ripple.wav', sampleRate, samples);
}

// 4. Cinematic Ambient Drone (Rich cinematic night city suspense atmosphere)
{
  const duration = 8.0;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Layered chords: D minor / mysterious cinematic progression
    const f1 = Math.sin(2 * Math.PI * 73.42 * t) * 0.3; // D2
    const f2 = Math.sin(2 * Math.PI * 110.0 * t) * 0.25; // A2
    const f3 = Math.sin(2 * Math.PI * 174.61 * t) * 0.15; // F3
    const f4 = Math.sin(2 * Math.PI * 220.0 * t) * 0.1; // A3
    const pulse = 0.85 + Math.sin(2 * Math.PI * 0.25 * t) * 0.15;
    const air = (Math.random() * 2 - 1) * 0.03;
    samples[i] = (f1 + f2 + f3 + f4 + air) * pulse * 0.35;
  }
  writeWav('cinematic-ambient.wav', sampleRate, samples);
}

