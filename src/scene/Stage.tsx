import { Environment, Grid, Lightformer } from '@react-three/drei'
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
      <ambientLight intensity={0.08} color="#c9d6e4" />
      <directionalLight position={[6.2, 5.4, 2.2]} intensity={2.6} color="#f7fbff" />
      <directionalLight position={[-5.5, 3.2, -4.8]} intensity={1.35} color="#3ee0e8" />
      <directionalLight position={[1.4, -3.2, 4.2]} intensity={0.4} color="#e8a54b" />
      <Environment frames={1} resolution={isCoarse ? 128 : 256} environmentIntensity={1.15}>
        <Lightformer intensity={12} position={[5, 7, 1.5]} scale={[14, 1.4, 1]} form="rect" />
        <Lightformer intensity={3.2} position={[-7, 2, -2]} scale={[2.5, 14, 1]} color="#3ee0e8" form="rect" />
        <Lightformer intensity={2.2} position={[0, -5, 5]} scale={9} color="#e8a54b" />
        <Lightformer intensity={1.6} position={[2, 10, -6]} scale={[18, 4, 1]} />
      </Environment>
    </>
  )
}
