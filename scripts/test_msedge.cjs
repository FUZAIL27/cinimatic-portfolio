const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

async function main() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("en-IN-PrabhatNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  console.log("Synthesizing test audio with en-IN-PrabhatNeural (Male Indian English)...");
  
  const { audioStream } = tts.toStream("Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India.");
  const testFile = path.join(__dirname, '..', 'public', 'audio', 'fuzail-voice', 'test-prabhat.mp3');
  const writeStream = fs.createWriteStream(testFile);
  
  audioStream.pipe(writeStream);
  
  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
    audioStream.on('error', reject);
  });
  
  const stats = fs.statSync(testFile);
  console.log("SUCCESS! Saved test-prabhat.mp3 with size:", stats.size, "bytes");
}

main().catch(console.error);
