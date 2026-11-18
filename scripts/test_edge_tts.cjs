const WebSocket = require('ws');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function generateEdgeAudio(text, voice = 'en-IN-PrabhatNeural') {
  return new Promise((resolve, reject) => {
    const reqId = crypto.randomBytes(16).toString('hex');
    const ws = new WebSocket(
      'wss://speech.platform.bing.com/consumer/speech/synthesize/readahead/edge/v1?TrustedClientToken=6A5AA1D4EA6540818392238F03AF99A5',
      {
        headers: {
          'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
        },
      }
    );

    const audioChunks = [];

    ws.on('open', () => {
      // 1. Config message
      const configMsg =
        `X-Timestamp:${new Date().toISOString()}\r\n` +
        `Content-Type:application/json; charset=utf-8\r\n` +
        `Path:speech.config\r\n\r\n` +
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'false' },
                outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
              },
            },
          },
        });
      ws.send(configMsg);

      // 2. SSML request message
      const ssml =
        `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>` +
        `<voice name='${voice}'>` +
        `<prosody rate='-4%' pitch='-1Hz'>${text}</prosody>` +
        `</voice></speak>`;

      const requestMsg =
        `X-RequestId:${reqId}\r\n` +
        `Content-Type:application/ssml+xml\r\n` +
        `X-Timestamp:${new Date().toISOString()}\r\n` +
        `Path:ssml\r\n\r\n` +
        ssml;
      ws.send(requestMsg);
    });

    ws.on('message', (data, isBinary) => {
      if (!isBinary) {
        const textData = data.toString('utf8');
        if (textData.includes('Path:turn.end')) {
          ws.close();
          const fullBuffer = Buffer.concat(audioChunks);
          resolve(fullBuffer);
        }
      } else {
        // Binary audio packet: first 2 bytes are header length in big-endian
        const headerLen = data.readUInt16BE(0);
        if (data.length > headerLen + 2) {
          const audioPart = data.subarray(headerLen + 2);
          audioChunks.push(audioPart);
        }
      }
    });

    ws.on('error', (err) => {
      reject(err);
    });

    ws.on('close', () => {
      if (audioChunks.length > 0) {
        resolve(Buffer.concat(audioChunks));
      }
    });
  });
}

async function test() {
  try {
    console.log('Testing Edge TTS PrabhatNeural (Male en-IN)...');
    const audio = await generateEdgeAudio('Hey! Hello, I am Fuzail Ahmed, a Software Developer from Chennai, India.');
    console.log('Success! Audio bytes received:', audio.length);
    const testFile = path.join(__dirname, '..', 'public', 'audio', 'fuzail-voice', 'test-prabhat.mp3');
    fs.writeFileSync(testFile, audio);
    console.log('Saved test file to', testFile);
  } catch (e) {
    console.error('Edge TTS error:', e);
  }
}

test();
