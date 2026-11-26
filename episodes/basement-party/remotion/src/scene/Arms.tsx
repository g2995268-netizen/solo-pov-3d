import React from "react";
import * as THREE from "three";
import { Solid } from "./materials";
import { phoneStateAt, phoneTexture } from "./phoneTexture";

type Vec3 = [number, number, number];

const smooth = (t: number, a: number, b: number) => {
  if (t <= a) return 0;
  if (t >= b) return 1;
  const u = (t - a) / (b - a);
  return u * u * (3 - 2 * u);
};

const mix = (a: number, b: number, u: number) => a + (b - a) * u;

const lerp3 = (a: Vec3, b: Vec3, u: number): Vec3 => [
  mix(a[0], b[0], u),
  mix(a[1], b[1], u),
  mix(a[2], b[2], u),
];

const Limb: React.FC<{ from: Vec3; to: Vec3 }> = ({ from, to }) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const mid = start.clone().lerp(end, 0.5);
  const dir = end.clone().sub(start);
  const length = Math.max(dir.length(), 0.05);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize(),
  );
  return (
    <group position={mid.toArray()} quaternion={quat}>
      <Solid color="#2ECC71" flat>
        <cylinderGeometry args={[0.062, 0.072, length, 16]} />
      </Solid>
    </group>
  );
};

export const Arms: React.FC<{ t: number }> = ({ t }) => {
  const reach = smooth(t, 5.6, 6.5) * (1 - smooth(t, 8.2, 9.0));
  const switchReach = smooth(t, 9.8, 10.4) * (1 - smooth(t, 12.8, 13.6));
  const phoneLook = smooth(t, 16.4, 17.3) * (1 - smooth(t, 21.4, 22.5));
  const phoneBack = smooth(t, 39.7, 40.5) * (1 - smooth(t, 56.59, 56.79));
  const rail = smooth(t, 56.59, 56.95);
  const look = Math.max(phoneLook, phoneBack);

  const leftHand = lerp3(
    lerp3([-0.26, -0.18, -0.46], [-0.06, -0.06, -0.55], Math.max(reach, switchReach)),
    [-0.14, -0.1, -0.48],
    rail,
  );
  const rightHand = lerp3(
    [0.24, -0.16, -0.44],
    [0.0, -0.06, -0.34],
    look,
  );
  const screen = phoneTexture(phoneStateAt(t));

  return (
    <group>
      <Limb from={[-0.46, -0.46, -0.24]} to={leftHand} />
      <Solid color="#f3c7a4" position={leftHand} flat>
        <sphereGeometry args={[0.064, 18, 14]} />
      </Solid>

      <Limb from={[0.48, -0.44, -0.22]} to={rightHand} />
      <Solid color="#f3c7a4" position={rightHand} flat>
        <sphereGeometry args={[0.064, 18, 14]} />
      </Solid>
      <group position={[rightHand[0] + 0.01, rightHand[1] + 0.01, rightHand[2] + 0.04]}>
        <Solid color="#161616" flat>
          <boxGeometry args={[0.12, 0.22, 0.014]} />
        </Solid>
        <mesh position={[0, 0, 0.009]}>
          <planeGeometry args={[0.104, 0.19]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
        <mesh position={[0.045, 0.08, 0.02]}>
          <sphereGeometry args={[0.012, 10, 8]} />
          <meshBasicMaterial color="#fff6d8" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

export const lookQuaternion = (eye: THREE.Vector3, target: THREE.Vector3) => {
  const matrix = new THREE.Matrix4().lookAt(
    eye,
    target,
    new THREE.Vector3(0, 1, 0),
  );
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
};
