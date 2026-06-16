import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// Triple-height sky lobby: marble floor, concierge desk, lounge seating,
// art installation, and floor-to-ceiling glass looking out at the city.

function makeMarbleTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const ctx = c.getContext('2d')!
  // base cream
  ctx.fillStyle = '#e8e3d4'
  ctx.fillRect(0, 0, 512, 512)
  // veins
  for (let i = 0; i < 30; i++) {
    ctx.strokeStyle = `rgba(120, 100, 80, ${0.1 + Math.random() * 0.15})`
    ctx.lineWidth = 0.5 + Math.random() * 1.5
    ctx.beginPath()
    let x = Math.random() * 512
    let y = Math.random() * 512
    ctx.moveTo(x, y)
    for (let j = 0; j < 6; j++) {
      x += (Math.random() - 0.5) * 200
      y += (Math.random() - 0.5) * 200
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  // noise
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 2)
  return tex
}

export function Lobby() {
  const marbleTex = useMemo(() => makeMarbleTexture(), [])

  return (
    <group>
      {/* Floor — polished marble */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial
          map={marbleTex}
          color="#f0ece1"
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Ceiling — coffered, very high (12m triple height) */}
      <mesh rotation-x={Math.PI / 2} position={[0, 12, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 6, -15]} receiveShadow>
        <planeGeometry args={[40, 12]} />
        <meshStandardMaterial color="#e8e3d4" roughness={0.7} />
      </mesh>

      {/* Side walls */}
      <mesh rotation-y={Math.PI / 2} position={[-20, 6, 0]} receiveShadow>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#e8e3d4" roughness={0.7} />
      </mesh>
      <mesh rotation-y={-Math.PI / 2} position={[20, 6, 0]} receiveShadow>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#e8e3d4" roughness={0.7} />
      </mesh>

      {/* Glass front wall — facing the city */}
      <mesh position={[0, 6, 15]}>
        <planeGeometry args={[40, 12]} />
        <meshStandardMaterial
          color="#aaccff"
          metalness={0.1}
          roughness={0.05}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Glass mullions */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-20 + ((i + 1) * 40) / 10, 6, 15.01]}>
          <boxGeometry args={[0.08, 12, 0.08]} />
          <meshStandardMaterial color="#0a0a0e" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Concierge desk — large curved marble counter */}
      <group position={[0, 0, -10]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[8, 1.1, 2.2]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.12, 0]} castShadow>
          <boxGeometry args={[8.2, 0.08, 2.4]} />
          <meshStandardMaterial color="#f0ece1" metalness={0.2} roughness={0.3} />
        </mesh>
        {/* Gold trim */}
        <mesh position={[0, 0.05, 1.1]}>
          <boxGeometry args={[8, 0.04, 0.04]} />
          <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Pendant over desk */}
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[0.4, 0.6, 0.8, 16, 1, true]} />
          <meshStandardMaterial
            color="#fff2c2"
            emissive="#ffd97a"
            emissiveIntensity={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight position={[0, 3.5, 0]} intensity={1.2} color="#ffd9a0" distance={10} />
      </group>

      {/* Lounge seating — left cluster */}
      <group position={[-10, 0, 4]}>
        {/* Sofa 1 */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3, 0.6, 1.2]} />
          <meshStandardMaterial color="#3a3025" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.0, -0.5]} castShadow>
          <boxGeometry args={[3, 0.8, 0.2]} />
          <meshStandardMaterial color="#3a3025" roughness={0.85} />
        </mesh>
        {/* Sofa 2 */}
        <mesh position={[3, 0.4, 1.5]} rotation-y={-Math.PI / 2} castShadow>
          <boxGeometry args={[3, 0.6, 1.2]} />
          <meshStandardMaterial color="#3a3025" roughness={0.85} />
        </mesh>
        <mesh position={[4.4, 1.0, 1.5]} rotation-y={-Math.PI / 2} castShadow>
          <boxGeometry args={[3, 0.8, 0.2]} />
          <meshStandardMaterial color="#3a3025" roughness={0.85} />
        </mesh>
        {/* Coffee table */}
        <mesh position={[1.5, 0.3, 0.8]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[1.5, 0.15, 0.8]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 0.3, 16]} />
          <meshStandardMaterial color="#0a0a0e" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Lounge seating — right cluster */}
      <group position={[10, 0, 4]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3, 0.6, 1.2]} />
          <meshStandardMaterial color="#3a3025" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.0, -0.5]} castShadow>
          <boxGeometry args={[3, 0.8, 0.2]} />
          <meshStandardMaterial color="#3a3025" roughness={0.85} />
        </mesh>
        <mesh position={[-3, 0.4, 1.5]} rotation-y={Math.PI / 2} castShadow>
          <boxGeometry args={[3, 0.6, 1.2]} />
          <meshStandardMaterial color="#3a3025" roughness={0.85} />
        </mesh>
      </group>

      {/* Centerpiece art installation — gold geometric sculpture */}
      <group position={[0, 0, -2]}>
        <mesh position={[0, 2.5, 0]} castShadow>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} emissive="#3a2a10" />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.5, 0.1, 16]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 0.1, 16]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Wall art — large gold-leaf piece */}
      <group position={[0, 6, -14.99]}>
        <mesh>
          <planeGeometry args={[6, 4]} />
          <meshStandardMaterial color="#0a0a0e" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[5.6, 3.6]} />
          <meshStandardMaterial color="#c39a4f" emissive="#3a2a10" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[3, 2.4]} />
          <meshStandardMaterial color="#1a1a1e" />
        </mesh>
      </group>

      {/* Tall planters with trees */}
      {[[-16, 0, 8], [16, 0, 8]].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.8, 1, 16]} />
            <meshStandardMaterial color="#2a1f15" roughness={0.7} />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
            <icosahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#3a6a4a" roughness={0.8} />
          </mesh>
          <mesh position={[0.5, 3.2, 0.3]} castShadow>
            <icosahedronGeometry args={[0.8, 1]} />
            <meshStandardMaterial color="#4a7a5a" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Recessed ceiling lights — visible glow points */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[-12 + i * 5, 11.9, -8]}>
          <mesh>
            <circleGeometry args={[0.4, 16]} />
            <meshStandardMaterial color="#fff2c2" emissive="#ffd97a" emissiveIntensity={1.5} />
          </mesh>
          <pointLight position={[0, -0.5, 0]} intensity={0.4} color="#ffd9a0" distance={8} />
        </group>
      ))}

      {/* Floor-level uplight strips along the back wall */}
      {[-12, -6, 0, 6, 12].map((x) => (
        <mesh key={x} position={[x, 0.05, -14.9]}>
          <boxGeometry args={[0.05, 0.08, 0.05]} />
          <meshStandardMaterial color="#fff2c2" emissive="#ffd97a" emissiveIntensity={2} />
        </mesh>
      ))}

      {/* Brand text on wall */}
      <Text
        position={[0, 10, -14.95]}
        fontSize={0.6}
        color="#c39a4f"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
      >
        AETHER
      </Text>
      <Text
        position={[0, 9, -14.95]}
        fontSize={0.25}
        color="#888"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.6}
      >
        RESIDENCES
      </Text>

      {/* Entry corridor hint — dark passage on the back */}
      <mesh position={[0, 3, -14.5]}>
        <boxGeometry args={[3, 6, 0.5]} />
        <meshStandardMaterial color="#06060a" />
      </mesh>
    </group>
  )
}
