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
      color: new Color('#e7eef4'),
      metalness: 0.74,
      roughness: 0.26,
    })
    const soot = new MeshStandardMaterial({
      color: new Color('#16191e'),
      metalness: 0.42,
      roughness: 0.58,
    })
    const carbon = new MeshStandardMaterial({
      color: new Color('#0b0f14'),
      metalness: 0.86,
      roughness: 0.2,
    })
    const mark = new MeshStandardMaterial({
      color: new Color('#3ee0e8'),
      emissive: new Color('#3ee0e8'),
      emissiveIntensity: 0.35,
      metalness: 0.25,
      roughness: 0.32,
    })
    const bell = new MeshStandardMaterial({
      color: new Color('#2a2e34'),
      metalness: 0.8,
      roughness: 0.28,
    })
    return { hull, soot, carbon, mark, bell }
  }, [])
}

function GridFin({
  material,
  carbon,
}: {
  material: MeshStandardMaterial
  carbon: MeshStandardMaterial
}) {
  return (
    <group>
      <mesh material={carbon} position={[0, 0, 0.02]}>
        <boxGeometry args={[0.42, 0.34, 0.03]} />
      </mesh>
      {[-0.12, 0, 0.12].map((x) => (
        <mesh key={x} material={material} position={[x, 0, 0.04]}>
          <boxGeometry args={[0.018, 0.3, 0.012]} />
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
      <mesh material={carbon} position={[0, -0.42, 0]}>
        <boxGeometry args={[0.045, 0.86, 0.04]} />
      </mesh>
      <mesh material={hull} position={[0, -0.88, 0.08]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.16, 0.03, 0.22]} />
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
      root.current.position.y = pose.rocketY
      root.current.rotation.x = pose.rocketTilt
      root.current.rotation.y = reducedMotion ? 0.35 : pose.rocketYaw
    }
    if (plume.current) {
      const flicker = reducedMotion ? 1 : 0.82 + Math.sin(state.clock.elapsedTime * 38) * 0.18
      const scale = Math.max(0.02, pose.engine * flicker)
      plume.current.scale.set(0.7 + scale * 0.5, scale, 0.7 + scale * 0.5)
      plume.current.visible = pose.engine > 0.04
    }
    if (engineLight.current) {
      engineLight.current.intensity = pose.engine * (reducedMotion ? 6 : 9)
    }
  })

  const { hull, soot, carbon, mark, bell } = materials

  return (
    <group ref={root} position={[0.35, 0, 0]}>
      <mesh material={hull} position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.36, 3.15, 28]} />
      </mesh>
      <mesh material={soot} position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.36, 0.38, 0.55, 28]} />
      </mesh>
      <mesh material={carbon} position={[0, 1.82, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.22, 24]} />
      </mesh>
      <mesh material={hull} position={[0, 2.28, 0]}>
        <cylinderGeometry args={[0.22, 0.3, 0.7, 24]} />
      </mesh>
      <mesh material={soot} position={[0, 2.78, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.22, 0.42, 24]} />
      </mesh>
      <mesh material={carbon} position={[0.365, 0.2, 0]}>
        <boxGeometry args={[0.035, 2.4, 0.08]} />
      </mesh>
      <mesh material={mark} position={[0.39, 0.85, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.42, 0.018, 0.04]} />
      </mesh>
      <mesh material={mark} position={[0, 1.55, 0.345]}>
        <boxGeometry args={[0.16, 0.035, 0.02]} />
      </mesh>

      {[0, 1, 2, 3].map((index) => (
        <group key={`fin-${index}`} rotation={[0, (index * Math.PI) / 2, 0]} position={[0, 1.55, 0]}>
          <group position={[0, 0, 0.38]}>
            <GridFin material={hull} carbon={carbon} />
          </group>
        </group>
      ))}

      <Legs progress={progress} carbon={carbon} hull={hull} />

      <group position={[0, -1.42, 0]}>
        <mesh material={bell}>
          <cylinderGeometry args={[0.2, 0.28, 0.22, 20]} />
        </mesh>
        {[
          [0.2, 0, 0.12],
          [-0.2, 0, 0.12],
          [0.12, 0, -0.2],
          [-0.12, 0, -0.2],
        ].map(([x, y, z]) => (
          <mesh key={`${x}-${z}`} material={bell} position={[x, y, z]}>
            <coneGeometry args={[0.09, 0.2, 14]} />
          </mesh>
        ))}
        <mesh material={bell} position={[0, -0.08, 0]}>
          <coneGeometry args={[0.12, 0.26, 16]} />
        </mesh>
      </group>

      <group ref={plume} position={[0, -1.85, 0]}>
        <mesh>
          <coneGeometry args={[0.16, 1.15, 16]} />
          <meshBasicMaterial
            color="#ffb347"
            transparent
            opacity={0.55}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <coneGeometry args={[0.1, 1.6, 14]} />
          <meshBasicMaterial
            color="#3ee0e8"
            transparent
            opacity={0.35}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <pointLight
        ref={engineLight}
        position={[0, -1.7, 0]}
        color="#ff9a3c"
        distance={7}
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
      if (arm) arm.rotation.x = 0.18 + pose.legs * 1.05
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
            position={[0, -1.55, 0.3]}
          >
            <LandingLeg carbon={carbon} hull={hull} />
          </group>
        </group>
      ))}
    </group>
  )
}
