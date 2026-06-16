import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// A simple but evocative apartment interior: open plan with kitchen island,
// living seating area, bedroom, and floor-to-ceiling windows looking out.
// Uses standard materials only — no transmission — to avoid z-fighting/flicker.

function makeFloorTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  // warm wood
  ctx.fillStyle = '#2a1f15'
  ctx.fillRect(0, 0, 256, 256)
  // planks
  for (let y = 0; y < 256; y += 32) {
    ctx.strokeStyle = '#1a120a'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(256, y)
    ctx.stroke()
  }
  // grain noise
  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * 256
    const y = Math.random() * 256
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.08})`
    ctx.fillRect(x, y, 1, 2)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  return tex
}

function makeWallTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#f0ece1'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 256
    const y = Math.random() * 256
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.04})`
    ctx.fillRect(x, y, 2, 2)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 2)
  return tex
}

// Sky gradient for the window view
function makeSkyTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const ctx = c.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#1a2a4a')
  grad.addColorStop(0.3, '#4a5a7a')
  grad.addColorStop(0.5, '#8a7a6a')
  grad.addColorStop(0.7, '#c39a6a')
  grad.addColorStop(1, '#e8b06a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)
  // Distant building silhouettes
  ctx.fillStyle = '#0a0a14'
  for (let i = 0; i < 20; i++) {
    const x = i * 26
    const h = 40 + Math.random() * 200
    ctx.fillRect(x, 512 - h, 22, h)
  }
  // Window lights on distant buildings
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 512
    const y = 300 + Math.random() * 200
    ctx.fillStyle = `rgba(255, 220, 150, ${0.3 + Math.random() * 0.5})`
    ctx.fillRect(x, y, 1.5, 1.5)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function Apartment({
  width = 12,
  depth = 10,
  height = 3.4,
}: {
  width?: number
  depth?: number
  height?: number
}) {
  const floorTex = useMemo(() => makeFloorTexture(), [])
  const wallTex = useMemo(() => makeWallTexture(), [])
  const skyTex = useMemo(() => makeSkyTexture(), [])

  return (
    <group position={[0, 0, 0]}>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={floorTex} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation-x={Math.PI / 2} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f6f1e3" roughness={0.9} />
      </mesh>

      {/* Back wall (opposite the windows) */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={wallTex} color="#e8e3d4" roughness={0.85} />
      </mesh>

      {/* Side walls */}
      <mesh rotation-y={Math.PI / 2} position={[-width / 2, height / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#e8e3d4" roughness={0.85} />
      </mesh>
      <mesh rotation-y={-Math.PI / 2} position={[width / 2, height / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#e8e3d4" roughness={0.85} />
      </mesh>

      {/* Sky/backdrop behind the window — gives sense of city outside */}
      <mesh position={[0, height / 2, depth / 2 - 0.1]}>
        <planeGeometry args={[width * 1.5, height * 1.5]} />
        <meshBasicMaterial map={skyTex} />
      </mesh>

      {/* Window glass — solid tinted, no transmission */}
      <mesh position={[0, height / 2, depth / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#a8c8e8"
          metalness={0.2}
          roughness={0.05}
          transparent
          opacity={0.2}
        />
      </mesh>
      {/* Window mullions */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          position={[-width / 2 + ((i + 1) * width) / 6, height / 2, depth / 2 + 0.01]}
        >
          <boxGeometry args={[0.05, height, 0.05]} />
          <meshStandardMaterial color="#0a0a0e" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, height * 0.55, depth / 2 + 0.01]}>
        <boxGeometry args={[width, 0.05, 0.05]} />
        <meshStandardMaterial color="#0a0a0e" />
      </mesh>
      <mesh position={[0, height * 0.25, depth / 2 + 0.01]}>
        <boxGeometry args={[width, 0.04, 0.04]} />
        <meshStandardMaterial color="#0a0a0e" />
      </mesh>
      {/* Window sill */}
      <mesh position={[0, 0.05, depth / 2 - 0.1]}>
        <boxGeometry args={[width, 0.1, 0.2]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Sofa */}
      <group position={[-3.2, 0, -3.2]} rotation-y={Math.PI / 6}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[3.4, 0.5, 1.1]} />
          <meshStandardMaterial color="#3a3631" roughness={0.85} />
        </mesh>
        <mesh position={[-0.9, 0.55, 0.1]} castShadow>
          <boxGeometry args={[1.0, 0.25, 1.0]} />
          <meshStandardMaterial color="#5a4f3f" roughness={0.9} />
        </mesh>
        <mesh position={[0.0, 0.55, 0.1]} castShadow>
          <boxGeometry args={[1.0, 0.25, 1.0]} />
          <meshStandardMaterial color="#5a4f3f" roughness={0.9} />
        </mesh>
        <mesh position={[0.9, 0.55, 0.1]} castShadow>
          <boxGeometry args={[1.0, 0.25, 1.0]} />
          <meshStandardMaterial color="#5a4f3f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.95, -0.4]} castShadow>
          <boxGeometry args={[3.4, 0.9, 0.25]} />
          <meshStandardMaterial color="#3a3631" roughness={0.85} />
        </mesh>
      </group>

      {/* Coffee table */}
      <group position={[-3.2, 0, -1.6]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.6, 0.05, 0.7]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[-0.7, 0.2, 0]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.7]} />
          <meshStandardMaterial color="#0a0a0e" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.7, 0.2, 0]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.7]} />
          <meshStandardMaterial color="#0a0a0e" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.2, 0.5, 0]}>
          <boxGeometry args={[0.3, 0.05, 0.2]} />
          <meshStandardMaterial color="#c39a4f" />
        </mesh>
        <mesh position={[0.2, 0.55, 0]}>
          <boxGeometry args={[0.25, 0.05, 0.18]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
      </group>

      {/* Kitchen island */}
      <group position={[3.0, 0, -2.4]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[2.4, 0.9, 1.0]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.91, 0]} castShadow>
          <boxGeometry args={[2.5, 0.05, 1.1]} />
          <meshStandardMaterial color="#e8e3d4" metalness={0.1} roughness={0.3} />
        </mesh>
        {/* Pendant lights */}
        <mesh position={[-0.7, 1.7, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#fff2c2"
            emissive="#ffd97a"
            emissiveIntensity={1.4}
          />
        </mesh>
        <mesh position={[0.0, 1.7, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#fff2c2" emissive="#ffd97a" emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[0.7, 1.7, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#fff2c2" emissive="#ffd97a" emissiveIntensity={1.4} />
        </mesh>
        {/* Bar stools */}
        {[-0.7, 0, 0.7].map((x, i) => (
          <group key={i} position={[x, 0, 0.9]}>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
              <meshStandardMaterial color="#1a1a1e" metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.5, 16]} />
              <meshStandardMaterial color="#3a2a1f" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Bed */}
      <group position={[3.6, 0, 2.5]} rotation-y={-Math.PI / 2}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[2.4, 0.4, 3.0]} />
          <meshStandardMaterial color="#1a1a1e" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[2.2, 0.3, 2.8]} />
          <meshStandardMaterial color="#f0ece1" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.0, -1.45]} castShadow>
          <boxGeometry args={[2.4, 1.2, 0.1]} />
          <meshStandardMaterial color="#3a2f25" roughness={0.6} />
        </mesh>
        <mesh position={[-0.6, 0.78, -1.0]} castShadow>
          <boxGeometry args={[0.6, 0.18, 0.4]} />
          <meshStandardMaterial color="#fff8e0" roughness={0.9} />
        </mesh>
        <mesh position={[0.6, 0.78, -1.0]} castShadow>
          <boxGeometry args={[0.6, 0.18, 0.4]} />
          <meshStandardMaterial color="#fff8e0" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.71, 0.5]} rotation-x={-0.1}>
          <boxGeometry args={[1.8, 0.05, 1.2]} />
          <meshStandardMaterial color="#c39a4f" roughness={0.9} />
        </mesh>
      </group>

      {/* Floor lamp */}
      <group position={[-5, 0, -3.5]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.8, 8]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 2.7, 0]}>
          <coneGeometry args={[0.25, 0.4, 16, 1, true]} />
          <meshStandardMaterial
            color="#fff2c2"
            emissive="#ffd97a"
            emissiveIntensity={1.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight position={[0, 2.5, 0]} intensity={0.8} color="#ffd9a0" distance={6} />
      </group>

      {/* Plant */}
      <group position={[-5.3, 0, 1.8]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.3, 0.25, 0.5, 16]} />
          <meshStandardMaterial color="#2a1f15" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <icosahedronGeometry args={[0.6, 1]} />
          <meshStandardMaterial color="#3a6a4a" roughness={0.8} />
        </mesh>
        <mesh position={[0.3, 1.3, 0.1]}>
          <icosahedronGeometry args={[0.4, 1]} />
          <meshStandardMaterial color="#4a7a5a" roughness={0.8} />
        </mesh>
      </group>

      {/* Art on back wall */}
      <group position={[0, 1.8, -depth / 2 + 0.05]}>
        <mesh>
          <planeGeometry args={[2.0, 1.4]} />
          <meshStandardMaterial color="#0a0a0e" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.85, 1.25]} />
          <meshStandardMaterial color="#c39a4f" emissive="#3a2a10" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Area rug under living area */}
      <mesh rotation-x={-Math.PI / 2} position={[-3.2, 0.01, -2.4]}>
        <planeGeometry args={[5, 3.5]} />
        <meshStandardMaterial color="#2a2520" roughness={0.95} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[-3.2, 0.015, -2.4]}>
        <planeGeometry args={[4.5, 3.0]} />
        <meshStandardMaterial color="#3a3025" roughness={0.95} />
      </mesh>

      {/* Apartment label */}
      <Text
        position={[0, height - 0.4, -depth / 2 + 0.05]}
        fontSize={0.18}
        color="#c39a4f"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        AETHER TOWER · SKY RESIDENCE
      </Text>
    </group>
  )
}
