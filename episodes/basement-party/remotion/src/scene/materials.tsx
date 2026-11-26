import React from "react";
import { Outlines } from "@react-three/drei";
import * as THREE from "three";

let gradientTex: THREE.Texture | null = null;
let brickTex: THREE.Texture | null = null;
let floorTex: THREE.Texture | null = null;

export const toonGradient = () => {
  if (gradientTex) return gradientTex;
  const canvas = document.createElement("canvas");
  canvas.width = 3;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d");
  ctx.fillStyle = "#7a7a7a";
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = "#a8a8a8";
  ctx.fillRect(1, 0, 1, 1);
  ctx.fillStyle = "#cfcfcf";
  ctx.fillRect(2, 0, 1, 1);
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  gradientTex = tex;
  return tex;
};

export const brickMap = () => {
  if (brickTex) return brickTex;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d");
  ctx.fillStyle = "#9a938c";
  ctx.fillRect(0, 0, 256, 256);
  const bw = 64;
  const bh = 32;
  for (let row = 0; row < 8; row++) {
    const offset = row % 2 === 0 ? 0 : bw / 2;
    for (let col = -1; col < 5; col++) {
      const x = col * bw + offset + 3;
      const y = row * bh + 3;
      const shade = 196 + ((row * 3 + col * 5) % 18);
      ctx.fillStyle = `rgb(${shade},${shade - 6},${shade - 12})`;
      ctx.fillRect(x, y, bw - 6, bh - 6);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  brickTex = tex;
  return tex;
};

export const floorMap = () => {
  if (floorTex) return floorTex;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d");
  ctx.fillStyle = "#7a736c";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 700; i++) {
    const v = 90 + ((i * 37) % 70);
    ctx.fillStyle = `rgba(${v},${v - 4},${v - 8},0.45)`;
    ctx.fillRect((i * 53) % 256, (i * 97) % 256, 2, 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  floorTex = tex;
  return tex;
};

type SolidProps = {
  color?: string;
  map?: THREE.Texture;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  outline?: boolean;
  flat?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  children: React.ReactNode;
};

export const Solid: React.FC<SolidProps> = ({
  color = "#ffffff",
  map,
  outline = true,
  flat = false,
  castShadow = true,
  receiveShadow = true,
  children,
  ...rest
}) => {
  return (
    <mesh castShadow={castShadow} receiveShadow={receiveShadow} {...rest}>
      {children}
      {flat ? (
        <meshBasicMaterial color={color} />
      ) : (
        <meshToonMaterial color={color} map={map} gradientMap={toonGradient()} />
      )}
      {outline ? (
        <Outlines thickness={8} color="#000000" screenspace={false} />
      ) : null}
    </mesh>
  );
};
