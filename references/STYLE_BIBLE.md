# Solo-POV 3D Style Bible
Measured from user-supplied reference frames (thick-outline toon POV, green arms, wide FOV).

## Optics
- FOV: 102–108° (stereographic approximation: edge lines bend ~8–12°, center remains readable)
- Camera height: 1.62–1.68 m (eye level)
- Near plane: 0.1 m, far: 30 m
- Slight barrel distortion shader recommended on edges only

## POV Arms
- Color: #2ECC71 (bright green)
- Geometry: Cylinder radius 0.045 m (forearm), 0.038 m (hand), length ~0.55 m
- Outline thickness: 7–9 px at 1080p (scale with resolution)
- Position: Always visible in lower 28–34% of frame
- IK targets: door handle, phone, wall, mug, floor

## Materials & Outline
- Toon shading: 3 bands max (lit / mid / shadow)
- Outline: black #000000, constant thickness in screen space or near-constant
- Characters (when visible): big head (h/w ≈ 0.92), white sclera #F8F8F8, black pupil, thick outline
- Environments: desaturated (wall #8A8A8A–#A0A0A0, floor #6B5B4F–#7A6A5E)

## Camera Language (measured patterns)
- DEAD_HOLD: 1.8–4.2 s on key clues (mug, door gap, footprints, phone screen)
- SMOOTH_PAN: 0.6–1.4 s, ease-in-out, max angular speed ~25°/s
- FAST_SNAP: < 0.25 s, used max 1–2 times per video
- Subtle head bob only on walking (amplitude < 2 cm)

## Subtitles
- Font: bold sans-serif (Inter, Montserrat or system bold)
- Size: 48–56 px at 1080p
- Stroke: 4–6 px black
- Max 4 words per line
- Accent colors for dread words: #FF4D4D, #FFB347, #FF69B4
- Position: y = 78–82% of frame height

## Lighting
- Key: soft overhead or window, color temperature 4500–5500 K
- Fill: very low (0.15–0.25)
- Phone/flashlight: cone light, warm #FFE4B5, intensity falls off sharply
- Shadow bias tuned to avoid acne on simple geometry
