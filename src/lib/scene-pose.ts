import { clamp01, lerp, range, remap, smoothstep } from '@/lib/math'

export type Vec3 = [number, number, number]

export type CameraKeyframe = {
  at: number
  position: Vec3
  target: Vec3
  fov: number
}

export type ScenePose = {
  engine: number
  legs: number
  grid: number
  rocketX: number
  rocketY: number
  rocketTilt: number
  rocketYaw: number
  rocketScale: number
}

export const CAMERA_KEYS: readonly CameraKeyframe[] = [
  { at: 0, position: [3.05, 1.85, 3.45], target: [0.2, 0.25, 0], fov: 30 },
  { at: 0.16, position: [1.55, 0.25, 6.4], target: [0.1, 1.65, 0], fov: 32 },
  { at: 0.34, position: [-3.35, 1.55, 2.95], target: [0.1, 0.75, 0], fov: 28 },
  { at: 0.54, position: [2.35, 4.85, 3.75], target: [0.05, 0.05, 0], fov: 32 },
  { at: 0.74, position: [7.6, 2.85, 4.4], target: [4.2, 2.2, 0], fov: 34 },
  { at: 1, position: [4.15, 1.65, 5.8], target: [2.2, 0.95, 0], fov: 32 },
] as const

function sampleKeys(progress: number, keys: readonly CameraKeyframe[]): CameraKeyframe {
  const p = clamp01(progress)
  if (p <= keys[0].at) return keys[0]
  const last = keys[keys.length - 1]
  if (p >= last.at) return last

  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i]
    const b = keys[i + 1]
    if (p >= a.at && p <= b.at) {
      const t = smoothstep(range(p, a.at, b.at))
      return {
        at: p,
        position: [
          lerp(a.position[0], b.position[0], t),
          lerp(a.position[1], b.position[1], t),
          lerp(a.position[2], b.position[2], t),
        ],
        target: [
          lerp(a.target[0], b.target[0], t),
          lerp(a.target[1], b.target[1], t),
          lerp(a.target[2], b.target[2], t),
        ],
        fov: lerp(a.fov, b.fov, t),
      }
    }
  }

  return last
}

export function cameraAt(progress: number): CameraKeyframe {
  return sampleKeys(progress, CAMERA_KEYS)
}

export function poseAt(progress: number, time: number): ScenePose {
  const p = clamp01(progress)

  const ascent = range(p, 0.06, 0.22)
  const cruise = range(p, 0.22, 0.4)
  const precision = range(p, 0.34, 0.5)
  const landing = range(p, 0.5, 0.66)

  const heroIdle = (1 - range(p, 0, 0.1)) * 0.38
  const engine = clamp01(
    heroIdle +
      ascent * 1.0 * (1 - cruise * 0.28) * (1 - precision * 0.55) +
      landing * 0.62 +
      (1 - landing) * 0.08 * range(p, 0.66, 1),
  )

  return {
    engine,
    legs: remap(p, 0.5, 0.64, 0, 1),
    grid: remap(p, 0.48, 0.6, 0, 1) * (1 - remap(p, 0.78, 0.95, 0, 0.7)),
    rocketX: remap(p, 0.66, 0.78, 0, 3.4),
    rocketY: remap(p, 0.08, 0.28, 0, 1.15) - remap(p, 0.48, 0.64, 0, 1.35) + remap(p, 0.7, 0.9, 0, 0.35),
    rocketTilt: remap(p, 0.3, 0.42, 0, 0.16) - remap(p, 0.5, 0.62, 0, 0.12),
    rocketYaw: time * 0.12 + p * Math.PI * 1.05,
    rocketScale: remap(p, 0.66, 0.8, 1, 0.58),
  }
}

export type NarrativeBeat =
  | 'hero'
  | 'ascent'
  | 'precision'
  | 'reuse'
  | 'craft'
  | 'contact'

export function beatAt(progress: number): NarrativeBeat {
  const p = clamp01(progress)
  if (p < 0.12) return 'hero'
  if (p < 0.32) return 'ascent'
  if (p < 0.5) return 'precision'
  if (p < 0.68) return 'reuse'
  if (p < 0.88) return 'craft'
  return 'contact'
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${String(value)}`)
}
