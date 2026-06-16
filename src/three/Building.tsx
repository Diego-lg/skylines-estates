import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { floors, building, statusByFloor, type FloorInfo } from '../data/building'
import { useStore } from '../store'

const TIER_COLOR: Record<FloorInfo['tier'], string> = {
  sub: '#2a2c33',
  residential: '#c39a4f',
  sky: '#e8cf95',
  penthouse: '#f0d28a',
  crown: '#ffffff',
}

const STATUS_TINT: Record<string, string> = {
  available: '#1a3a2a',
  reserved: '#3a2a1a',
  sold: '#2a2a2a',
}

function floorHeight(f: FloorInfo) {
  // Make sub-floors and crown taller to feel more architectural
  if (f.tier === 'sub') return 1.6
  if (f.tier === 'crown') return 4.0
  if (f.tier === 'penthouse') return 2.4
  if (f.tier === 'sky') return 1.9
  return 1.15
}

interface SlabProps {
  floor: FloorInfo
  y: number
  baseRadius: number
  index: number
}

function Slab({ floor, y, baseRadius, index }: SlabProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { hoveredFloor, setHoveredFloor, goToFloor, currentFloor } = useStore()
  const isHovered = hoveredFloor === floor.number
  const isCurrent = currentFloor === floor.number

  // Geometry varies subtly with tier for that "setback" look
  const radius = useMemo(() => {
    switch (floor.tier) {
      case 'sub':
        return baseRadius * 1.05
      case 'residential':
        return baseRadius * (0.92 + (index % 3) * 0.012)
      case 'sky':
        return baseRadius * 0.86
      case 'penthouse':
        return baseRadius * 0.78
      case 'crown':
        return baseRadius * 0.62
    }
  }, [floor.tier, baseRadius, index])

  const height = floorHeight(floor)

  // Window emissive intensity varies by floor
  const windowEmissive = useMemo(() => {
    const seed = (floor.number * 1103515245 + 12345) % 100
    const baseLit = 0.6 + (seed % 50) / 100
    return floor.tier === 'sub' ? 0.0 : baseLit * (floor.tier === 'penthouse' ? 1.3 : 1.0)
  }, [floor])

  // Glass tint varies by available status
  const status = statusByFloor[floor.number] || 'available'
  const glassColor = useMemo(() => {
    if (isCurrent) return '#ffd97a'
    if (isHovered) return '#fff2c2'
    if (floor.tier === 'sub') return '#1a1a1f'
    if (floor.tier === 'crown') return '#fff8e0'
    if (floor.tier === 'penthouse') return '#f0d28a'
    return '#5a6a7a'
  }, [floor.tier, isCurrent, isHovered])

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    goToFloor(floor.number)
  }

  const handleEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHoveredFloor(floor.number)
    document.body.style.cursor = 'pointer'
  }

  const handleLeave = () => {
    setHoveredFloor(null)
    document.body.style.cursor = 'auto'
  }

  return (
    <group position={[0, y, 0]}>
      {/* Main slab */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[radius, radius * 1.02, height, 64, 1]} />
        <meshStandardMaterial
          color={isCurrent ? '#1a1a20' : isHovered ? '#16161c' : '#0e0e12'}
          metalness={0.85}
          roughness={0.25}
          emissive={isCurrent ? '#3a2a10' : isHovered ? '#1a1408' : '#000000'}
          emissiveIntensity={isCurrent ? 0.6 : isHovered ? 0.4 : 0}
        />
      </mesh>

      {/* Glass curtain wall */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius * 1.005, radius * 1.015, height * 0.92, 64, 1, true]} />
        <meshPhysicalMaterial
          color={glassColor}
          metalness={0.1}
          roughness={0.15}
          transmission={floor.tier === 'sub' ? 0 : 0.55}
          transparent
          opacity={floor.tier === 'sub' ? 0.4 : 0.78}
          emissive={glassColor}
          emissiveIntensity={windowEmissive * 0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Window grid lines (vertical mullions) */}
      {floor.tier !== 'sub' && (
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[radius * 1.018, radius * 1.028, height * 0.85, 64, 1, true]} />
          <meshBasicMaterial color="#0a0a0e" wireframe transparent opacity={0.35} />
        </mesh>
      )}

      {/* Balcony ring for sky-villa & penthouse tiers */}
      {(floor.tier === 'sky' || floor.tier === 'penthouse') && (
        <mesh position={[0, -height * 0.3, 0]}>
          <torusGeometry args={[radius * 1.08, 0.08, 6, 64]} />
          <meshStandardMaterial color={TIER_COLOR[floor.tier]} metalness={0.9} roughness={0.2} />
        </mesh>
      )}

      {/* Status indicator (subtle LED at base) */}
      {floor.tier !== 'sub' && floor.tier !== 'crown' && status && (
        <mesh position={[radius * 0.95, -height * 0.3, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial
            color={
              status === 'available' ? '#3aff7a' : status === 'reserved' ? '#ffaa3a' : '#3a3a3a'
            }
          />
        </mesh>
      )}

      {/* Floor number label for selected / hovered */}
      {(isCurrent || isHovered) && (
        <Text
          position={[radius + 0.6, 0, 0]}
          fontSize={0.55}
          color={isCurrent ? '#ffd97a' : '#ffffff'}
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#000000"
        >
          {floor.number === 100 ? 'CROWN' : `FLOOR ${floor.number}`}
        </Text>
      )}
    </group>
  )
}

interface BuildingProps {
  showAllFloors?: boolean
}

export function Building({ showAllFloors = true }: BuildingProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const { rotationAuto, setRotationAuto } = useStore()

  // Generate the floor stack
  const stack = useMemo(() => {
    const out: { floor: FloorInfo; y: number; index: number }[] = []
    let y = 0
    floors.forEach((f, i) => {
      const h = floorHeight(f)
      out.push({ floor: f, y: y + h / 2, index: i })
      y += h
    })
    return { items: out, totalHeight: y }
  }, [])

  const baseRadius = 6.2

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (rotationAuto) {
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Foundation plinth */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[baseRadius * 1.18, baseRadius * 1.3, 0.6, 64]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Lobby glass cube */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[baseRadius * 1.04, baseRadius * 1.04, 1.4, 64]} />
        <meshPhysicalMaterial
          color="#aaccff"
          metalness={0.0}
          roughness={0.05}
          transmission={0.85}
          thickness={0.5}
          transparent
          opacity={0.6}
          ior={1.4}
        />
      </mesh>

      {/* Spire */}
      <mesh position={[0, stack.totalHeight + 1.2, 0]} castShadow>
        <coneGeometry args={[0.4, 4, 16]} />
        <meshStandardMaterial color="#c39a4f" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Floors */}
      {stack.items
        .filter((s) => showAllFloors || s.floor.tier !== 'sub' || s.floor.number >= 6)
        .map((s) => (
          <Slab
            key={s.floor.number}
            floor={s.floor}
            y={s.y}
            baseRadius={baseRadius}
            index={s.index}
          />
        ))}

      {/* Crown observatory band */}
      <mesh position={[0, stack.totalHeight - 1.2, 0]}>
        <torusGeometry args={[baseRadius * 0.7, 0.15, 8, 64]} />
        <meshStandardMaterial color="#ffd97a" metalness={0.95} roughness={0.1} emissive="#3a2a10" />
      </mesh>
    </group>
  )
}

export function buildingHeight() {
  let y = 0
  floors.forEach((f) => (y += floorHeight(f)))
  return y
}

export function floorY(n: number) {
  let y = 0
  for (let i = 0; i < n; i++) {
    const f = floors[i]
    y += floorHeight(f)
  }
  const f = floors[n]
  return y + floorHeight(f) / 2
}
