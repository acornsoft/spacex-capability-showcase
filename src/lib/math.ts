export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

export function smoothstep(t: number): number {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

export function smootherstep(t: number): number {
  const x = clamp01(t)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

export function range(progress: number, start: number, end: number): number {
  if (end === start) return progress >= end ? 1 : 0
  return clamp01((progress - start) / (end - start))
}

export function remap(
  progress: number,
  start: number,
  end: number,
  from: number,
  to: number,
): number {
  return lerp(from, to, smoothstep(range(progress, start, end)))
}
