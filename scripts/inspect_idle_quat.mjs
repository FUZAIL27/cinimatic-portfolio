import fs from 'fs';

const buffer = fs.readFileSync('public/models/spiderman.glb');
const chunk0Length = buffer.readUInt32LE(12);
const jsonChunk = buffer.toString('utf8', 20, 20 + chunk0Length);
const gltf = JSON.parse(jsonChunk);

const idleAnim = gltf.animations.find(a => a.name.includes('idle'));
const sampler178 = idleAnim.samplers[178];
console.log('Sampler 178:', sampler178);

const accessor = gltf.accessors[sampler178.output];
console.log('Accessor for rotation:', accessor);

const binStart = 20 + chunk0Length + 8; // start of BIN chunk
const bufferView = gltf.bufferViews[accessor.bufferView];
const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);

const quat0 = [
  buffer.readFloatLE(binStart + byteOffset),
  buffer.readFloatLE(binStart + byteOffset + 4),
  buffer.readFloatLE(binStart + byteOffset + 8),
  buffer.readFloatLE(binStart + byteOffset + 12),
];
console.log('Idle Frame 0 Quaternion:', quat0);

