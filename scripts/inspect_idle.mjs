import fs from 'fs';

const buffer = fs.readFileSync('public/models/spiderman.glb');
const chunk0Length = buffer.readUInt32LE(12);
const jsonChunk = buffer.toString('utf8', 20, 20 + chunk0Length);
const gltf = JSON.parse(jsonChunk);

const idleAnim = gltf.animations.find(a => a.name.includes('idle'));
console.log('Idle anim name:', idleAnim.name);

// Find channels targeting UpperArm, Forearm, Hand
const upArmNodeIdx = gltf.nodes.findIndex(n => n.name === 'Bip001 R UpperArm_045');
const channels = idleAnim.channels.filter(c => c.target.node === upArmNodeIdx);
console.log('UpperArm channels in idle:', channels);

