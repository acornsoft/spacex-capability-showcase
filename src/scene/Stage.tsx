import { Environment, Grid } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useRef } from 'react'
import type { Group } from 'three'
import { shotAt } from '@/lib/scene-pose'

type StageProps = {
  progress: MotionValue<number>
}

export function Stage({ progress }: StageProps) {
  const grid = useRef<Group>(null)

  useFrame(() => {
    const shot = shotAt(progress.get())
    if (grid.current) {
      grid.current.position.y = -2.45
      grid.current.visible = shot.grid > 0.03
      grid.current.scale.setScalar(0.82 + shot.grid * 0.18)
    }
  })

  return (
    <group ref={grid}>
      <Grid
        args={[28, 28]}
        cellSize={0.45}
        cellThickness={0.65}
        cellColor="#16343a"
        sectionSize={2.25}
        sectionThickness={1.15}
        sectionColor="#3ee0e8"
        fadeDistance={20}
        fadeStrength={1.35}
        infiniteGrid
      />
    </group>
  )
}

export function OrbitGuides({ progress }: StageProps) {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const shot = shotAt(progress.get())
    const show = shot.horizon * 0.35 + (shot.fov > 36 ? 0.25 : 0.12)
    group.current.visible = show > 0.08
    group.current.rotation.z = state.clock.elapsedTime * 0.02
    group.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2.3, 0.28, 0.08]}>
        <torusGeometry args={[9.2, 0.007, 8, 180]} />
        <meshBasicMaterial color="#3ee0e8" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh rotation={[1.02, -0.42, 0.18]}>
        <torusGeometry args={[12.4, 0.005, 8, 180]} />
        <meshBasicMaterial color="#e8a54b" transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  )
}

type LightsProps = {
  isCoarse: boolean
}

export function Lights({ isCoarse }: LightsProps) {
  return (
    <>
      <ambientLight intensity={0.12} color="#c9d6e4" />
      <directionalLight position={[5.2, 8.1, 4.8]} intensity={2.35} color="#f7fbff" />
      <directionalLight position={[-7.2, 1.6, -2.8]} intensity={0.95} color="#3ee0e8" />
      <directionalLight position={[2.2, -4.2, 3.1]} intensity={0.32} color="#e8a54b" />
      <Environment
        preset="studio"
        environmentIntensity={0.4}
        resolution={isCoarse ? 128 : 256}
        background={false}
      />
    </>
  )
}
