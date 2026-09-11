import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  ShaderMaterial,
} from 'three'

const vertexShader = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vTwinkle = 0.62 + 0.38 * sin(uTime * 1.55 + aPhase);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio * (340.0 / -mvPosition.z) * vTwinkle;
  }
`

const fragmentShader = /* glsl */ `
  varying float vTwinkle;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float core = smoothstep(0.5, 0.03, dist);
    vec3 cool = vec3(0.35, 0.92, 0.95);
    vec3 white = vec3(1.0, 0.99, 0.97);
    vec3 color = mix(cool, white, core);
    gl_FragColor = vec4(color, core * min(1.0, vTwinkle * 1.15));
  }
`

type StarfieldProps = {
  count: number
}

export function Starfield({ count }: StarfieldProps) {
  const materialRef = useRef<ShaderMaterial>(null)

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i += 1) {
      const radius = 14 + Math.random() * 62
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      phases[i] = Math.random() * Math.PI * 2
      sizes[i] = 0.85 + Math.random() * 2.4
    }

    const nextGeometry = new BufferGeometry()
    nextGeometry.setAttribute('position', new BufferAttribute(positions, 3))
    nextGeometry.setAttribute('aPhase', new BufferAttribute(phases, 1))
    nextGeometry.setAttribute('aSize', new BufferAttribute(sizes, 1))

    const nextMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    })

    return { geometry: nextGeometry, material: nextMaterial }
  }, [count])

  useEffect(() => {
    materialRef.current = material
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}

export function NebulaWash() {
  const color = useMemo(() => new Color('#0b1c28'), [])
  return (
    <mesh scale={[90, 40, 90]} rotation={[0.2, 0.4, 0]} position={[8, -6, -30]}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.18} depthWrite={false} />
    </mesh>
  )
}
