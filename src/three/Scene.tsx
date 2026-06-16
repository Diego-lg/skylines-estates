import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Sky,
  AdaptiveDpr,
  AdaptiveEvents,
} from '@react-three/drei'
import { Building, buildingHeight } from './Building'
import { Apartment } from './Apartment'
import { City } from './City'
import { Lobby } from './Lobby'
import { Penthouse } from './Penthouse'
import { Observatory } from './Observatory'
import { useStore } from '../store'
import { floors } from '../data/building'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#a0b0c0" />
      <directionalLight
        position={[20, 40, 15]}
        intensity={1.2}
        color="#fff2d0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <directionalLight position={[-20, 30, -10]} intensity={0.4} color="#7a8aff" />
      <hemisphereLight args={['#88aaff', '#221108', 0.3]} />
    </>
  )
}

function InteriorLighting() {
  // For interior scenes (lobby, penthouse, apartment, observatory)
  return (
    <>
      <ambientLight intensity={0.6} color="#fff5e0" />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.6}
        color="#fff2d0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-10, 8, -5]} intensity={0.3} color="#ffd9a0" />
    </>
  )
}

function GroundReflections() {
  return <ContactShadows position={[0, -0.35, 0]} opacity={0.4} scale={40} blur={2.5} far={10} />
}

// Single source of truth for floor height
function floorH(f: typeof floors[number]) {
  if (f.tier === 'sub') return 1.6
  if (f.tier === 'crown') return 4.0
  if (f.tier === 'penthouse') return 2.4
  if (f.tier === 'sky') return 1.9
  return 1.15
}

function floorY(n: number) {
  let y = 0
  for (let i = 0; i < n - 1; i++) {
    y += floorH(floors[i])
  }
  return y + floorH(floors[n - 1]) / 2
}

function HeroCamera() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(28, 22, 32)
    camera.lookAt(0, buildingHeight() * 0.45, 0)
  }, [camera])
  return null
}

function BuildingCamera() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(38, buildingHeight() * 0.5, 38)
    camera.lookAt(0, buildingHeight() * 0.5, 0)
  }, [camera])
  return null
}

function FloorCamera({ floor }: { floor: number }) {
  const { camera } = useThree()
  useEffect(() => {
    const y = floorY(floor)
    camera.position.set(18, y, 12)
    camera.lookAt(0, y, 0)
  }, [camera, floor])
  return null
}

function RoomCamera() {
  const { camera } = useThree()
  useEffect(() => {
    // Apartment is 12 wide (X: -6..6) x 10 deep (Z: -5..5) x 3.4 high.
    // Place camera inside the room near the front-right corner, looking
    // diagonally across to the living area and kitchen.
    camera.position.set(4.2, 1.7, 3.2)
    camera.lookAt(-1.5, 1.2, -1.5)
  }, [camera])
  return null
}

function PenthouseCamera() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(14, 4.5, 14)
    camera.lookAt(0, 3, 0)
  }, [camera])
  return null
}

function LobbyCamera() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 1.7, 12)
    camera.lookAt(0, 4, -3)
  }, [camera])
  return null
}

function ObservatoryCamera() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(15, 4, 15)
    camera.lookAt(0, 1.5, 0)
  }, [camera])
  return null
}

export function Scene3D() {
  const view = useStore((s) => s.view)
  const currentFloor = useStore((s) => s.currentFloor)
  const showAllFloors = useStore((s) => s.showAllFloors)

  const isInterior = view === 'room' || view === 'penthouse' || view === 'amenities' || view === 'lobby' || view === 'observatory'

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        {isInterior ? <InteriorLighting /> : <SceneLighting />}
        <fog attach="fog" args={['#06060a', 60, 220]} />
        {!isInterior && (
          <Sky
            distance={450000}
            sunPosition={[10, 4, 8]}
            inclination={0.5}
            azimuth={0.25}
            mieCoefficient={0.005}
            mieDirectionalG={0.85}
            rayleigh={0.5}
            turbidity={4}
          />
        )}
        <Environment preset="sunset" />

        {view === 'hero' && (
          <>
            <HeroCamera />
            <City />
            <Building showAllFloors={showAllFloors} />
            <GroundReflections />
          </>
        )}

        {view === 'building' && (
          <>
            <BuildingCamera />
            <City />
            <Building showAllFloors={showAllFloors} />
            <GroundReflections />
          </>
        )}

        {view === 'floor' && (
          <>
            <FloorCamera floor={currentFloor} />
            <City />
            <Building showAllFloors={true} />
            <GroundReflections />
            <mesh position={[0, floorY(currentFloor), 0]} rotation-x={-Math.PI / 2}>
              <ringGeometry args={[6.5, 7.2, 64]} />
              <meshBasicMaterial color="#ffd97a" transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>
          </>
        )}

        {view === 'room' && (
          <>
            <RoomCamera />
            <Apartment />
          </>
        )}

        {view === 'penthouse' && (
          <>
            <PenthouseCamera />
            <Penthouse />
          </>
        )}

        {view === 'amenities' && (
          <>
            <LobbyCamera />
            <Lobby />
          </>
        )}

        {view === 'lobby' && (
          <>
            <LobbyCamera />
            <Lobby />
          </>
        )}

        {view === 'observatory' && (
          <>
            <ObservatoryCamera />
            <Observatory />
          </>
        )}

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={isInterior ? 3 : 8}
          maxDistance={isInterior ? (view === 'lobby' ? 28 : 20) : 90}
          minPolarAngle={isInterior ? Math.PI * 0.15 : Math.PI * 0.1}
          maxPolarAngle={isInterior ? Math.PI * 0.55 : Math.PI * 0.5}
          enablePan={isInterior}
          target={
            view === 'room'
              ? [-1.5, 1.2, -1.5]
              : view === 'penthouse'
                ? [0, 3, 0]
                : view === 'amenities' || view === 'lobby'
                  ? [0, 4, -3]
                  : view === 'observatory'
                    ? [0, 1.5, 0]
                    : [0, buildingHeight() * 0.5, 0]
          }
        />
        <AdaptiveDpr pixelated={false} />
        <AdaptiveEvents />
      </Suspense>
    </Canvas>
  )
}
