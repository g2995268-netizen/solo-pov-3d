import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

export type PhoneState = {
  mode: "idle" | "incoming" | "playing" | "sent";
  line: string;
};

export const phoneStateAt = (t: number): PhoneState => {
  if (t < 17.03) return { mode: "idle", line: "" };
  if (t < 48.62) return { mode: "incoming", line: "" };
  if (t < 50.71) return { mode: "playing", line: "" };
  if (t < 51.35) return { mode: "playing", line: "НЕ" };
  if (t < 52.05) return { mode: "playing", line: "НЕ ПОДНИМАЙСЯ" };
  if (t < 53.81) return { mode: "playing", line: "НЕ ПОДНИМАЙСЯ\nОБРАТНО" };
  return { mode: "sent", line: "НЕ ПОДНИМАЙСЯ\nОБРАТНО" };
};

export const phoneTexture = (state: PhoneState) => {
  const key = `${state.mode}|${state.line}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d");
  ctx.fillStyle = "#141414";
  ctx.fillRect(0, 0, 512, 1024);
  roundRect(ctx, 28, 36, 456, 952, 36);
  ctx.fillStyle = "#1c1c1e";
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = "#8e8e93";
  ctx.font = "600 34px Inter, sans-serif";
  ctx.fillText("голосовое", 256, 120);

  if (state.mode === "playing" || state.mode === "sent") {
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 58px Inter, sans-serif";
    const lines = state.line.split("\n").filter(Boolean);
    lines.forEach((line, i) => {
      ctx.fillText(line, 256, 280 + i * 78);
    });
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 96px Inter, sans-serif";
    ctx.fillText("Я", 256, 250);
    ctx.fillStyle = "#FFB347";
    ctx.font = "700 40px Inter, sans-serif";
    ctx.fillText("11 мин", 256, 330);
  }

  if (state.mode === "incoming") {
    ctx.fillStyle = "#2ECC71";
    ctx.beginPath();
    ctx.arc(256, 520, 64, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(238, 484);
    ctx.lineTo(296, 520);
    ctx.lineTo(238, 556);
    ctx.closePath();
    ctx.fill();
  }

  if (state.mode === "sent") {
    roundRect(ctx, 70, 470, 372, 86, 22);
    ctx.fillStyle = "#FF4D4D";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 34px Inter, sans-serif";
    ctx.fillText("ОТПРАВЛЕНО", 256, 524);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  cache.set(key, tex);
  return tex;
};
