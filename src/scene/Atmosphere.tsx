import { useFrame } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { BackSide, Color, ShaderMaterial } from 'three'
import { shotAt } from '@/lib/scene-pose'

const vertexShader = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vView;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vView;
  uniform float uOpacity;
  uniform vec3 uCore;
  uniform vec3 uRim;
  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vNormalW), normalize(vView)), 0.0), 5.4);
    vec3 color = mix(uCore, uRim, fresnel);
    gl_FragColor = vec4(color, fresnel * uOpacity);
  }
`

type HorizonProps = {
  progress: MotionValue<number>
}

export function Horizon({ progress }: HorizonProps) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uOpacity: { value: 0 },
          uCore: { value: new Color('#071018') },
          uRim: { value: new Color('#3ee0e8') },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: BackSide,
        toneMapped: false,
      }),
    [],
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame(() => {
    material.uniforms.uOpacity.value = shotAt(progress.get()).horizon * 0.38
  })

  return (
    <mesh material={material} position={[0, -32, -18]} rotation={[0.22, 0, 0]}>
      <sphereGeometry args={[24, 48, 32]} />
    </mesh>
  )
}
