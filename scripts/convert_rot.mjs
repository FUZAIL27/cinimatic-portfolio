import * as THREE from 'three';

const qUp = new THREE.Quaternion(-0.1235, -0.4738, -0.0782, 0.8683);
const eUp = new THREE.Euler().setFromQuaternion(qUp);
console.log('UpperArm Rest Euler (XYZ):', 'x=', eUp.x.toFixed(3), 'y=', eUp.y.toFixed(3), 'z=', eUp.z.toFixed(3));

const qFore = new THREE.Quaternion(0, 0, -0.1796, 0.9837);
const eFore = new THREE.Euler().setFromQuaternion(qFore);
console.log('Forearm Rest Euler (XYZ):', 'x=', eFore.x.toFixed(3), 'y=', eFore.y.toFixed(3), 'z=', eFore.z.toFixed(3));

