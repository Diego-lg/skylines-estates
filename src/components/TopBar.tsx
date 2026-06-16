import { useStore, type ViewName } from '../store'
import { building } from '../data/building'

const VIEWS: { id: ViewName; label: string; sub: string }[] = [
  { id: 'hero', label: 'Overview', sub: '01' },
  { id: 'building', label: 'Tower', sub: '02' },
  { id: 'floor', label: 'Floor', sub: '03' },
  { id: 'room', label: 'Residence', sub: '04' },
  { id: 'penthouse', label: 'Penthouse', sub: '05' },
  { id: 'lobby', label: 'Lobby', sub: '06' },
  { id: 'observatory', label: 'Crown', sub: '07' },
  { id: 'contact', label: 'Inquire', sub: '08' },
]

export function TopBar() {
  const { view, setView } = useStore()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-center justify-between px-4 lg:px-10 py-5">
        <button
          onClick={() => setView('hero')}
          className="pointer-events-auto group flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-md border border-gold-500/40 bg-ink-950 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 19V9l3-2 3 2v10h-2v-4H7v4H5z" fill="#c39a4f" />
              <path d="M14 19V5l4-3 4 3v14h-2v-5h-2v5h-2v-5h-2v5h-2z" fill="#c39a4f" />
            </svg>
          </div>
          <div className="hidden sm:block leading-none">
            <div className="display text-base font-medium tracking-wide">Aether Tower</div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-white/40 mt-0.5">
              Hudson Yards · NY
            </div>
          </div>
        </button>

        <nav className="pointer-events-auto glass rounded-full px-2 py-1.5 hidden md:flex items-center gap-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`relative px-3 py-1.5 rounded-full text-[12px] font-medium tracking-wide transition-all duration-300 ${
                view === v.id
                  ? 'text-ink-950 bg-gradient-to-br from-gold-400 to-gold-600'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="hidden lg:inline opacity-60 mr-1 text-[10px]">{v.sub}</span>
              {v.label}
            </button>
          ))}
        </nav>

        <div className="pointer-events-auto hidden sm:flex items-center gap-3 text-[11px] text-white/50 uppercase tracking-[0.22em]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{building.totalFloors} Floors · 412m</span>
        </div>
      </div>
    </header>
  )
}

export function MobileNav() {
  const { view, setView } = useStore()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/10">
      <div className="flex items-center justify-between px-2 py-2 overflow-x-auto">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-[10px] font-medium uppercase tracking-wider ${
              view === v.id ? 'text-gold-400' : 'text-white/50'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
