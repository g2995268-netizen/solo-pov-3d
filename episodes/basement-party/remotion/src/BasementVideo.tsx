import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { World } from "./scene/World";
import { Subtitles } from "./Subtitles";

export const BasementVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: "#14110f" }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ fov: 94, near: 0.08, far: 30, position: [0, 1.65, 3.42] }}
      >
        <World t={t} />
      </ThreeCanvas>
      <Subtitles />
      <Audio src={staticFile("narration.mp3")} />
    </AbsoluteFill>
  );
};
