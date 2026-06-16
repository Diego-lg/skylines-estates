import { useMemo } from 'react'
import * as THREE from 'three'

// Procedural neighboring city for context
function makeBuildingTexture(seed: number) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#0a0a0e'
  ctx.fillRect(0, 0, 128, 128)
  // Random lit windows
  const rng = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280
    return x - Math.floor(x)
  }
  for (let y = 0; y < 128; y += 8) {
    for (let x = 0; x < 128; x += 8) {
      const r = rng(y * 16 + x)
      if (r > 0.6) {
        const intensity = 0.4 + rng(x + y * 3) * 0.6
        ctx.fillStyle =
          r > 0.85
            ? `rgba(255, 220, 150, ${intensity})`
            : `rgba(180, 200, 220, ${intensity * 0.6})`
        ctx.fillRect(x + 1, y + 1, 5, 5)
      }
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

function CityBuilding({
  position,
  height,
  width,
  depth,
  seed,
}: {
  position: [number, number, number]
  height: number
  width: number
  depth: number
  seed: number
}) {
  const tex = useMemo(() => {
    const t = makeBuildingTexture(seed)
    t.repeat.set(Math.max(1, width / 3), Math.max(1, height / 3))
    return t
  }, [seed, width, height])

  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial map={tex} color="#1a1a20" metalness={0.6} roughness={0.5} />
    </mesh>
  )
}

export function City() {
  const buildings = useMemo(() => {
    const arr: {
      position: [number, number, number]
      height: number
      width: number
      depth: number
      seed: number
    }[] = []
    const rng = (n: number) => {
      const x = Math.sin(n * 9301 + 49297) * 233280
      return x - Math.floor(x)
    }
    let i = 0
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 16; c++) {
        const angle = (c / 16) * Math.PI * 2
        const radius = 28 + r * 9
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        // Skip directly behind camera
        if (Math.abs(x) < 8 && Math.abs(z) < 8) continue
        const heightSeed = rng(i * 7)
        const height = 6 + heightSeed * 30
        const width = 3 + rng(i * 13) * 3
        const depth = 3 + rng(i * 19) * 3
        arr.push({
          position: [x, height / 2, z],
          height,
          width,
          depth,
          seed: i,
        })
        i++
      }
    }
    return arr
  }, [])

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.4, 0]} receiveShadow>
        <circleGeometry args={[180, 64]} />
        <meshStandardMaterial color="#08080c" roughness={0.95} />
      </mesh>
      {/* Road grid */}
      <gridHelper args={[200, 40, '#1a1a22', '#0e0e14']} position={[0, -0.39, 0]} />
      {buildings.map((b, i) => (
        <CityBuilding key={i} {...b} />
      ))}
    </group>
  )
}
