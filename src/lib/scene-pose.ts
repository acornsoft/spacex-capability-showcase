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
  rocketY: number
  rocketTilt: number
  rocketYaw: number
}

export const CAMERA_KEYS: readonly CameraKeyframe[] = [
  { at: 0, position: [3.35, 1.35, 5.55], target: [0.35, 0.95, 0], fov: 40 },
  { at: 0.16, position: [1.15, 0.15, 8.4], target: [0, 2.15, 0], fov: 36 },
  { at: 0.34, position: [-4.6, 2.55, 3.15], target: [0.05, 1.15, 0], fov: 30 },
  { at: 0.54, position: [2.55, 6.2, 4.15], target: [0, 0.35, 0], fov: 34 },
  { at: 0.74, position: [5.4, 1.55, 7.05], target: [-0.15, 1.05, 0], fov: 38 },
  { at: 1, position: [0.9, 2.2, 9.2], target: [0, 1.15, 0], fov: 34 },
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

  const engine = clamp01(
    ascent * 1.0 * (1 - cruise * 0.28) * (1 - precision * 0.55) + landing * 0.62 + (1 - landing) * 0.08 * range(p, 0.66, 1),
  )

  return {
    engine,
    legs: remap(p, 0.5, 0.64, 0, 1),
    grid: remap(p, 0.48, 0.6, 0, 1) * (1 - remap(p, 0.78, 0.95, 0, 0.7)),
    rocketY: remap(p, 0.08, 0.28, 0, 1.35) - remap(p, 0.48, 0.64, 0, 1.55) + remap(p, 0.7, 0.9, 0, 0.55),
    rocketTilt: remap(p, 0.3, 0.42, 0, 0.18) - remap(p, 0.5, 0.62, 0, 0.14),
    rocketYaw: time * 0.08 + p * Math.PI * 1.15,
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
