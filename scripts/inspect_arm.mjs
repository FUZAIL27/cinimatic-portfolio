import * as THREE from 'three';
import fs from 'fs';

// Let's inspect the armature hierarchy and rest matrices
const buffer = fs.readFileSync('public/models/spiderman.glb');
const chunk0Length = buffer.readUInt32LE(12);
const jsonChunk = buffer.toString('utf8', 20, 20 + chunk0Length);
const gltf = JSON.parse(jsonChunk);

const nodes = gltf.nodes;
const rClav = nodes.find(n => n.name === 'Bip001 R Clavicle_044');
const rUp = nodes.find(n => n.name === 'Bip001 R UpperArm_045');
const rFore = nodes.find(n => n.name === 'Bip001 R Forearm_046');
const rHand = nodes.find(n => n.name === 'Bip001 R Hand_047');

console.log('R Clavicle:', rClav);
console.log('R UpperArm:', rUp);
console.log('R Forearm:', rFore);
console.log('R Hand:', rHand);

