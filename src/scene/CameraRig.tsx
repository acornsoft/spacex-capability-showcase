import { useFrame, useThree } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { MathUtils, Vector3 } from 'three'
import { shotAt } from '@/lib/scene-pose'

type CameraRigProps = {
  progress: MotionValue<number>
  reducedMotion: boolean
}

export function CameraRig({ progress, reducedMotion }: CameraRigProps) {
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  const look = useRef(new Vector3(0.35, 0.05, 0))
  const desired = useRef(new Vector3(6.85, 2.55, 3.45))

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const shot = shotAt(reducedMotion ? 0 : progress.get())
    const close = shot.fov < 26 ? 0.08 : 0.22
    const parallax = reducedMotion ? 0 : close
    const breathe = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.28) * 0.04

    desired.current.set(
      shot.position[0] + pointer.current.x * parallax,
      shot.position[1] - pointer.current.y * parallax * 0.45 + breathe,
      shot.position[2],
    )
    look.current.set(
      shot.target[0] + pointer.current.x * 0.06,
      shot.target[1] - pointer.current.y * 0.04,
      shot.target[2],
    )

    const ease = 1 - Math.exp(-delta * 2.05)
    camera.position.lerp(desired.current, ease)
    camera.lookAt(look.current)
    if ('fov' in camera) {
      camera.fov = MathUtils.lerp(camera.fov, shot.fov, ease)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
