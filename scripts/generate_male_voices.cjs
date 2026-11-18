const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'audio', 'fuzail-voice');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const TRACKS = {
  'robot-1': "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India.",
  'robot-2': "I enjoy building modern web applications, solving real-world problems, and turning creative ideas into practical solutions.",
  'robot-3': "I'm always excited to learn, explore new technologies, and take on new challenges.",
  'robot-4': "Thanks for visiting my portfolio. Feel free to explore my work!",
  'robot-intro': "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India. I enjoy building modern web applications, solving real-world problems, and turning creative ideas into practical solutions. I'm always excited to learn, explore new technologies, and take on new challenges. Thanks for visiting my portfolio. Feel free to explore my work!",
  'fuzail-full-speech': "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India. I enjoy building modern web applications, solving real-world problems, and turning creative ideas into practical solutions. I'm always excited to learn, explore new technologies, and take on new challenges. Thanks for visiting my portfolio. Feel free to explore my work!",
  'fuzail-ai-voice': "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India. I enjoy building modern web applications, solving real-world problems, and turning creative ideas into practical solutions. I'm always excited to learn, explore new technologies, and take on new challenges. Thanks for visiting my portfolio. Feel free to explore my work!",
  'spiderman-intro': "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India. Welcome to my portfolio! Feel free to explore my work!",
};

async function generateTrack(tts, name, text) {
  console.log(`Generating male voice for [${name}]...`);
  const { audioStream } = tts.toStream(text, {
    pitch: "-2Hz", // Warm, deep, confident adult male tone
    rate: "-3%",   // Natural conversational pace
    volume: "+0%"
  });

  const chunks = [];
  audioStream.on('data', c => chunks.push(c));

  await new Promise((resolve, reject) => {
    audioStream.on('end', resolve);
    audioStream.on('error', reject);
  });

  const fullBuf = Buffer.concat(chunks);
  const mp3Path = path.join(outDir, `${name}.mp3`);
  const wavPath = path.join(outDir, `${name}.wav`);

  fs.writeFileSync(mp3Path, fullBuf);
  fs.writeFileSync(wavPath, fullBuf);

  console.log(`  ✓ Saved ${name}.mp3 and ${name}.wav (${fullBuf.length} bytes)`);
}

async function run() {
  const tts = new MsEdgeTTS();
  // en-IN-PrabhatNeural: Microsoft's official natural Indian English Adult Male Neural Voice
  await tts.setMetadata("en-IN-PrabhatNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  console.log("Starting synthesis of 100% Genuine Male Voices (en-IN-PrabhatNeural)...");
  for (const [name, text] of Object.entries(TRACKS)) {
    await generateTrack(tts, name, text);
    // Short pause between requests
    await new Promise(r => setTimeout(r, 300));
  }
  console.log("\nALL MALE AUDIO TRACKS GENERATED SUCCESSFULLY!");
}

run().catch(err => {
  console.error("Error generating male voices:", err);
  process.exit(1);
});

