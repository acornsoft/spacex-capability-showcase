import { Grid } from '@react-three/drei'
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
      grid.current.position.y = -2.15
      grid.current.visible = pose.grid > 0.02
      grid.current.scale.setScalar(0.85 + pose.grid * 0.15)
    }
  })

  return (
    <group ref={grid}>
      <Grid
        args={[24, 24]}
        cellSize={0.45}
        cellThickness={0.6}
        cellColor="#16343a"
        sectionSize={2.25}
        sectionThickness={1.1}
        sectionColor="#3ee0e8"
        fadeDistance={16}
        fadeStrength={1.4}
        infiniteGrid
      />
    </group>
  )
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.14} color="#c9d6e4" />
      <directionalLight position={[4.2, 6.4, 5.2]} intensity={1.28} color="#f3f7fb" />
      <directionalLight position={[-6.2, 1.8, -3.6]} intensity={0.42} color="#3ee0e8" />
      <directionalLight position={[1.2, -3.4, 2]} intensity={0.18} color="#e8a54b" />
    </>
  )
}
