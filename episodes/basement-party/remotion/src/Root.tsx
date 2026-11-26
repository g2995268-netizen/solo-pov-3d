import { Composition } from "remotion";
import { BasementVideo } from "./BasementVideo";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "./timing";

export const RemotionRoot = () => {
  return (
    <Composition
      id="BasementParty"
      component={BasementVideo}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
