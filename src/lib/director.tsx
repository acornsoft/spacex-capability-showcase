import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'
import {
  beatAt,
  beatFocus,
  type NarrativeBeat,
  type VehiclePart,
} from '@/lib/scene-pose'

type DirectorValue = {
  progress: MotionValue<number>
  beat: NarrativeBeat
  pointerFocus: VehiclePart | null
  chapterFocus: VehiclePart | null
  effectiveFocus: VehiclePart | null
  setPointerFocus: (part: VehiclePart | null) => void
  setChapterFocus: (part: VehiclePart | null) => void
  goTo: (id: string) => void
}

const DirectorContext = createContext<DirectorValue | null>(null)

type DirectorProviderProps = {
  progress: MotionValue<number>
  children: ReactNode
}

export function DirectorProvider({ progress, children }: DirectorProviderProps) {
  const [beat, setBeat] = useState<NarrativeBeat>(() => beatAt(progress.get()))
  const [pointerFocus, setPointerFocus] = useState<VehiclePart | null>(null)
  const [chapterFocus, setChapterFocus] = useState<VehiclePart | null>(null)

  useMotionValueEvent(progress, 'change', (value) => {
    const next = beatAt(value)
    setBeat((current) => (current === next ? current : next))
  })

  const goTo = useCallback((id: string) => {
    const node = document.getElementById(id)
    if (!node) return
    node.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const effectiveFocus = pointerFocus ?? chapterFocus ?? beatFocus(beat)

  const value = useMemo<DirectorValue>(
    () => ({
      progress,
      beat,
      pointerFocus,
      chapterFocus,
      effectiveFocus,
      setPointerFocus,
      setChapterFocus,
      goTo,
    }),
    [progress, beat, pointerFocus, chapterFocus, effectiveFocus, goTo],
  )

  return <DirectorContext.Provider value={value}>{children}</DirectorContext.Provider>
}

export function useDirector(): DirectorValue {
  const value = useContext(DirectorContext)
  if (!value) {
    throw new Error('useDirector must be used within DirectorProvider')
  }
  return value
}

export function useDirectorOptional(): DirectorValue | null {
  return useContext(DirectorContext)
}
