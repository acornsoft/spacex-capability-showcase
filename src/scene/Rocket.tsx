import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import {
  AdditiveBlending,
  Color,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  MeshPhysicalMaterial,
  Object3D,
  PointLight,
  Vector3,
} from 'three'
import { useDirectorOptional } from '@/lib/director'
import { PART_LABELS, publishMarks } from '@/lib/marks'
import { shotAt, type VehiclePart } from '@/lib/scene-pose'

type RocketProps = {
  progress: MotionValue<number>
  reducedMotion: boolean
}

function useVehicleMaterials() {
  return useMemo(() => {
    const hull = new MeshPhysicalMaterial({
      color: new Color('#eef3f8'),
      metalness: 0.88,
      roughness: 0.16,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
      envMapIntensity: 1.35,
    })
    const tile = new MeshPhysicalMaterial({
      color: new Color('#9aa3ad'),
      metalness: 0.28,
      roughness: 0.62,
      envMapIntensity: 0.55,
    })
    const soot = new MeshPhysicalMaterial({
      color: new Color('#12161c'),
      metalness: 0.7,
      roughness: 0.38,
      envMapIntensity: 0.9,
    })
    const carbon = new MeshPhysicalMaterial({
      color: new Color('#07090c'),
      metalness: 0.92,
      roughness: 0.14,
      envMapIntensity: 1.4,
    })
    const titanium = new MeshPhysicalMaterial({
      color: new Color('#8b939c'),
      metalness: 0.95,
      roughness: 0.22,
      envMapIntensity: 1.5,
    })
    const copper = new MeshPhysicalMaterial({
      color: new Color('#c47a3a'),
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.7,
      emissive: new Color('#3a1404'),
      emissiveIntensity: 0.15,
    })
    const mark = new MeshPhysicalMaterial({
      color: new Color('#3ee0e8'),
      emissive: new Color('#3ee0e8'),
      emissiveIntensity: 0.85,
      metalness: 0.35,
      roughness: 0.24,
      transparent: true,
      opacity: 0.96,
    })
    const amber = new MeshPhysicalMaterial({
      color: new Color('#e8a54b'),
      emissive: new Color('#e8a54b'),
      emissiveIntensity: 0.55,
      metalness: 0.4,
      roughness: 0.3,
    })
    const cyan = new Color('#3ee0e8')
    const black = new Color('#000000')
    return { hull, tile, soot, carbon, titanium, copper, mark, amber, cyan, black }
  }, [])
}

function GridFin({
  titanium,
  carbon,
}: {
  titanium: MeshPhysicalMaterial
  carbon: MeshPhysicalMaterial
}) {
  return (
    <group>
      <mesh material={carbon} position={[0, 0, -0.09]}>
        <boxGeometry args={[0.07, 0.055, 0.2]} />
      </mesh>
      <mesh material={carbon} position={[0, 0, 0.015]}>
        <boxGeometry args={[0.32, 0.26, 0.014]} />
      </mesh>
      {[-0.1, -0.035, 0.035, 0.1].map((x) => (
        <mesh key={`v-${x}`} material={titanium} position={[x, 0, 0.026]}>
          <boxGeometry args={[0.012, 0.22, 0.01]} />
        </mesh>
      ))}
      {[-0.07, 0, 0.07].map((y) => (
        <mesh key={`h-${y}`} material={titanium} position={[0, y, 0.026]}>
          <boxGeometry args={[0.26, 0.01, 0.008]} />
        </mesh>
      ))}
    </group>
  )
}

function HeatTiles({ material }: { material: MeshPhysicalMaterial }) {
  const mesh = useRef<InstancedMesh>(null)
  const count = 56

  useLayoutEffect(() => {
    const dummy = new Object3D()
    if (!mesh.current) return
    let index = 0
    for (let ring = 0; ring < 7; ring += 1) {
      const y = 2.52 + ring * 0.085
      const radius = 0.25 - ring * 0.026
      const around = 8
      for (let step = 0; step < around; step += 1) {
        if (index >= count) break
        const theta = (step / around) * Math.PI * 2 + ring * 0.18
        dummy.position.set(Math.cos(theta) * radius, y, Math.sin(theta) * radius)
        dummy.lookAt(0, y + 0.55, 0)
        dummy.scale.set(0.05, 0.01, 0.068)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(index, dummy.matrix)
        index += 1
      }
    }
    mesh.current.instanceMatrix.setUsage(DynamicDrawUsage)
    mesh.current.instanceMatrix.needsUpdate = true
  }, [count])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <primitive object={material} attach="material" />
    </instancedMesh>
  )
}

export function Rocket({ progress, reducedMotion }: RocketProps) {
  const root = useRef<Group>(null)
  const plume = useRef<Group>(null)
  const engineLight = useRef<PointLight>(null)
  const anchors = useRef<Record<VehiclePart, Group | null>>({
    hull: null,
    fins: null,
    engines: null,
    legs: null,
    raceway: null,
  })
  const materials = useVehicleMaterials()
  const director = useDirectorOptional()
  const projector = useMemo(() => new Vector3(), [])

  useEffect(() => {
    const {
      hull,
      tile,
      soot,
      carbon,
      titanium,
      copper,
      mark,
      amber,
    } = materials
    const set = [hull, tile, soot, carbon, titanium, copper, mark, amber]
    return () => {
      set.forEach((material) => material.dispose())
    }
  }, [materials])

  useFrame((state) => {
    const shot = shotAt(progress.get())
    const idle = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.03
    if (root.current) {
      root.current.position.x = shot.shiftX
      root.current.position.y = shot.lift
      root.current.rotation.x = shot.tilt
      root.current.rotation.y = shot.yaw + idle
      root.current.scale.setScalar(shot.scale)
    }
    if (plume.current) {
      const flicker = reducedMotion ? 1 : 0.82 + Math.sin(state.clock.elapsedTime * 46) * 0.18
      const scale = Math.max(0.02, shot.engine * flicker)
      plume.current.scale.set(0.7 + scale * 0.55, scale, 0.7 + scale * 0.55)
      plume.current.visible = shot.engine > 0.05
    }
    if (engineLight.current) {
      engineLight.current.intensity = shot.engine * (reducedMotion ? 7 : 16)
    }

    const focus = director?.effectiveFocus ?? null
    const pulse = 0.55 + Math.sin(state.clock.elapsedTime * 3.2) * 0.2
    materials.mark.emissiveIntensity = focus === 'raceway' ? 1.4 * pulse : 0.7
    materials.copper.emissiveIntensity = focus === 'engines' ? 0.55 + shot.engine : 0.12 + shot.engine * 0.35
    materials.titanium.emissive.copy(focus === 'fins' ? materials.cyan : materials.black)
    materials.titanium.emissiveIntensity = focus === 'fins' ? 0.28 : 0
    materials.hull.roughness = focus === 'hull' ? 0.12 : 0.16

    const camera = state.camera
    const marks = (Object.entries(anchors.current) as Array<[VehiclePart, Group | null]>).map(
      ([id, node]) => {
        if (!node) {
          return { id, label: PART_LABELS[id], x: 0, y: 0, visible: false }
        }
        projector.setFromMatrixPosition(node.matrixWorld)
        projector.project(camera)
        const onScreen = projector.z < 1 && Math.abs(projector.x) < 1.15 && Math.abs(projector.y) < 1.15
        return {
          id,
          label: PART_LABELS[id],
          x: (projector.x * 0.5 + 0.5) * window.innerWidth,
          y: (-projector.y * 0.5 + 0.5) * window.innerHeight,
          visible: onScreen && focus === id,
        }
      },
    )
    publishMarks(marks)
  })

  const { hull, tile, soot, carbon, titanium, copper, mark, amber } = materials
  const setFocus = director?.setPointerFocus

  return (
    <group ref={root}>
      <group
        ref={(node) => {
          anchors.current.hull = node
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          setFocus?.('hull')
        }}
        onPointerOut={() => setFocus?.(null)}
      >
        <mesh material={hull} position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.38, 0.4, 3.35, 48]} />
        </mesh>
        {[-1.05, -0.55, -0.05, 0.45, 0.95, 1.35].map((y) => (
          <mesh key={`panel-${y}`} material={carbon} position={[0, y, 0]}>
            <torusGeometry args={[0.392, 0.006, 6, 48]} />
          </mesh>
        ))}
        {[-0.22, 0.22].map((z) => (
          <mesh key={`seam-${z}`} material={carbon} position={[0.02, 0.15, z]}>
            <boxGeometry args={[0.006, 3.2, 0.006]} />
          </mesh>
        ))}
        <mesh material={soot} position={[0, -1.35, 0]}>
          <cylinderGeometry args={[0.4, 0.43, 0.64, 48]} />
        </mesh>
        <mesh material={carbon} position={[0, 1.78, 0]}>
          <cylinderGeometry args={[0.335, 0.38, 0.16, 40]} />
        </mesh>
        <mesh material={tile} position={[0, 2.26, 0]}>
          <cylinderGeometry args={[0.255, 0.335, 0.82, 40]} />
        </mesh>
        <mesh material={soot} position={[0, 2.84, 0]}>
          <coneGeometry args={[0.255, 0.46, 40]} />
        </mesh>
        <HeatTiles material={tile} />
      </group>

      <group
        ref={(node) => {
          anchors.current.raceway = node
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          setFocus?.('raceway')
        }}
        onPointerOut={() => setFocus?.(null)}
      >
        <mesh material={carbon} position={[0.408, 0.05, 0]}>
          <boxGeometry args={[0.042, 2.55, 0.11]} />
        </mesh>
        <mesh material={mark} position={[0.435, 0.55, 0]}>
          <boxGeometry args={[0.018, 0.78, 0.05]} />
        </mesh>
        <mesh material={amber} position={[0, -0.95, 0.41]}>
          <boxGeometry args={[0.07, 0.07, 0.018]} />
        </mesh>
      </group>

      <group
        ref={(node) => {
          anchors.current.fins = node
        }}
        position={[0, 1.38, 0]}
        onPointerOver={(event) => {
          event.stopPropagation()
          setFocus?.('fins')
        }}
        onPointerOut={() => setFocus?.(null)}
      >
        {[0, 1, 2, 3].map((index) => (
          <group key={`fin-${index}`} rotation={[0, (index * Math.PI) / 2, 0]}>
            <group position={[0, 0, 0.5]} rotation={[-0.1, 0, 0]}>
              <GridFin titanium={titanium} carbon={carbon} />
            </group>
          </group>
        ))}
      </group>

      <Legs
        progress={progress}
        carbon={carbon}
        hull={hull}
        onBind={(node) => {
          anchors.current.legs = node
        }}
        onFocus={() => setFocus?.('legs')}
        onBlur={() => setFocus?.(null)}
      />

      <group
        ref={(node) => {
          anchors.current.engines = node
        }}
        position={[0, -1.78, 0]}
        onPointerOver={(event) => {
          event.stopPropagation()
          setFocus?.('engines')
        }}
        onPointerOut={() => setFocus?.(null)}
      >
        <mesh material={carbon}>
          <cylinderGeometry args={[0.3, 0.37, 0.22, 24]} />
        </mesh>
        {[
          [0.18, 0.18],
          [-0.18, 0.18],
          [0.18, -0.18],
          [-0.18, -0.18],
          [0, 0],
        ].map(([x, z]) => (
          <group key={`${x}-${z}`} position={[x, -0.18, z]}>
            <mesh material={copper} rotation={[Math.PI, 0, 0]}>
              <cylinderGeometry args={[0.078, 0.132, 0.42, 20]} />
            </mesh>
            <mesh material={soot} position={[0, -0.02, 0]} rotation={[Math.PI, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.08, 0.28, 16]} />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={plume} position={[0, -2.22, 0]}>
        <mesh>
          <coneGeometry args={[0.24, 1.7, 20]} />
          <meshBasicMaterial
            color="#ffb14a"
            transparent
            opacity={0.55}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <coneGeometry args={[0.13, 2.35, 18]} />
          <meshBasicMaterial
            color="#7cf4ff"
            transparent
            opacity={0.4}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.16, 20]} />
          <meshBasicMaterial
            color="#fff4d6"
            transparent
            opacity={0.7}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      <pointLight
        ref={engineLight}
        position={[0, -2.05, 0]}
        color="#ff9a3c"
        distance={10}
        intensity={0}
      />
    </group>
  )
}

function Legs({
  progress,
  carbon,
  hull,
  onBind,
  onFocus,
  onBlur,
}: {
  progress: MotionValue<number>
  carbon: MeshPhysicalMaterial
  hull: MeshPhysicalMaterial
  onBind: (node: Group | null) => void
  onFocus: () => void
  onBlur: () => void
}) {
  const arms = useRef<Array<Group | null>>([])

  useFrame(() => {
    const shot = shotAt(progress.get())
    arms.current.forEach((arm) => {
      if (arm) arm.rotation.x = 0.32 + shot.legs * 1.08
    })
  })

  return (
    <group
      ref={onBind}
      onPointerOver={(event) => {
        event.stopPropagation()
        onFocus()
      }}
      onPointerOut={onBlur}
    >
      {[0, 1, 2, 3].map((index) => (
        <group key={`leg-${index}`} rotation={[0, (index * Math.PI) / 2 + Math.PI / 4, 0]}>
          <group
            ref={(node) => {
              arms.current[index] = node
            }}
            position={[0, -1.38, 0.34]}
          >
            <mesh material={carbon} position={[0, -0.28, 0]}>
              <boxGeometry args={[0.07, 0.22, 0.07]} />
            </mesh>
            <mesh material={carbon} position={[0, -0.72, 0]} rotation={[0.06, 0, 0]}>
              <boxGeometry args={[0.05, 0.95, 0.04]} />
            </mesh>
            <mesh material={hull} position={[0, -1.24, 0.14]} rotation={[0.5, 0, 0]}>
              <boxGeometry args={[0.24, 0.03, 0.34]} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}
