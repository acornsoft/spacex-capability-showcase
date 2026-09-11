import { PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { Suspense, useState } from 'react'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { pixelRatioBudget } from '@/lib/runtime'
import { Horizon } from '@/scene/Atmosphere'
import { CameraRig } from '@/scene/CameraRig'
import { PostFX } from '@/scene/PostFX'
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
  const [quality, setQuality] = useState<'high' | 'low'>(isCoarse ? 'low' : 'high')
  const dpr = quality === 'low' ? ([1, 1.15] as [number, number]) : pixelRatioBudget(isCoarse)
  const stars = quality === 'low' ? Math.min(starCount, 900) : starCount
  const postEnabled = quality === 'high' && !reducedMotion && !isCoarse

  return (
    <Canvas
      className="h-full w-full"
      dpr={dpr}
      gl={{
        antialias: !postEnabled && !isCoarse,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      camera={{ position: [6.85, 2.55, 3.45], fov: 32, near: 0.1, far: 180 }}
      onCreated={({ gl }) => {
        gl.setClearColor('#030508', 1)
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 1.08
        gl.outputColorSpace = SRGBColorSpace
      }}
    >
      <PerformanceMonitor
        onDecline={() => setQuality('low')}
        onIncline={() => {
          if (!isCoarse) setQuality('high')
        }}
        flipflops={3}
      />
      <Suspense fallback={null}>
        <CameraRig progress={progress} reducedMotion={reducedMotion} />
        <Lights isCoarse={isCoarse || quality === 'low'} />
        <Starfield count={stars} />
        <NebulaWash />
        <Horizon progress={progress} />
        <OrbitGuides progress={progress} />
        <Rocket progress={progress} reducedMotion={reducedMotion} />
        <Stage progress={progress} />
        <fog attach="fog" args={['#030508', 14, 62]} />
        <PostFX progress={progress} enabled={postEnabled} />
      </Suspense>
    </Canvas>
  )
}

export default Experience
