import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useFrame } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useRef } from 'react'
import type { BloomEffect } from 'postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { shotAt } from '@/lib/scene-pose'

type PostFXProps = {
  progress: MotionValue<number>
  enabled: boolean
}

export function PostFX({ progress, enabled }: PostFXProps) {
  const bloom = useRef<BloomEffect>(null)

  useFrame(() => {
    if (!bloom.current) return
    bloom.current.intensity = 0.18 + shotAt(progress.get()).bloom * 0.55
  })

  if (!enabled) return null

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        ref={bloom}
        luminanceThreshold={1.05}
        luminanceSmoothing={0.18}
        mipmapBlur
        intensity={0.42}
        radius={0.52}
        kernelSize={KernelSize.SMALL}
        blendFunction={BlendFunction.ADD}
      />
      <Vignette eskil={false} offset={0.28} darkness={0.62} />
    </EffectComposer>
  )
}
