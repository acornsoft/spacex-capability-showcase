import { useSyncExternalStore } from 'react'
import { detectCoarsePointer, detectReducedMotion, detectWebGL } from '@/lib/runtime'

function subscribeMedia(query: string, onStoreChange: () => void): () => void {
  const media = window.matchMedia(query)
  media.addEventListener('change', onStoreChange)
  return () => media.removeEventListener('change', onStoreChange)
}

export function useCoarsePointer(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribeMedia('(max-width: 768px), (pointer: coarse)', onStoreChange),
    detectCoarsePointer,
    () => false,
  )
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribeMedia('(prefers-reduced-motion: reduce)', onStoreChange),
    detectReducedMotion,
    () => false,
  )
}

export function useWebGLSupport(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    detectWebGL,
    () => true,
  )
}
