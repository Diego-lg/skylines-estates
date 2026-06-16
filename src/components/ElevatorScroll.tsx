import { useStore } from '../store'

// Vertical "elevator" floor picker for the floor view
export function ElevatorScroll() {
  const { currentFloor, setCurrentFloor, view } = useStore()
  if (view !== 'floor' && view !== 'building') return null

  // Show 11 floors around the current one
  const start = Math.max(8, currentFloor - 5)
  const end = Math.min(99, start + 10)
  const items: number[] = []
  for (let i = start; i <= end; i++) items.push(i)

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
      <div className="glass rounded-full px-2 py-3 flex flex-col items-center gap-1">
        <div className="text-[9px] uppercase tracking-[0.22em] text-white/40 mb-1">
          Floor
        </div>
        {items
          .slice()
          .reverse()
          .map((f) => (
            <button
              key={f}
              onClick={() => setCurrentFloor(f)}
              className={`w-9 h-7 rounded-md text-[11px] font-medium tabular-nums transition-all ${
                f === currentFloor
                  ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        <div className="w-px h-6 bg-white/10 my-1" />
        <button
          onClick={() => setCurrentFloor(99)}
          className={`w-9 h-9 rounded-md text-[10px] font-medium flex items-center justify-center ${
            currentFloor === 99
              ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950'
              : 'text-gold-400 border border-gold-400/30'
          }`}
        >
          P
        </button>
      </div>
    </div>
  )
}
