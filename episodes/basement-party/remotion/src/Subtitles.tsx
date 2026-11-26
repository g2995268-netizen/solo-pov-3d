import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CUES } from "./timing";

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cue = CUES.find((item) => t >= item.start && t < item.end);
  if (!cue) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 48,
        right: 48,
        top: "76%",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "Inter, 'DejaVu Sans', sans-serif",
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: 52,
          lineHeight: 1.15,
          textAlign: "center",
          color: "#ffffff",
          textShadow: [
            "-4px -4px 0 #000",
            "4px -4px 0 #000",
            "-4px 4px 0 #000",
            "4px 4px 0 #000",
            "0 4px 0 #000",
            "0 -4px 0 #000",
            "4px 0 0 #000",
            "-4px 0 0 #000",
            "0 6px 0 #000",
          ].join(", "),
        }}
      >
        {cue.words.map((word, index) => (
          <span key={`${word.word}-${index}`} style={{ color: word.color ?? "#ffffff" }}>
            {word.word}
            {index < cue.words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};
