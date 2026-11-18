const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'audio', 'fuzail-voice');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function fetchAudioChunk(text, lang = 'en-IN') {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Referer: 'http://translate.google.com/',
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            return reject(new Error(`TTS API failed with status ${res.statusCode} for chunk: ${text}`));
          }
          const data = [];
          res.on('data', (c) => data.push(c));
          res.on('end', () => resolve(Buffer.concat(data)));
        }
      )
      .on('error', reject);
  });
}

function splitTextIntoSentences(text) {
  const rawParts = text.match(/[^.!?]+[.!?]+/g) || [text];
  const results = [];
  for (const part of rawParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.length > 180) {
      const commaParts = trimmed.split(/,\s+/);
      for (const cp of commaParts) {
        if (cp.trim()) results.push(cp.trim());
      }
    } else {
      results.push(trimmed);
    }
  }
  return results;
}

async function generateTrack(filename, text, lang = 'en-IN') {
  console.log(`\nSynthesizing: ${filename}...`);
  const segments = splitTextIntoSentences(text);
  const audioBuffers = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    console.log(`  [Segment ${i + 1}/${segments.length}] "${seg}"`);
    const chunkBuf = await fetchAudioChunk(seg, lang);
    audioBuffers.push(chunkBuf);
    await new Promise((r) => setTimeout(r, 200));
  }

  const combined = Buffer.concat(audioBuffers);
  const mp3Path = path.join(outDir, `${filename}.mp3`);
  fs.writeFileSync(mp3Path, combined);
  console.log(`✓ Saved ${mp3Path} (${combined.length} bytes)`);

  const wavPath = path.join(outDir, `${filename}.wav`);
  fs.writeFileSync(wavPath, combined);
  console.log(`✓ Saved ${wavPath} (${combined.length} bytes)`);
}

const DIALOGUE_SEGMENTS = {
  'robot-1': "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India.",
  'robot-2': "I enjoy building modern web applications, solving real-world problems, and turning creative ideas into practical solutions.",
  'robot-3': "I'm always excited to learn, explore new technologies, and take on new challenges.",
  'robot-4': "Thanks for visiting my portfolio. Feel free to explore my work!",
  'robot-intro': "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India. I enjoy building modern web applications, solving real-world problems, and turning creative ideas into practical solutions. I'm always excited to learn, explore new technologies, and take on new challenges. Thanks for visiting my portfolio. Feel free to explore my work!",
  'fuzail-full-speech': "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India. I enjoy building modern web applications, solving real-world problems, and turning creative ideas into practical solutions. I'm always excited to learn, explore new technologies, and take on new challenges. Thanks for visiting my portfolio. Feel free to explore my work!",
  'fuzail-ai-voice': "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India. I enjoy building modern web applications, solving real-world problems, and turning creative ideas into practical solutions. I'm always excited to learn, explore new technologies, and take on new challenges. Thanks for visiting my portfolio. Feel free to explore my work!",
  'spiderman-intro': "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India. Welcome to my portfolio! Feel free to explore my work!",
};

async function run() {
  try {
    for (const [name, script] of Object.entries(DIALOGUE_SEGMENTS)) {
      await generateTrack(name, script, 'en-IN');
    }
    console.log('\nAll audio tracks synthesized successfully!');
  } catch (err) {
    console.error('Error synthesizing voices:', err);
    process.exit(1);
  }
}

run();
