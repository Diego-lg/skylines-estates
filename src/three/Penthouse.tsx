import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// Luxury two-story penthouse: double-height living, grand piano,
// floating staircase, plunge pool with city view, private elevator.

function makeDarkMarble() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#1a1a1e'
  ctx.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = `rgba(195, 154, 79, ${0.08 + Math.random() * 0.12})`
    ctx.lineWidth = 0.4 + Math.random() * 1.2
    ctx.beginPath()
    let x = Math.random() * 512
    let y = Math.random() * 512
    ctx.moveTo(x, y)
    for (let j = 0; j < 8; j++) {
      x += (Math.random() - 0.5) * 200
      y += (Math.random() - 0.5) * 200
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 2)
  return tex
}

export function Penthouse() {
  const marbleTex = useMemo(() => makeDarkMarble(), [])

  // Penthouse is 24x18, double-height 6m
  return (
    <group>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 18]} />
        <meshStandardMaterial
          map={marbleTex}
          color="#2a2a2e"
          metalness={0.4}
          roughness={0.25}
        />
      </mesh>

      {/* Ceiling — double height */}
      <mesh rotation-x={Math.PI / 2} position={[0, 7.5, 0]}>
        <planeGeometry args={[24, 18]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3.75, -9]} receiveShadow>
        <planeGeometry args={[24, 7.5]} />
        <meshStandardMaterial color="#e8e3d4" roughness={0.7} />
      </mesh>

      {/* Side walls */}
      <mesh rotation-y={Math.PI / 2} position={[-12, 3.75, 0]} receiveShadow>
        <planeGeometry args={[18, 7.5]} />
        <meshStandardMaterial color="#e8e3d4" roughness={0.7} />
      </mesh>
      <mesh rotation-y={-Math.PI / 2} position={[12, 3.75, 0]} receiveShadow>
        <planeGeometry args={[18, 7.5]} />
        <meshStandardMaterial color="#e8e3d4" roughness={0.7} />
      </mesh>

      {/* Glass front — full height, facing the city */}
      <mesh position={[0, 3.75, 9]}>
        <planeGeometry args={[24, 7.5]} />
        <meshStandardMaterial
          color="#aaccff"
          metalness={0.1}
          roughness={0.05}
          transparent
          opacity={0.22}
        />
      </mesh>
      {/* Mullions */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-12 + ((i + 1) * 24) / 10, 3.75, 9.01]}>
          <boxGeometry args={[0.08, 7.5, 0.08]} />
          <meshStandardMaterial color="#0a0a0e" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 5, 9.01]}>
        <boxGeometry args={[24, 0.05, 0.05]} />
        <meshStandardMaterial color="#0a0a0e" />
      </mesh>

      {/* Grand piano */}
      <group position={[-6, 0, 3]} rotation-y={Math.PI / 6}>
        {/* Body */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2.2, 0.4, 1.5]} />
          <meshStandardMaterial color="#0a0a0e" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Lid */}
        <mesh position={[0, 0.95, -0.3]} rotation-x={-0.4} castShadow>
          <boxGeometry args={[2.0, 0.05, 1.8]} />
          <meshStandardMaterial color="#0a0a0e" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Keyboard */}
        <mesh position={[0, 0.62, 0.6]} castShadow>
          <boxGeometry args={[1.6, 0.04, 0.4]} />
          <meshStandardMaterial color="#f6f1e3" roughness={0.6} />
        </mesh>
        {/* Legs */}
        {[
          [-0.9, -0.6],
          [0.9, -0.6],
          [-0.9, 0.6],
          [0.9, 0.6],
        ].map((p, i) => (
          <mesh key={i} position={[p[0], 0.2, p[1]]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
            <meshStandardMaterial color="#0a0a0e" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Bench */}
        <mesh position={[0, 0.25, 1.4]} castShadow>
          <boxGeometry args={[1.4, 0.08, 0.5]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.6, 0.15, 1.4]} castShadow>
          <boxGeometry args={[0.06, 0.3, 0.06]} />
          <meshStandardMaterial color="#0a0a0e" />
        </mesh>
        <mesh position={[0.6, 0.15, 1.4]} castShadow>
          <boxGeometry args={[0.06, 0.3, 0.06]} />
          <meshStandardMaterial color="#0a0a0e" />
        </mesh>
      </group>

      {/* Large sectional sofa — facing the glass */}
      <group position={[5, 0, 2]}>
        {/* L-shape */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[5, 0.6, 1.4]} />
          <meshStandardMaterial color="#2a2520" roughness={0.9} />
        </mesh>
        <mesh position={[-2, 0.35, 1.2]} castShadow>
          <boxGeometry args={[1.4, 0.6, 1.4]} />
          <meshStandardMaterial color="#2a2520" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.95, -0.6]} castShadow>
          <boxGeometry args={[5, 1.0, 0.25]} />
          <meshStandardMaterial color="#2a2520" roughness={0.9} />
        </mesh>
        <mesh position={[-2.5, 0.95, 1.2]} castShadow>
          <boxGeometry args={[0.25, 1.0, 1.4]} />
          <meshStandardMaterial color="#2a2520" roughness={0.9} />
        </mesh>
        {/* Throw pillows */}
        <mesh position={[-1.5, 0.85, 0.2]} castShadow>
          <boxGeometry args={[0.4, 0.25, 0.4]} />
          <meshStandardMaterial color="#c39a4f" roughness={0.9} />
        </mesh>
        <mesh position={[1.2, 0.85, 0.2]} castShadow>
          <boxGeometry args={[0.4, 0.25, 0.4]} />
          <meshStandardMaterial color="#3a3025" roughness={0.9} />
        </mesh>
      </group>

      {/* Coffee table — marble slab on gold base */}
      <group position={[4, 0, 4]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[2.4, 0.05, 1.0]} />
          <meshStandardMaterial
            color="#1a1a1e"
            metalness={0.2}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-1, 0.22, 0]} castShadow>
          <boxGeometry args={[0.05, 0.45, 1.0]} />
          <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[1, 0.22, 0]} castShadow>
          <boxGeometry args={[0.05, 0.45, 1.0]} />
          <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* decorative book */}
        <mesh position={[0.3, 0.55, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.3]} />
          <meshStandardMaterial color="#c39a4f" />
        </mesh>
        {/* candle */}
        <mesh position={[-0.5, 0.55, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
          <meshStandardMaterial color="#f6f1e3" />
        </mesh>
      </group>

      {/* Plunge pool — small infinity pool along the window */}
      <group position={[0, 0, 6]}>
        {/* Pool basin */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[8, 0.4, 2.4]} />
          <meshStandardMaterial color="#0a0a0e" roughness={0.3} />
        </mesh>
        {/* Water surface */}
        <mesh position={[0, 0.4, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[7.6, 2.0]} />
          <meshPhysicalMaterial
            color="#3a7aaa"
            metalness={0.1}
            roughness={0.05}
            transmission={0.6}
            transparent
            opacity={0.85}
            ior={1.33}
          />
        </mesh>
        {/* Edge overflow */}
        <mesh position={[0, 0.42, 1.21]}>
          <boxGeometry args={[8, 0.04, 0.05]} />
          <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Underwater light */}
        <pointLight position={[0, 0.1, 0]} intensity={0.8} color="#5a9aff" distance={6} />
      </group>

      {/* Floating staircase — gold and glass, leading to mezzanine */}
      <group position={[-9, 0, -5]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, 0.4 + i * 0.45, -i * 0.6]} castShadow>
            <boxGeometry args={[1.6, 0.12, 0.4]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#c39a4f' : '#1a1a1e'}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
        ))}
        {/* Glass railing */}
        <mesh position={[0.85, 2.2, -1.8]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[3, 0.04]} />
          <meshStandardMaterial color="#88aacc" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Private elevator — glass cube on left */}
      <group position={[-10, 0, -7]}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[2, 4, 2]} />
          <meshStandardMaterial
            color="#88aacc"
            transparent
            opacity={0.25}
            metalness={0.1}
            roughness={0.05}
          />
        </mesh>
        {/* Frame */}
        {[
          [0, 2, 1.01],
          [0, 2, -1.01],
          [1.01, 2, 0],
          [-1.01, 2, 0],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <boxGeometry args={[0.05, 4, 0.05]} />
            <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
        {/* Floor indicator */}
        <mesh position={[0, 3.5, 1.02]}>
          <planeGeometry args={[0.6, 0.3]} />
          <meshStandardMaterial color="#c39a4f" emissive="#3a2a10" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Wine wall — back wall feature */}
      <group position={[6, 0, -8.5]}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[3, 4, 0.4]} />
          <meshStandardMaterial color="#0a0a0e" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Wine bottles on shelves */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <mesh
              key={`${row}-${col}`}
              position={[-1.2 + col * 0.5, 0.5 + row * 0.7, 0.22]}
              rotation-z={Math.PI / 2}
            >
              <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
              <meshStandardMaterial
                color={row % 2 === 0 ? '#3a0a0a' : '#0a3a1a'}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
          )),
        )}
        {/* Backlight */}
        <pointLight position={[0, 2, -0.5]} intensity={0.4} color="#ffd9a0" distance={4} />
      </group>

      {/* Statement chandelier — gold ring with crystals */}
      <group position={[0, 6.5, 0]}>
        <mesh>
          <torusGeometry args={[1.8, 0.04, 8, 64]} />
          <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Hanging crystals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2
          return (
            <group key={i} position={[Math.cos(a) * 1.8, 0, Math.sin(a) * 1.8]}>
              <mesh position={[0, -0.3, 0]}>
                <coneGeometry args={[0.06, 0.4, 8]} />
                <meshStandardMaterial
                  color="#fff2c2"
                  emissive="#ffd97a"
                  emissiveIntensity={1.2}
                />
              </mesh>
              <pointLight
                position={[0, -0.3, 0]}
                intensity={0.15}
                color="#ffd9a0"
                distance={3}
              />
            </group>
          )
        })}
      </group>

      {/* Floor uplights */}
      {[-9, 9].map((x) => (
        <mesh key={x} position={[x, 0.05, 8.9]}>
          <boxGeometry args={[0.05, 0.08, 0.05]} />
          <meshStandardMaterial color="#fff2c2" emissive="#ffd97a" emissiveIntensity={2} />
        </mesh>
      ))}

      {/* Penthouse label */}
      <Text
        position={[0, 7, -8.95]}
        fontSize={0.18}
        color="#c39a4f"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        CROWN PENTHOUSE · 99TH FLOOR
      </Text>
    </group>
  )
}
