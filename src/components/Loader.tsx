import { useEffect, useState } from 'react'

export function Loader() {
  const [hidden, setHidden] = useState(false)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const e = Math.min(1, (t - start) / 1500)
      setPct(Math.round(e * 100))
      if (e < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setHidden(true), 250)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (hidden) return null

  return (
    <div className="fixed inset-0 z-50 bg-ink-950 flex flex-col items-center justify-center">
      <div className="display text-3xl text-ink-50 mb-2">
        Aether <span className="gold-text italic">Tower</span>
      </div>
      <div className="text-[10px] uppercase tracking-[0.28em] text-white/40 mb-8">
        Loading the tower
      </div>
      <div className="w-64 h-px bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 text-[10px] text-white/40 tabular-nums">{pct}%</div>
    </div>
  )
}
