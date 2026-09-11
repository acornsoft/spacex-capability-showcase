import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import {
  AdditiveBlending,
  Color,
  Group,
  MeshStandardMaterial,
  PointLight,
} from 'three'
import { poseAt } from '@/lib/scene-pose'

type RocketProps = {
  progress: MotionValue<number>
  reducedMotion: boolean
}

function useRocketMaterials() {
  return useMemo(() => {
    const hull = new MeshStandardMaterial({
      color: new Color('#f4f7fb'),
      metalness: 0.62,
      roughness: 0.22,
      envMapIntensity: 1.15,
    })
    const tile = new MeshStandardMaterial({
      color: new Color('#c5ccd4'),
      metalness: 0.35,
      roughness: 0.48,
      envMapIntensity: 0.7,
    })
    const soot = new MeshStandardMaterial({
      color: new Color('#14181e'),
      metalness: 0.55,
      roughness: 0.4,
      envMapIntensity: 0.85,
    })
    const carbon = new MeshStandardMaterial({
      color: new Color('#090c10'),
      metalness: 0.88,
      roughness: 0.16,
      envMapIntensity: 1.25,
    })
    const mark = new MeshStandardMaterial({
      color: new Color('#3ee0e8'),
      emissive: new Color('#3ee0e8'),
      emissiveIntensity: 0.7,
      metalness: 0.2,
      roughness: 0.28,
    })
    const copper = new MeshStandardMaterial({
      color: new Color('#b87333'),
      metalness: 0.9,
      roughness: 0.18,
      envMapIntensity: 1.4,
    })
    const amber = new MeshStandardMaterial({
      color: new Color('#e8a54b'),
      emissive: new Color('#e8a54b'),
      emissiveIntensity: 0.45,
      metalness: 0.35,
      roughness: 0.3,
    })
    return { hull, tile, soot, carbon, mark, copper, amber }
  }, [])
}

function GridFin({
  hull,
  carbon,
}: {
  hull: MeshStandardMaterial
  carbon: MeshStandardMaterial
}) {
  return (
    <group>
      <mesh material={carbon} position={[0, 0, -0.08]}>
        <boxGeometry args={[0.06, 0.05, 0.16]} />
      </mesh>
      <mesh material={carbon} position={[0, 0, 0.02]}>
        <boxGeometry args={[0.36, 0.3, 0.018]} />
      </mesh>
      {[-0.1, 0, 0.1].map((x) => (
        <mesh key={`v-${x}`} material={hull} position={[x, 0, 0.03]}>
          <boxGeometry args={[0.016, 0.26, 0.012]} />
        </mesh>
      ))}
      {[-0.07, 0.07].map((y) => (
        <mesh key={`h-${y}`} material={hull} position={[0, y, 0.03]}>
          <boxGeometry args={[0.3, 0.014, 0.01]} />
        </mesh>
      ))}
    </group>
  )
}

function LandingLeg({
  carbon,
  hull,
}: {
  carbon: MeshStandardMaterial
  hull: MeshStandardMaterial
}) {
  return (
    <>
      <mesh material={carbon} position={[0, -0.55, 0]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.055, 1.15, 0.045]} />
      </mesh>
      <mesh material={hull} position={[0, -1.18, 0.12]} rotation={[0.55, 0, 0]}>
        <boxGeometry args={[0.22, 0.035, 0.32]} />
      </mesh>
      <mesh material={carbon} position={[0, 0.02, 0]}>
        <boxGeometry args={[0.08, 0.1, 0.08]} />
      </mesh>
    </>
  )
}

export function Rocket({ progress, reducedMotion }: RocketProps) {
  const root = useRef<Group>(null)
  const plume = useRef<Group>(null)
  const engineLight = useRef<PointLight>(null)
  const materials = useRocketMaterials()

  useEffect(() => {
    const set = Object.values(materials)
    return () => {
      set.forEach((material) => material.dispose())
    }
  }, [materials])

  useFrame((state) => {
    const pose = poseAt(progress.get(), reducedMotion ? 0 : state.clock.elapsedTime)
    if (root.current) {
      root.current.position.x = 0.55 + pose.rocketX
      root.current.position.y = pose.rocketY
      root.current.rotation.x = pose.rocketTilt
      root.current.rotation.y = reducedMotion ? 0.55 : pose.rocketYaw
      root.current.scale.setScalar(pose.rocketScale)
    }
    if (plume.current) {
      const flicker = reducedMotion ? 1 : 0.8 + Math.sin(state.clock.elapsedTime * 42) * 0.2
      const scale = Math.max(0.02, pose.engine * flicker)
      plume.current.scale.set(0.85 + scale * 0.45, scale, 0.85 + scale * 0.45)
      plume.current.visible = pose.engine > 0.04
    }
    if (engineLight.current) {
      engineLight.current.intensity = pose.engine * (reducedMotion ? 8 : 14)
    }
  })

  const { hull, tile, soot, carbon, mark, copper, amber } = materials

  return (
    <group ref={root}>
      <mesh material={hull} position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.4, 3.35, 32]} />
      </mesh>
      <mesh material={soot} position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.4, 0.42, 0.62, 32]} />
      </mesh>
      <mesh material={carbon} position={[0, 1.78, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 0.18, 28]} />
      </mesh>
      <mesh material={tile} position={[0, 2.28, 0]}>
        <cylinderGeometry args={[0.26, 0.34, 0.82, 28]} />
      </mesh>
      <mesh material={soot} position={[0, 2.86, 0]}>
        <coneGeometry args={[0.26, 0.48, 28]} />
      </mesh>

      <mesh material={carbon} position={[0.405, 0.05, 0]}>
        <boxGeometry args={[0.04, 2.55, 0.1]} />
      </mesh>
      <mesh material={mark} position={[0.43, 0.55, 0]}>
        <boxGeometry args={[0.02, 0.72, 0.055]} />
      </mesh>
      <mesh material={mark} position={[0, 1.42, 0.385]}>
        <boxGeometry args={[0.22, 0.04, 0.02]} />
      </mesh>
      <mesh material={amber} position={[0, -0.95, 0.405]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
      </mesh>

      {[-0.55, 0.55, 1.15].map((y) => (
        <mesh key={`ring-${y}`} material={carbon} position={[0, y, 0]}>
          <torusGeometry args={[0.405, 0.012, 8, 40]} />
        </mesh>
      ))}

      {[0, 1, 2, 3].map((index) => (
        <group key={`fin-${index}`} rotation={[0, (index * Math.PI) / 2, 0]} position={[0, 1.38, 0]}>
          <group position={[0, 0, 0.48]} rotation={[-0.12, 0, 0]}>
            <GridFin hull={hull} carbon={carbon} />
          </group>
        </group>
      ))}

      <Legs progress={progress} carbon={carbon} hull={hull} />

      <group position={[0, -1.78, 0]}>
        <mesh material={carbon}>
          <cylinderGeometry args={[0.3, 0.36, 0.2, 20]} />
        </mesh>
        {[
          [0.18, 0.18],
          [-0.18, 0.18],
          [0.18, -0.18],
          [-0.18, -0.18],
          [0, 0],
        ].map(([x, z]) => (
          <mesh key={`${x}-${z}`} material={copper} position={[x, -0.2, z]} rotation={[Math.PI, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.13, 0.38, 16]} />
          </mesh>
        ))}
      </group>

      <group ref={plume} position={[0, -2.15, 0]}>
        <mesh>
          <coneGeometry args={[0.22, 1.55, 18]} />
          <meshBasicMaterial
            color="#ffb14a"
            transparent
            opacity={0.62}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <coneGeometry args={[0.12, 2.15, 16]} />
          <meshBasicMaterial
            color="#7cf4ff"
            transparent
            opacity={0.42}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <pointLight
        ref={engineLight}
        position={[0, -2.0, 0]}
        color="#ff9a3c"
        distance={9}
        intensity={0}
      />
    </group>
  )
}

function Legs({
  progress,
  carbon,
  hull,
}: {
  progress: MotionValue<number>
  carbon: MeshStandardMaterial
  hull: MeshStandardMaterial
}) {
  const arms = useRef<Array<Group | null>>([])

  useFrame((state) => {
    const pose = poseAt(progress.get(), state.clock.elapsedTime)
    arms.current.forEach((arm) => {
      if (arm) arm.rotation.x = 0.35 + pose.legs * 1.05
    })
  })

  return (
    <group>
      {[0, 1, 2, 3].map((index) => (
        <group key={`leg-${index}`} rotation={[0, (index * Math.PI) / 2 + Math.PI / 4, 0]}>
          <group
            ref={(node) => {
              arms.current[index] = node
            }}
            position={[0, -1.42, 0.34]}
          >
            <LandingLeg carbon={carbon} hull={hull} />
          </group>
        </group>
      ))}
    </group>
  )
}
