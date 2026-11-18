import * as THREE from 'three';

const qBase = new THREE.Quaternion(-0.1356, -0.4690, -0.0848, 0.8685);
const bone = new THREE.Bone();
bone.quaternion.copy(qBase);

console.log('Base quat:', bone.quaternion);

// If we rotate on local axes:
// Let's test rotating around local Z (lifting away from torso) and local Y (swinging forward)
const boneTest1 = bone.clone();
boneTest1.rotateZ(0.6); // lift outward
boneTest1.rotateY(0.8); // swing forward
console.log('Rotated quat 1:', boneTest1.quaternion);

const vForward = new THREE.Vector3(1, 0, 0).applyQuaternion(boneTest1.quaternion);
console.log('Arm direction vector after rotation:', vForward);

