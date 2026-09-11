import { Canvas } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { Suspense } from 'react'
import { pixelRatioBudget } from '@/lib/runtime'
import { CameraRig } from '@/scene/CameraRig'
import { Rocket } from '@/scene/Rocket'
import { Lights, OrbitGuides, Stage } from '@/scene/Stage'
import { NebulaWash, Starfield } from '@/scene/Starfield'

type ExperienceProps = {
  progress: MotionValue<number>
  starCount: number
  isCoarse: boolean
  reducedMotion: boolean
}

export function Experience({
  progress,
  starCount,
  isCoarse,
  reducedMotion,
}: ExperienceProps) {
  return (
    <Canvas
      className="h-full w-full"
      dpr={pixelRatioBudget(isCoarse)}
      gl={{
        antialias: !isCoarse,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      camera={{ position: [3.05, 1.85, 3.45], fov: 30, near: 0.1, far: 160 }}
      onCreated={({ gl }) => {
        gl.setClearColor('#030508', 1)
        gl.toneMappingExposure = 1.2
      }}
    >
      <Suspense fallback={null}>
        <CameraRig progress={progress} reducedMotion={reducedMotion} />
        <Lights />
        <Starfield count={starCount} />
        <NebulaWash />
        <OrbitGuides />
        <Rocket progress={progress} reducedMotion={reducedMotion} />
        <Stage progress={progress} />
        <fog attach="fog" args={['#030508', 12, 55]} />
      </Suspense>
    </Canvas>
  )
}

export default Experience
