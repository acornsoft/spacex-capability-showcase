import { useSyncExternalStore } from 'react'
import type { VehiclePart } from '@/lib/scene-pose'

export type ScreenMark = {
  id: VehiclePart
  label: string
  x: number
  y: number
  visible: boolean
}

type MarksSnapshot = readonly ScreenMark[]

const listeners = new Set<() => void>()
let snapshot: MarksSnapshot = []

export function publishMarks(next: ScreenMark[]): void {
  snapshot = next
  listeners.forEach((listener) => listener())
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange)
  return () => listeners.delete(onStoreChange)
}

function getSnapshot(): MarksSnapshot {
  return snapshot
}

export function useScreenMarks(): MarksSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export const PART_LABELS: Record<VehiclePart, string> = {
  hull: 'Airframe',
  fins: 'Grid fins',
  engines: 'Engine bay',
  legs: 'Landing legs',
  raceway: 'Raceway',
}
