import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { brickMap, floorMap, Solid } from "./materials";
import { Arms } from "./Arms";
import { sentence } from "../timing";

const STEPS = 9;
const STEP_H = 0.16;
const STEP_D = 0.29;
const STAIR_Z = 2.85;
const LANDING_Y = STEPS * STEP_H;

type Vec3 = [number, number, number];

const smooth = (t: number, a: number, b: number) => {
  if (t <= a) return 0;
  if (t >= b) return 1;
  const u = (t - a) / (b - a);
  return u * u * (3 - 2 * u);
};

const mix3 = (a: Vec3, b: Vec3, u: number): Vec3 => [
  a[0] + (b[0] - a[0]) * u,
  a[1] + (b[1] - a[1]) * u,
  a[2] + (b[2] - a[2]) * u,
];

type LookKey = { t: number; at: Vec3; snap?: boolean };
type PosKey = { t: number; p: Vec3 };

const sample = (t: number, keys: LookKey[]): Vec3 => {
  if (t <= keys[0].t) return keys[0].at;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b.t) {
      const u = (t - a.t) / Math.max(0.0001, b.t - a.t);
      const e = b.snap ? u : u * u * (3 - 2 * u);
      return mix3(a.at, b.at, e);
    }
  }
  return keys[keys.length - 1].at;
};

const samplePos = (t: number, keys: PosKey[]): Vec3 => {
  if (t <= keys[0].t) return keys[0].p;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b.t) {
      const u = (t - a.t) / Math.max(0.0001, b.t - a.t);
      const e = u * u * (3 - 2 * u);
      return mix3(a.p, b.p, e);
    }
  }
  return keys[keys.length - 1].p;
};

const CameraRig: React.FC<{ eye: Vec3; at: Vec3; phone: number; t: number }> = ({
  eye,
  at,
  phone,
  t,
}) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  camera.fov = 94;
  camera.near = 0.08;
  camera.far = 30;
  camera.up.set(0, 1, 0);
  camera.position.set(eye[0], eye[1], eye[2]);
  camera.lookAt(at[0], at[1], at[2]);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  const target = useMemo(() => new THREE.Object3D(), []);
  return (
    <group position={[eye[0], eye[1], eye[2]]} quaternion={camera.quaternion}>
      <primitive object={target} position={[0.04, -0.22, -2.2]} />
      <spotLight
        position={[0.06, -0.02, -0.08]}
        target={target}
        intensity={phone * 14}
        angle={0.72}
        penumbra={0.95}
        distance={8}
        decay={2}
        color="#ffe4b5"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.001}
      />
      <Arms t={t} />
    </group>
  );
};

const wordStart = (id: string, word: string) => {
  const hit = sentence(id).words.find((item) => item.word.toLowerCase() === word.toLowerCase());
  return hit ? hit.start : sentence(id).start;
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const gasnet = wordStart("dies", "гаснет");
  const doorWord = sentence("door_open").start;
  const freezerWord = sentence("freezer_open").start;

  const bulb = 1 - smooth(t, gasnet, gasnet + 0.22);
  const phone = smooth(t, sentence("click").start, gasnet + 0.15);
  const door = (() => {
    const shut = smooth(t, gasnet, gasnet + 0.2);
    const reopen = smooth(t, doorWord, doorWord + 0.2);
    return 1 - shut + reopen;
  })();
  const freezer = smooth(t, freezerWord - 0.25, freezerWord + 0.05);
  const voidBeyond = t >= 50;

  const looks: LookKey[] = [
    { t: 0, at: [0, 2.15, 0.35] },
    { t: sentence("down").start, at: [0.05, 1.05, 1.4] },
    { t: sentence("ice").start, at: [1.25, 1.05, 4.2] },
    { t: sentence("light_on").start, at: [0.05, 2.45, 3.15] },
    { t: sentence("reach").start, at: [1.35, 1.2, 4.25] },
    { t: gasnet, at: [0.9, 1.45, 3.4] },
    { t: sentence("switch").start, at: [-1.2, 1.4, 2.95] },
    { t: sentence("door_shut").start, at: [0, 2.05, 0.4] },
    { t: sentence("buzz").start, at: [0.28, 1.05, 2.9] },
    { t: sentence("voice").start, at: [0.2, 0.95, 2.85] },
    { t: sentence("left_open").end, at: [0.12, 2.0, 0.55] },
    { t: sentence("gap").start, at: [0, 1.7, 0.7] },
    { t: sentence("prints").start, at: [0.12, 0.12, 2.65] },
    { t: sentence("go_down").start, at: [0.02, 0.1, 3.15] },
    { t: freezerWord, at: [1.15, 0.55, 3.05] },
    { t: sentence("second").start, at: [1.15, 0.42, 3.05] },
    { t: sentence("not_stranger").start, at: [0.22, 0.95, 2.85] },
    { t: sentence("play").start, at: [0.16, 0.88, 2.75] },
    { t: doorWord, at: [0.16, 0.88, 2.75] },
    { t: doorWord + 0.2, at: [0, 1.95, 0.25], snap: true },
    { t: 58.93, at: [0, 1.9, 0.2] },
  ];

  const positions: PosKey[] = [
    { t: 0, p: [0, 1.65, 3.42] },
    { t: sentence("ice").start, p: [0.2, 1.65, 3.55] },
    { t: sentence("switch").start, p: [-0.05, 1.65, 3.35] },
    { t: sentence("prints").start, p: [0.05, 1.64, 3.48] },
    { t: freezerWord, p: [0.12, 1.65, 3.5] },
    { t: sentence("not_stranger").start, p: [0.08, 1.65, 3.42] },
    { t: 58.93, p: [0.05, 1.65, 3.38] },
  ];

  const at = sample(t, looks);
  let eye = samplePos(t, positions);
  if (t > sentence("down").start && t < gasnet) {
    eye = [eye[0], eye[1] + Math.sin(t * 8.5) * 0.012, eye[2]];
  }
  const brick = brickMap();
  brick.repeat.set(2.2, 1.6);

  return (
    <>
      <color attach="background" args={["#14110f"]} />
      <fog attach="fog" args={["#14110f", 5.5, 13]} />
      <CameraRig eye={eye} at={at} phone={phone} t={t} />
      <ambientLight intensity={0.32 + bulb * 0.2 + phone * 0.06} color="#f4efe6" />
      <pointLight
        position={[0, 2.7, 3.15]}
        intensity={bulb * 18}
        color="#fff1d6"
        distance={8}
        decay={2}
      />
      <pointLight
        position={[0, 2.15, -0.35]}
        intensity={door * (voidBeyond ? 0 : 26)}
        color="#ffb26b"
        distance={6}
        decay={2}
      />

      <Solid map={floorMap()} color="#ffffff" position={[0, 0, 2.4]} receiveShadow>
        <boxGeometry args={[6.2, 0.08, 8]} />
      </Solid>

      <Walls brick={brick} />
      <Stairs />
      <Door open={door} voidBeyond={voidBeyond} />
      <Bulb on={bulb} />
      <Switch />
      <Freezer open={freezer} />
      <Prints />
      <Shoes />
      <Rail />
      {door > 0.4 && !voidBeyond ? <Party /> : null}
      {door > 0.4 && voidBeyond ? <VoidHall /> : null}
    </>
  );
};

const Walls: React.FC<{ brick: THREE.Texture }> = ({ brick }) => {
  return (
    <group>
      <Solid map={brick} color="#ffffff" position={[-1.4, 1.8, 2.2]}>
        <boxGeometry args={[0.12, 3.6, 6.4]} />
      </Solid>
      <Solid map={brick} color="#ffffff" position={[1.4, 1.8, 2.2]}>
        <boxGeometry args={[0.12, 3.6, 6.4]} />
      </Solid>
      <Solid map={brick} color="#ffffff" position={[0, 3.6, 2.2]}>
        <boxGeometry args={[2.9, 0.1, 6.4]} />
      </Solid>
      <Solid color="#d9d3cb" position={[0, 1.5, 5.35]} outline>
        <boxGeometry args={[2.8, 3, 0.12]} />
      </Solid>
    </group>
  );
};

const Stairs: React.FC = () => {
  const steps = [];
  for (let i = 0; i < STEPS; i++) {
    const y = i * STEP_H + STEP_H / 2;
    const z = STAIR_Z - i * STEP_D - STEP_D / 2;
    steps.push(
      <Solid key={i} color={i % 2 ? "#c49a6a" : "#b88958"} position={[0, y, z]}>
        <boxGeometry args={[1.16, STEP_H, STEP_D]} />
      </Solid>,
    );
  }
  return (
    <group>
      {steps}
      <Solid color="#c9b39a" position={[0, LANDING_Y + 0.04, 0.15]}>
        <boxGeometry args={[1.5, 0.08, 1.1]} />
      </Solid>
    </group>
  );
};

const Door: React.FC<{ open: number; voidBeyond: boolean }> = ({ open, voidBeyond }) => {
  const angle = -1.45 * open;
  return (
    <group position={[0, LANDING_Y, 0.05]}>
      <Solid color="#efeae3" position={[-0.56, 1.0, 0]}>
        <boxGeometry args={[0.08, 2.05, 0.1]} />
      </Solid>
      <Solid color="#efeae3" position={[0.56, 1.0, 0]}>
        <boxGeometry args={[0.08, 2.05, 0.1]} />
      </Solid>
      <Solid color="#efeae3" position={[0, 2.02, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.1]} />
      </Solid>
      <group position={[-0.46, 0, 0]} rotation={[0, angle, 0]}>
        <Solid color={voidBeyond ? "#2a2624" : "#f3efe8"} position={[0.46, 1.0, 0]}>
          <boxGeometry args={[0.92, 1.95, 0.06]} />
        </Solid>
        <Solid color="#222" position={[0.86, 1.0, 0.05]}>
          <sphereGeometry args={[0.035, 10, 8]} />
        </Solid>
      </group>
    </group>
  );
};

const Bulb: React.FC<{ on: number }> = ({ on }) => {
  return (
    <group position={[0, 2.62, 3.15]}>
      <mesh>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshBasicMaterial color={on > 0.2 ? "#fff4cc" : "#6a645c"} toneMapped={false} />
      </mesh>
      <Solid color="#222" position={[0, 0.12, 0]} outline={false}>
        <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
      </Solid>
    </group>
  );
};

const Switch: React.FC = () => {
  return (
    <group position={[-1.32, 1.38, 3.05]}>
      <Solid color="#e7e1d8">
        <boxGeometry args={[0.04, 0.16, 0.1]} />
      </Solid>
      <Solid color="#222" position={[-0.03, -0.02, 0]}>
        <boxGeometry args={[0.02, 0.06, 0.03]} />
      </Solid>
    </group>
  );
};

const Freezer: React.FC<{ open: number }> = ({ open }) => {
  return (
    <group position={[1.15, 0, 3.05]}>
      <Solid color="#b7bcc2" flat position={[0, 0.42, 0]}>
        <boxGeometry args={[0.95, 0.84, 0.72]} />
      </Solid>
      <Solid color="#14181d" flat position={[0, 0.55, 0]}>
        <boxGeometry args={[0.72, 0.42, 0.5]} />
      </Solid>
      <group position={[0, 0.84, -0.34]} rotation={[-1.15 * open, 0, 0]}>
        <Solid color="#d0d4d8" flat position={[0, 0.04, 0.34]}>
          <boxGeometry args={[0.95, 0.08, 0.72]} />
        </Solid>
      </group>
      <group position={[0, 0.62, 0.02]} rotation={[-Math.PI / 2.4, 0, 0]}>
        <Solid color="#111" flat>
          <boxGeometry args={[0.12, 0.18, 0.012]} />
        </Solid>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.1, 0.15]} />
          <meshBasicMaterial color="#3a2458" />
        </mesh>
        <mesh position={[0.035, 0.05, 0.02]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshBasicMaterial color="#ff2a2a" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

const Prints: React.FC = () => {
  const spots: Vec3[] = [
    [0.22, 0.045, 2.7],
    [0.08, 0.045, 2.95],
    [0.18, 0.045, 3.18],
    [0.04, 0.045, 3.38],
  ];
  return (
    <group>
      {spots.map((position, i) => (
        <Solid key={i} color="#2c2826" position={position} rotation={[-Math.PI / 2, 0, 0.4]}>
          <circleGeometry args={[0.11, 14]} />
        </Solid>
      ))}
    </group>
  );
};

const Shoes: React.FC = () => {
  return (
    <group>
      <Solid color="#241c18" position={[-0.14, 0.06, 3.38]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.26]} />
      </Solid>
      <Solid color="#241c18" position={[0.16, 0.06, 3.4]} rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.26]} />
      </Solid>
    </group>
  );
};

const Rail: React.FC = () => {
  return (
    <Solid
      color="#6b4a32"
      position={[0.62, 1.15, 1.55]}
      rotation={[0.48, 0, 0]}
    >
      <cylinderGeometry args={[0.025, 0.025, 2.5, 8]} />
    </Solid>
  );
};

const Party: React.FC = () => {
  const bulbs = [-0.8, -0.4, 0, 0.4, 0.8];
  return (
    <group position={[0, 0, -0.7]}>
      <Solid color="#c9a27a" position={[0, LANDING_Y + 0.02, 0]} outline={false}>
        <boxGeometry args={[2.6, 0.04, 2.2]} />
      </Solid>
      <Solid color="#d8d0c6" position={[0, LANDING_Y + 1.3, -1]} outline={false}>
        <boxGeometry args={[2.6, 2.6, 0.08]} />
      </Solid>
      <mesh position={[0, LANDING_Y + 1.7, -0.2]}>
        <boxGeometry args={[2.2, 0.02, 0.02]} />
        <meshBasicMaterial color="#222" />
      </mesh>
      {bulbs.map((x, i) => (
        <mesh key={i} position={[x * 0.7, LANDING_Y + 1.62, -0.2]}>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshBasicMaterial color={i % 2 ? "#ffb703" : "#8ecae6"} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

const VoidHall: React.FC = () => {
  return (
    <mesh position={[0, 1.6, -1.1]}>
      <boxGeometry args={[2.2, 3.2, 1.6]} />
      <meshBasicMaterial color="#070605" />
    </mesh>
  );
};
