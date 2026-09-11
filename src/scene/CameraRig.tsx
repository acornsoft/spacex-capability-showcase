import { useFrame, useThree } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { MathUtils, Vector3 } from 'three'
import { cameraAt } from '@/lib/scene-pose'

type CameraRigProps = {
  progress: MotionValue<number>
  reducedMotion: boolean
}

export function CameraRig({ progress, reducedMotion }: CameraRigProps) {
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  const target = useRef(new Vector3(0.2, 0.25, 0))
  const desired = useRef(new Vector3(3.05, 1.85, 3.45))

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    const key = cameraAt(reducedMotion ? 0 : progress.get())
    const parallax = reducedMotion ? 0 : 0.28
    desired.current.set(
      key.position[0] + pointer.current.x * parallax,
      key.position[1] - pointer.current.y * parallax * 0.55,
      key.position[2],
    )
    target.current.set(
      key.target[0] + pointer.current.x * 0.08,
      key.target[1] - pointer.current.y * 0.05,
      key.target[2],
    )

    const ease = 1 - Math.exp(-delta * 4.2)
    camera.position.lerp(desired.current, ease)
    camera.lookAt(target.current)
    if ('fov' in camera) {
      camera.fov = MathUtils.lerp(camera.fov, key.fov, ease)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
