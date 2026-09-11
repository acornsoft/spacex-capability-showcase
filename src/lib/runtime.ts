export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

export function detectCoarsePointer(): boolean {
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
}

export function detectReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function starBudget(isCoarse: boolean): number {
  return isCoarse ? 700 : 3200
}

export function pixelRatioBudget(isCoarse: boolean): [number, number] {
  return isCoarse ? [1, 1.25] : [1, 1.75]
}
