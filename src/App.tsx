import { useStore } from './store'
import { Scene3D } from './three/Scene'
import { TopBar, MobileNav } from './components/TopBar'
import {
  HeroPanel,
  BuildingPanel,
  FloorPanel,
  RoomPanel,
  PenthousePanel,
  AmenitiesPanel,
  LobbyPanel,
  ObservatoryPanel,
  ContactPanel,
} from './components/Panels'
import { FloorPlan } from './components/FloorPlan'
import { ElevatorScroll } from './components/ElevatorScroll'
import { Loader } from './components/Loader'
import { building } from './data/building'

function PanelColumn() {
  const view = useStore((s) => s.view)
  const isContact = view === 'contact'
  return (
    <div className="pointer-events-none">
      <div
        className={`fixed left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 w-[90vw] sm:w-[28rem] max-w-md max-h-[80vh] overflow-y-auto pointer-events-auto pr-2 ${
          isContact ? 'rounded-3xl bg-ink-950/85 border border-white/10 p-6 -ml-0' : ''
        }`}
      >
        {view === 'hero' && <HeroPanel />}
        {view === 'building' && <BuildingPanel />}
        {view === 'floor' && <FloorPanel />}
        {view === 'room' && (
          <div className="space-y-4">
            <RoomPanel />
            <FloorPlan />
          </div>
        )}
        {view === 'penthouse' && <PenthousePanel />}
        {view === 'amenities' && <AmenitiesPanel />}
        {view === 'lobby' && <LobbyPanel />}
        {view === 'observatory' && <ObservatoryPanel />}
        {view === 'contact' && <ContactPanel />}
      </div>
    </div>
  )
}

function BottomCaption() {
  const view = useStore((s) => s.view)
  const currentFloor = useStore((s) => s.currentFloor)
  const captions: Record<string, string> = {
    hero: 'Scroll, drag, click — explore the tower.',
    building: 'Click any floor slab to enter that level.',
    floor: `Floor ${currentFloor} · drag to rotate`,
    room: 'Inside the residence · drag to look around',
    penthouse: 'Crown penthouse · interior · drag to look around',
    amenities: 'Sub-grade amenities · drag to look around',
    lobby: 'Sky lobby · drag to look around',
    observatory: 'Crown observatory · floor 100 · drag to look around',
    contact: 'Sales gallery · by appointment',
  }
  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div className="glass rounded-full px-4 py-2 text-[11px] text-white/60 tracking-wide">
        {captions[view]}
      </div>
    </div>
  )
}

function HeroOverlay() {
  const view = useStore((s) => s.view)
  if (view !== 'hero') return null
  return (
    <>
      <div className="fixed top-0 right-0 w-1/2 h-full pointer-events-none bg-gradient-to-l from-black/40 to-transparent" />
      <div className="fixed bottom-0 left-0 w-full h-1/3 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />
    </>
  )
}

function ContactScrim() {
  const view = useStore((s) => s.view)
  if (view !== 'contact') return null
  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(6,6,10,0.92) 0%, rgba(6,6,10,0.98) 60%, rgba(6,6,10,1) 100%)',
      }}
    />
  )
}

function StatsBar() {
  const view = useStore((s) => s.view)
  if (view !== 'building' && view !== 'floor' && view !== 'hero') return null
  return (
    <div className="fixed top-24 right-6 z-20 hidden lg:block">
      <div className="glass rounded-2xl p-4 space-y-3 text-xs w-48">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">Residences</div>
          <div className="display text-2xl text-ink-50 mt-0.5">412</div>
        </div>
        <div className="h-divider" />
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">Available</div>
          <div className="display text-2xl text-emerald-300 mt-0.5">218</div>
        </div>
        <div className="h-divider" />
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">Avg. $/sqft</div>
          <div className="display text-2xl gold-text mt-0.5">$3.4K</div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-ink-950 text-ink-50">
      <Loader />
      <Scene3D />
      <HeroOverlay />
      <ContactScrim />
      <TopBar />
      <StatsBar />
      <PanelColumn />
      <ElevatorScroll />
      <BottomCaption />
      <MobileNav />
      <footer className="hidden lg:block fixed bottom-3 right-6 z-30 text-[10px] text-white/30 uppercase tracking-[0.22em] pointer-events-none">
        © Aether Tower · {building.yearBuilt}
      </footer>
    </div>
  )
}
