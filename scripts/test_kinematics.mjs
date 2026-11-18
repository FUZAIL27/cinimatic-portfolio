import * as THREE from 'three';

const scene = new THREE.Scene();
const hero = new THREE.Group();
hero.position.set(0, -0.35, 11.5);
hero.rotation.set(0.02, 0.22, 0);
scene.add(hero);

const clav = new THREE.Bone();
clav.position.set(0.22, 1.45, 0.0);
hero.add(clav);

const upArm = new THREE.Bone();
upArm.position.set(0.15, 0, 0);
clav.add(upArm);

const foreArm = new THREE.Bone();
foreArm.position.set(0.25, 0, 0);
upArm.add(foreArm);

const hand = new THREE.Bone();
hand.position.set(0.25, 0, 0);
foreArm.add(hand);

function test(name, rx, ry, rz, fx, fy, fz) {
  upArm.rotation.set(rx, ry, rz);
  foreArm.rotation.set(fx, fy, fz);
  scene.updateMatrixWorld(true);
  const handPos = new THREE.Vector3();
  hand.getWorldPosition(handPos);
  console.log(`${name} -> Hand pos: x=${handPos.x.toFixed(2)}, y=${handPos.y.toFixed(2)}, z=${handPos.z.toFixed(2)}`);
}

console.log('Target card contact point: x=1.35, y=1.20, z=11.80');
test('Test 1 (previous)', -1.28, 0.40, 0.48, -0.38, -0.28, 0.12);
test('Test 2 (natural reach forward-right)', 0.15, 0.95, 0.45, 0.1, -0.25, -0.55);
test('Test 3 (extended handshake)', 0.20, 1.10, 0.35, 0.0, -0.15, -0.45);
test('Test 4 (direct to card)', 0.10, 1.25, 0.50, 0.0, 0.10, -0.30);

