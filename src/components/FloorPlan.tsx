import { floors, apartmentTypes } from '../data/building'
import { useStore } from '../store'

// Renders a 2D floor plate of the current floor with units laid out.
export function FloorPlan() {
  const { currentFloor, setView } = useStore()
  const floor = floors[currentFloor - 1]
  const layouts = floor.layouts

  // Build a grid of units
  const unit = (id: string, idx: number) => {
    const apt = apartmentTypes.find((a) => a.id === id)!
    return { apt, idx }
  }

  if (floor.tier === 'sub' || floor.tier === 'crown') {
    return (
      <div className="glass rounded-2xl p-5 text-center">
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
          {floor.tier === 'crown' ? 'Crown level' : 'Sub-grade'}
        </div>
        <div className="display text-xl text-ink-50 mt-1">Common use only</div>
      </div>
    )
  }

  if (layouts.length === 1 && (layouts[0] === 'sky-villa' || layouts[0] === 'penthouse')) {
    return (
      <div className="glass rounded-2xl p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
          Floor plan
        </div>
        <div className="display text-xl text-ink-50 mt-1 mb-3">Full floor residence</div>
        <svg viewBox="0 0 200 200" className="w-full h-auto">
          <defs>
            <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="10" y="10" width="180" height="180" fill="url(#hatch)" stroke="#c39a4f" strokeWidth="0.8" rx="2" />
          {/* Inner partitions */}
          <line x1="100" y1="10" x2="100" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <line x1="10" y1="80" x2="190" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <line x1="100" y1="80" x2="100" y2="190" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <text x="50" y="50" fill="rgba(255,255,255,0.5)" fontSize="6" textAnchor="middle">PRIMARY</text>
          <text x="150" y="50" fill="rgba(255,255,255,0.5)" fontSize="6" textAnchor="middle">LIVING</text>
          <text x="50" y="130" fill="rgba(255,255,255,0.5)" fontSize="6" textAnchor="middle">KITCHEN</text>
          <text x="150" y="130" fill="rgba(255,255,255,0.5)" fontSize="6" textAnchor="middle">TERRACE</text>
          <text x="100" y="100" fill="#c39a4f" fontSize="5" textAnchor="middle">— core —</text>
        </svg>
      </div>
    )
  }

  // Multi-unit floor: render a 2x2 grid
  const cells = layouts.map(unit)
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
            Floor plate
          </div>
          <div className="display text-xl text-ink-50 mt-1">{floor.apartments} residences</div>
        </div>
        <button
          onClick={() => setView('room')}
          className="text-[10px] uppercase tracking-[0.22em] text-gold-400 hover:text-gold-500"
        >
          Walk in →
        </button>
      </div>
      <svg viewBox="0 0 200 200" className="w-full h-auto">
        <defs>
          <pattern id="hatch2" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        {/* outer outline */}
        <rect x="10" y="10" width="180" height="180" fill="url(#hatch2)" stroke="#c39a4f" strokeWidth="0.6" rx="2" />
        {/* core */}
        <rect x="90" y="90" width="20" height="20" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <text x="100" y="103" fill="rgba(255,255,255,0.4)" fontSize="4" textAnchor="middle">CORE</text>
        {/* cells */}
        {(() => {
          if (cells.length === 4) {
            return (
              <>
                <rect x="10" y="10" width="80" height="80" fill="rgba(195,154,79,0.04)" stroke="rgba(195,154,79,0.3)" strokeWidth="0.3" />
                <rect x="110" y="10" width="80" height="80" fill="rgba(195,154,79,0.04)" stroke="rgba(195,154,79,0.3)" strokeWidth="0.3" />
                <rect x="10" y="110" width="80" height="80" fill="rgba(195,154,79,0.04)" stroke="rgba(195,154,79,0.3)" strokeWidth="0.3" />
                <rect x="110" y="110" width="80" height="80" fill="rgba(195,154,79,0.04)" stroke="rgba(195,154,79,0.3)" strokeWidth="0.3" />
                {cells.map((c, i) => {
                  const positions = [
                    { x: 50, y: 50 },
                    { x: 150, y: 50 },
                    { x: 50, y: 150 },
                    { x: 150, y: 150 },
                  ]
                  return (
                    <text key={i} x={positions[i].x} y={positions[i].y} fill="#c39a4f" fontSize="6" textAnchor="middle">
                      {c.apt.name}
                    </text>
                  )
                })}
              </>
            )
          }
          if (cells.length === 2) {
            return (
              <>
                <rect x="10" y="10" width="180" height="80" fill="rgba(195,154,79,0.04)" stroke="rgba(195,154,79,0.3)" strokeWidth="0.3" />
                <rect x="10" y="110" width="180" height="80" fill="rgba(195,154,79,0.04)" stroke="rgba(195,154,79,0.3)" strokeWidth="0.3" />
                {cells.map((c, i) => {
                  const positions = [
                    { x: 100, y: 50 },
                    { x: 100, y: 150 },
                  ]
                  return (
                    <text key={i} x={positions[i].x} y={positions[i].y} fill="#c39a4f" fontSize="6" textAnchor="middle">
                      {c.apt.name}
                    </text>
                  )
                })}
              </>
            )
          }
          return null
        })()}
      </svg>
    </div>
  )
}
