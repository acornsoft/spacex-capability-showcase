import { Environment, Grid, Lightformer } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useRef } from 'react'
import type { Group } from 'three'
import { poseAt } from '@/lib/scene-pose'

type StageProps = {
  progress: MotionValue<number>
}

export function Stage({ progress }: StageProps) {
  const grid = useRef<Group>(null)

  useFrame((state) => {
    const pose = poseAt(progress.get(), state.clock.elapsedTime)
    if (grid.current) {
      grid.current.position.y = -2.35
      grid.current.visible = pose.grid > 0.02
      grid.current.scale.setScalar(0.85 + pose.grid * 0.15)
    }
  })

  return (
    <group ref={grid}>
      <Grid
        args={[24, 24]}
        cellSize={0.45}
        cellThickness={0.7}
        cellColor="#1a4a50"
        sectionSize={2.25}
        sectionThickness={1.2}
        sectionColor="#3ee0e8"
        fadeDistance={18}
        fadeStrength={1.25}
        infiniteGrid
      />
    </group>
  )
}

export function OrbitGuides() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2.35, 0.35, 0.1]}>
        <torusGeometry args={[8.4, 0.008, 8, 160]} />
        <meshBasicMaterial color="#3ee0e8" transparent opacity={0.18} />
      </mesh>
      <mesh rotation={[1.05, -0.4, 0.2]}>
        <torusGeometry args={[11.2, 0.006, 8, 160]} />
        <meshBasicMaterial color="#e8a54b" transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.22} color="#d7e3ef" />
      <directionalLight position={[4.6, 7.2, 5.4]} intensity={2.05} color="#f7fbff" />
      <directionalLight position={[-6.4, 2.2, -3.2]} intensity={0.85} color="#3ee0e8" />
      <directionalLight position={[1.4, -3.8, 2.4]} intensity={0.28} color="#e8a54b" />
      <Environment frames={1} resolution={256} environmentIntensity={0.7}>
        <Lightformer intensity={5.5} position={[5, 7, 4]} scale={10} color="#ffffff" />
        <Lightformer intensity={2.4} position={[-7, 2, -2]} scale={[5, 10, 1]} color="#3ee0e8" />
        <Lightformer intensity={1.6} position={[0, -5, 3]} scale={7} color="#e8a54b" />
      </Environment>
    </>
  )
}
