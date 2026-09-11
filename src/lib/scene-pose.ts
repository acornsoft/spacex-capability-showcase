import { clamp01, lerp, range, smootherstep } from '@/lib/math'

export type Vec3 = [number, number, number]

export type VehiclePart = 'hull' | 'fins' | 'engines' | 'legs' | 'raceway'

export type NarrativeBeat =
  | 'hero'
  | 'ascent'
  | 'precision'
  | 'reuse'
  | 'craft'
  | 'contact'

export type Shot = {
  at: number
  position: Vec3
  target: Vec3
  fov: number
  yaw: number
  tilt: number
  lift: number
  shiftX: number
  scale: number
  engine: number
  legs: number
  grid: number
  horizon: number
  bloom: number
}

export const SHOTS: readonly Shot[] = [
  {
    at: 0,
    position: [6.85, 2.55, 3.45],
    target: [0.35, 0.05, 0],
    fov: 32,
    yaw: 0.38,
    tilt: 0.1,
    lift: 0.05,
    shiftX: 0.45,
    scale: 1,
    engine: 0.42,
    legs: 0.12,
    grid: 0,
    horizon: 0,
    bloom: 0.38,
  },
  {
    at: 0.07,
    position: [6.85, 2.55, 3.45],
    target: [0.35, 0.05, 0],
    fov: 32,
    yaw: 0.38,
    tilt: 0.1,
    lift: 0.05,
    shiftX: 0.45,
    scale: 1,
    engine: 0.42,
    legs: 0.12,
    grid: 0,
    horizon: 0,
    bloom: 0.38,
  },
  {
    at: 0.12,
    position: [2.55, 1.05, 3.35],
    target: [0.35, 0.45, 0],
    fov: 24,
    yaw: 0.48,
    tilt: 0.06,
    lift: 0.08,
    shiftX: 0.35,
    scale: 1,
    engine: 0.22,
    legs: 0.1,
    grid: 0,
    horizon: 0,
    bloom: 0.22,
  },
  {
    at: 0.18,
    position: [1.85, -1.55, 3.05],
    target: [0.2, -1.75, 0],
    fov: 30,
    yaw: 0.22,
    tilt: -0.08,
    lift: 0.2,
    shiftX: 0.2,
    scale: 1,
    engine: 0.92,
    legs: 0.08,
    grid: 0,
    horizon: 0,
    bloom: 0.82,
  },
  {
    at: 0.24,
    position: [2.15, 0.15, 8.4],
    target: [0.05, 2.35, 0],
    fov: 42,
    yaw: 0.12,
    tilt: 0.04,
    lift: 1.45,
    shiftX: 0.1,
    scale: 1,
    engine: 1,
    legs: 0.05,
    grid: 0,
    horizon: 0.12,
    bloom: 0.9,
  },
  {
    at: 0.32,
    position: [2.15, 0.15, 8.4],
    target: [0.05, 2.35, 0],
    fov: 42,
    yaw: 0.12,
    tilt: 0.04,
    lift: 1.55,
    shiftX: 0.1,
    scale: 1,
    engine: 1,
    legs: 0.05,
    grid: 0,
    horizon: 0.12,
    bloom: 0.85,
  },
  {
    at: 0.38,
    position: [-5.65, 2.35, 4.45],
    target: [0.15, 0.85, 0],
    fov: 30,
    yaw: 1.15,
    tilt: 0.1,
    lift: 0.45,
    shiftX: 0,
    scale: 1,
    engine: 0.28,
    legs: 0.1,
    grid: 0,
    horizon: 0.2,
    bloom: 0.32,
  },
  {
    at: 0.44,
    position: [-1.65, 1.55, 2.15],
    target: [0.12, 1.32, 0],
    fov: 22,
    yaw: 1.45,
    tilt: 0.02,
    lift: 0.2,
    shiftX: 0,
    scale: 1,
    engine: 0.14,
    legs: 0.12,
    grid: 0,
    horizon: 0,
    bloom: 0.18,
  },
  {
    at: 0.5,
    position: [-1.65, 1.55, 2.15],
    target: [0.12, 1.32, 0],
    fov: 22,
    yaw: 1.55,
    tilt: 0.02,
    lift: 0.2,
    shiftX: 0,
    scale: 1,
    engine: 0.14,
    legs: 0.12,
    grid: 0,
    horizon: 0,
    bloom: 0.18,
  },
  {
    at: 0.57,
    position: [2.65, 6.35, 4.55],
    target: [0.05, 0.05, 0],
    fov: 34,
    yaw: 0.38,
    tilt: 0.05,
    lift: -0.85,
    shiftX: 0.1,
    scale: 1,
    engine: 0.58,
    legs: 1,
    grid: 1,
    horizon: 1,
    bloom: 0.48,
  },
  {
    at: 0.66,
    position: [2.65, 6.35, 4.55],
    target: [0.05, 0.05, 0],
    fov: 34,
    yaw: 0.42,
    tilt: 0.05,
    lift: -0.95,
    shiftX: 0.1,
    scale: 1,
    engine: 0.5,
    legs: 1,
    grid: 1,
    horizon: 1,
    bloom: 0.42,
  },
  {
    at: 0.76,
    position: [8.15, 3.15, 5.65],
    target: [4.4, 2.05, 0],
    fov: 36,
    yaw: 1.05,
    tilt: 0.08,
    lift: 0.35,
    shiftX: 3.35,
    scale: 0.58,
    engine: 0.12,
    legs: 0.35,
    grid: 0.15,
    horizon: 0.2,
    bloom: 0.2,
  },
  {
    at: 1,
    position: [4.85, 2.15, 7.45],
    target: [1.85, 1.05, 0],
    fov: 32,
    yaw: 0.7,
    tilt: 0.1,
    lift: 0.25,
    shiftX: 1.7,
    scale: 0.72,
    engine: 0.18,
    legs: 0.2,
    grid: 0,
    horizon: 0.1,
    bloom: 0.28,
  },
] as const

function lerpShot(a: Shot, b: Shot, t: number): Shot {
  const s = smootherstep(t)
  return {
    at: lerp(a.at, b.at, s),
    position: [
      lerp(a.position[0], b.position[0], s),
      lerp(a.position[1], b.position[1], s),
      lerp(a.position[2], b.position[2], s),
    ],
    target: [
      lerp(a.target[0], b.target[0], s),
      lerp(a.target[1], b.target[1], s),
      lerp(a.target[2], b.target[2], s),
    ],
    fov: lerp(a.fov, b.fov, s),
    yaw: lerp(a.yaw, b.yaw, s),
    tilt: lerp(a.tilt, b.tilt, s),
    lift: lerp(a.lift, b.lift, s),
    shiftX: lerp(a.shiftX, b.shiftX, s),
    scale: lerp(a.scale, b.scale, s),
    engine: lerp(a.engine, b.engine, s),
    legs: lerp(a.legs, b.legs, s),
    grid: lerp(a.grid, b.grid, s),
    horizon: lerp(a.horizon, b.horizon, s),
    bloom: lerp(a.bloom, b.bloom, s),
  }
}

export function shotAt(progress: number): Shot {
  const p = clamp01(progress)
  const first = SHOTS[0]
  const last = SHOTS[SHOTS.length - 1]
  if (p <= first.at) return first
  if (p >= last.at) return last

  for (let i = 0; i < SHOTS.length - 1; i += 1) {
    const a = SHOTS[i]
    const b = SHOTS[i + 1]
    if (p >= a.at && p <= b.at) {
      return lerpShot(a, b, range(p, a.at, b.at))
    }
  }

  return last
}

export function beatAt(progress: number): NarrativeBeat {
  const p = clamp01(progress)
  if (p < 0.16) return 'hero'
  if (p < 0.36) return 'ascent'
  if (p < 0.54) return 'precision'
  if (p < 0.7) return 'reuse'
  if (p < 0.88) return 'craft'
  return 'contact'
}

export function beatFocus(beat: NarrativeBeat): VehiclePart | null {
  switch (beat) {
    case 'hero':
      return null
    case 'ascent':
      return 'engines'
    case 'precision':
      return 'fins'
    case 'reuse':
      return 'legs'
    case 'craft':
      return null
    case 'contact':
      return null
    default: {
      const _exhaustive: never = beat
      return _exhaustive
    }
  }
}

export function chapterPart(id: string): VehiclePart | null {
  switch (id) {
    case 'ascent':
      return 'engines'
    case 'precision':
      return 'fins'
    case 'reuse':
      return 'legs'
    case 'craft':
      return 'hull'
    default:
      return null
  }
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${String(value)}`)
}
