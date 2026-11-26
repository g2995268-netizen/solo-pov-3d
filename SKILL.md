---
name: solo-pov-3d
description: "Create 45-75s 3D Solo-POV psychological thriller shorts with internal monologue only, thick black outline toon style, wide FOV, green POV arms. Uses Remotion + @remotion/three for timeline-driven animation. Strict two-stage ElevenLabs workflow. Use for horror, crime, creepy, or claustrophobic first-person stories."
type: workflow
lifecycle: active
---

# 3D Solo-POV Internal Monologue Thriller (Remotion)

Produce short first-person videos in the measured thick-outline toon style. One voice only (internal monologue). No speaking faces. Strong presence, slow dread, visual clues timed exactly to spoken words.

**Read `references/STYLE_BIBLE.md` before any production work.**

## Tech Stack
- **Remotion** — main composition, timeline, sequences, final render
- **@remotion/three + Three.js** — 3D scene, camera, materials, lighting
- **@react-three/drei** — helpers, Outlines, environment
- **React** — components (`PovArms`, `Room`, `Clue`, `PhoneLight`, etc.)
- **Node.js** — orchestration, data prep, word timing alignment
- **Python 3 + ffmpeg** — audio analysis (`ffprobe`), frame extraction, QA, loudness
- **ElevenLabs** — single narrator voice
- **sfx-kit** (user GitHub fork) — sound effects

## Pipeline (two stages, hard stop between them)

### Stage 1 — Pre-production (stop and wait for voice)
1. Confirm genre + archetype.
2. Write monologue using `templates/SCRIPT_template.md` (Normal → Anomaly → Escalation → Realization → Twist). Mark `[pause]` and word-level visual hits.
3. Create Shot List: camera moves, hand targets, clues tied to specific words.
4. Create SFX map.
5. **STOP.** Output script + shot list + SFX map. User voices in ElevenLabs → `./assets/voice/`. Do not continue until voice files exist.

### Stage 2 — Production (after voice arrives)
1. Measure voice with `ffprobe`. Build word-level or paragraph timing table.
2. Create Remotion composition:
   - Vertical 1080×1920 (or 1440×2560), 30 fps
   - Camera: ~105° FOV, eye height 1.65 m
   - Toon materials (≤3 bands) + thick black Outlines (7–9 px at 1080p)
   - Green POV arms (`#2ECC71`) always in lower third, simple target-driven movement
   - Lighting: Directional/Spot + optional phone/flashlight cone with shadows
3. Drive all camera and hand animation from the timing table (tolerance ±4 frames to key words).
4. Pull SFX from user’s `sfx-kit` fork. Map and note missing sounds.
5. Render with Remotion. Mux audio in FFmpeg (voice + SFX + subtle drone, -14 LUFS).
6. Generate or burn subtitles (bold + black stroke, accent on dread words).
7. Deliver MP4 + final shot list + subtitle file + SFX report.

## Visual Contracts (must match STYLE_BIBLE)
- Green POV arms always visible in lower 28–34%
- Thick black outline on all geometry
- Long holds on clues (1.8–4.2 s)
- Subtitles: 2–4 words, accent colors on key words
- No other speaking characters or lip-sync

## Checkpoints
- After Stage 1: user approves script and pauses.
- After voice: retime everything before any Remotion work.
- After first stills: verify outline thickness, arm color, FOV, arm position against STYLE_BIBLE.
- Final: twist lands in last 5–8 s and is readable without audio.

## Output
- `final.mp4`
- `shot_list.json` / md
- `subtitles.srt` (or burned-in)
- `sfx_report.md`

Do not invent dialogue for other characters. Do not break the one-voice rule.
