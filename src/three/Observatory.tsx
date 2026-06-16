import { Text } from '@react-three/drei'
import * as THREE from 'three'

// Floor 100 — Crown Observatory: open-air helipad, telescope, viewing deck
export function Observatory() {
  return (
    <group>
      {/* Helipad deck — circular, 20m diameter */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[10, 10, 0.2, 64]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Painted H */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.11, 0]}>
        <ringGeometry args={[9, 9.4, 64]} />
        <meshBasicMaterial color="#c39a4f" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.12, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#c39a4f" />
      </mesh>
      {/* Big H letter — built from boxes */}
      <mesh position={[-2, 0.12, 0]}>
        <boxGeometry args={[0.4, 0.02, 4]} />
        <meshBasicMaterial color="#c39a4f" />
      </mesh>
      <mesh position={[2, 0.12, 0]}>
        <boxGeometry args={[0.4, 0.02, 4]} />
        <meshBasicMaterial color="#c39a4f" />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[4, 0.02, 0.4]} />
        <meshBasicMaterial color="#c39a4f" />
      </mesh>

      {/* Safety railing — glass + gold posts */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2
        const r = 9.8
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, 1.1, Math.sin(a) * r]}
            castShadow
          >
            <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
            <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} />
          </mesh>
        )
      })}
      {/* Top rail */}
      <mesh position={[0, 2.2, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[9.8, 0.04, 8, 64]} />
        <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Glass infill */}
      <mesh position={[0, 1.1, 0]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[9.8, 9.8, 2.0, 64, 1, true]} />
        <meshStandardMaterial
          color="#88aacc"
          transparent
          opacity={0.15}
          metalness={0.1}
          roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Telescope — center, on gold tripod */}
      <group position={[-5, 0, -3]} rotation-y={Math.PI / 4}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.4, 8]} />
          <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.5, 0.08, 16]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Telescope tube */}
        <mesh position={[0, 1.6, 0]} rotation-z={Math.PI / 6} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 1.4, 16]} />
          <meshStandardMaterial color="#c39a4f" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.7, 2.3, 0]} rotation-z={Math.PI / 6} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 16]} />
          <meshStandardMaterial color="#0a0a0e" />
        </mesh>
      </group>

      {/* Compass rose inlay on the deck */}
      <group position={[5, 0.12, -3]}>
        <mesh>
          <circleGeometry args={[1.5, 32]} />
          <meshStandardMaterial color="#0a0a0e" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh>
          <ringGeometry args={[1.2, 1.3, 32]} />
          <meshBasicMaterial color="#c39a4f" />
        </mesh>
        <Text
          position={[0, 0.02, -1.0]}
          fontSize={0.3}
          color="#c39a4f"
          anchorX="center"
          anchorY="middle"
          rotation-x={-Math.PI / 2}
        >
          N
        </Text>
        <Text
          position={[0, 0.02, 1.0]}
          fontSize={0.3}
          color="#c39a4f"
          anchorX="center"
          anchorY="middle"
          rotation-x={-Math.PI / 2}
        >
          S
        </Text>
        <Text
          position={[-1.0, 0.02, 0]}
          fontSize={0.3}
          color="#c39a4f"
          anchorX="center"
          anchorY="middle"
          rotation-x={-Math.PI / 2}
        >
          W
        </Text>
        <Text
          position={[1.0, 0.02, 0]}
          fontSize={0.3}
          color="#c39a4f"
          anchorX="center"
          anchorY="middle"
          rotation-x={-Math.PI / 2}
        >
          E
        </Text>
      </group>

      {/* Lounge pod — circular daybed */}
      <group position={[0, 0, 4]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[2, 2, 0.4, 32]} />
          <meshStandardMaterial color="#2a2520" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[1.9, 1.9, 0.2, 32]} />
          <meshStandardMaterial color="#f6f1e3" roughness={0.8} />
        </mesh>
        {/* Pillows */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 1.5, 0.95, Math.sin(a) * 1.5]}
              castShadow
            >
              <boxGeometry args={[0.4, 0.2, 0.4]} />
              <meshStandardMaterial color="#c39a4f" roughness={0.9} />
            </mesh>
          )
        })}
      </group>

      {/* Beacon light — rotating */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.7} />
        </mesh>
        <mesh position={[0, 4.5, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#ff3333"
            emissive="#ff0000"
            emissiveIntensity={2}
          />
        </mesh>
        <pointLight position={[0, 4.5, 0]} intensity={1.5} color="#ff3333" distance={5} />
      </group>

      {/* Crown label */}
      <Text
        position={[0, 4.2, -9.7]}
        fontSize={0.3}
        color="#c39a4f"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.4}
      >
        FLOOR 100 · CROWN
      </Text>
      <Text
        position={[0, 3.6, -9.7]}
        fontSize={0.12}
        color="#888"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.5}
      >
        OBSERVATORY DECK
      </Text>
    </group>
  )
}
