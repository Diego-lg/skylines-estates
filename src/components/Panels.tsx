import { useMemo, useState } from 'react'
import { useStore } from '../store'
import {
  building,
  floors,
  apartmentTypes,
  statusByFloor,
  type FloorInfo,
} from '../data/building'

const fmtPrice = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`
    : `$${(n / 1000).toFixed(0)}K`

const fmtNum = (n: number) => n.toLocaleString('en-US')

export function HeroPanel() {
  const { setView } = useStore()
  return (
    <div className="float-up max-w-xl">
      <div className="pill mb-5">
        <span className="w-1 h-1 rounded-full bg-gold-500" />
        Now selling · Phase 1 of 3
      </div>
      <h1 className="display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-ink-50 font-light">
        One hundred floors.
        <br />
        <span className="gold-text italic">One address.</span>
      </h1>
      <p className="mt-6 text-base sm:text-lg text-white/65 leading-relaxed max-w-md">
        {building.tagline} Explore the tower, choose a floor, and step inside a sky
        residence — all without leaving the page.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button className="btn btn-gold" onClick={() => setView('building')}>
          Explore the tower
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="btn btn-ghost" onClick={() => setView('contact')}>
          Schedule a viewing
        </button>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
        {[
          { k: 'Height', v: '412m' },
          { k: 'Floors', v: '100' },
          { k: 'Year', v: '2026' },
        ].map((s) => (
          <div key={s.k}>
            <div className="display text-3xl text-ink-50">{s.v}</div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/40 mt-1">
              {s.k}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BuildingPanel() {
  const { hoveredFloor, setView } = useStore()
  const floor = hoveredFloor ? floors[hoveredFloor - 1] : null
  return (
    <div className="float-up max-w-sm">
      <div className="pill mb-4">Tower · 100 Floors</div>
      <h2 className="display text-3xl text-ink-50 leading-tight">
        Click any floor slab to enter the residence.
      </h2>
      <p className="mt-3 text-sm text-white/60 leading-relaxed">
        Five distinct residential tiers, from family-scale sky homes to a single
        crown penthouse spanning the top two floors. Scroll to zoom, drag to rotate.
      </p>
      {floor && (
        <div className="mt-6 p-4 glass rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-gold-400">
                Hovering
              </div>
              <div className="display text-xl text-ink-50 mt-0.5">
                Floor {floor.number} ·{' '}
                <span className="capitalize text-white/80">{floor.tier}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                {floor.apartments} unit{floor.apartments !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-white/80 mt-0.5">
                {fmtNum(floor.sqft)} sqft
              </div>
            </div>
          </div>
          <button
            onClick={() => setView('floor')}
            className="mt-4 w-full btn btn-gold justify-center"
          >
            Step inside
          </button>
        </div>
      )}
      <div className="mt-6 h-divider" />
      <div className="mt-6 space-y-2 text-[11px] uppercase tracking-[0.22em] text-white/40">
        <div>Residences · Floors 8–35</div>
        <div>Sky Collection · Floors 36–70</div>
        <div>Sky Villas · Floors 71–90</div>
        <div>Crown Penthouses · Floors 91–99</div>
        <div>Observatory · Floor 100</div>
      </div>
    </div>
  )
}

function floorPricingForFloor(f: FloorInfo) {
  return f.layouts
    .map((id) => apartmentTypes.find((a) => a.id === id)!)
    .filter(Boolean)
}

export function FloorPanel() {
  const { currentFloor, setCurrentFloor, setView } = useStore()
  const floor = floors[currentFloor - 1]
  const layouts = floorPricingForFloor(floor)
  const status = statusByFloor[currentFloor] || 'available'

  return (
    <div className="float-up max-w-md w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="pill">Floor {currentFloor}</div>
        <div
          className={`pill ${
            status === 'available'
              ? 'text-emerald-300 border-emerald-300/30'
              : status === 'reserved'
                ? 'text-amber-300 border-amber-300/30'
                : 'text-white/40'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              status === 'available'
                ? 'bg-emerald-300'
                : status === 'reserved'
                  ? 'bg-amber-300'
                  : 'bg-white/40'
            }`}
          />
          {status}
        </div>
      </div>
      <h2 className="display text-3xl text-ink-50 capitalize">
        {floor.tier === 'residential' ? 'Residence Level' : floor.tier} ·{' '}
        <span className="text-white/60">{floor.number}</span>
      </h2>
      <div className="mt-2 text-sm text-white/60">
        {floor.apartments} residence{floor.apartments !== 1 ? 's' : ''} ·{' '}
        {fmtNum(floor.sqft)} sqft total · {floor.ceilingHeight}m ceilings
      </div>

      <div className="mt-5 space-y-3">
        {layouts.map((a) => (
          <button
            key={a.id}
            onClick={() => setView('room')}
            className="w-full text-left p-4 glass rounded-2xl hover:border-gold-500/40 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="display text-lg text-ink-50">{a.name}</div>
                <div className="text-xs text-white/50 mt-1">
                  {a.bedrooms === 0 ? 'Studio' : `${a.bedrooms} BR`} · {a.bathrooms} BA ·{' '}
                  {fmtNum(a.sqft)} sqft · {a.view} exposure
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="display text-lg gold-text">{fmtPrice(a.price)}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                  From
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">{a.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {a.features.map((f) => (
                <span
                  key={f}
                  className="text-[10px] uppercase tracking-wider text-white/50 border border-white/10 rounded-full px-2 py-0.5"
                >
                  {f}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button
          onClick={() => setCurrentFloor(currentFloor - 1)}
          disabled={currentFloor <= 8}
          className="btn btn-ghost flex-1 justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Lower
        </button>
        <button
          onClick={() => setView('room')}
          className="btn btn-gold flex-1 justify-center"
        >
          Walk in
        </button>
        <button
          onClick={() => setCurrentFloor(currentFloor + 1)}
          disabled={currentFloor >= 99}
          className="btn btn-ghost flex-1 justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Higher
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mt-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
          Jump to floor
        </div>
        <input
          type="range"
          min={8}
          max={99}
          value={currentFloor}
          onChange={(e) => setCurrentFloor(parseInt(e.target.value))}
          className="w-full accent-gold-500"
        />
        <div className="flex justify-between text-[10px] text-white/40 mt-1">
          <span>8</span>
          <span>35</span>
          <span>70</span>
          <span>90</span>
          <span>99</span>
        </div>
      </div>
    </div>
  )
}

export function RoomPanel() {
  const { currentFloor, setView } = useStore()
  const floor = floors[currentFloor - 1]
  const layout = floor.layouts[0] || 'three-bed'
  const apt = apartmentTypes.find((a) => a.id === layout)!

  return (
    <div className="float-up max-w-md w-full">
      <div className="pill mb-3">Inside · {apt.name}</div>
      <h2 className="display text-3xl text-ink-50">
        A residence{' '}
        <span className="gold-text italic">{Math.round(currentFloor * 4.12)}m</span> above
        the city.
      </h2>
      <p className="mt-3 text-sm text-white/60 leading-relaxed">{apt.description}</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { k: 'Bedrooms', v: apt.bedrooms === 0 ? 'Studio' : apt.bedrooms },
          { k: 'Bathrooms', v: apt.bathrooms },
          { k: 'Interior', v: `${fmtNum(apt.sqft)} sf` },
        ].map((s) => (
          <div key={s.k} className="glass rounded-2xl p-3 text-center">
            <div className="display text-2xl text-ink-50">{s.v}</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 mt-1">
              {s.k}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 glass rounded-2xl p-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
            Listed from
          </div>
          <div className="display text-3xl gold-text mt-1">{fmtPrice(apt.price)}</div>
        </div>
        <div className="text-right text-[11px] text-white/50">
          <div>$/sqft</div>
          <div className="text-base text-ink-50 mt-0.5">
            {fmtPrice(Math.round(apt.price / apt.sqft))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
          Specification
        </div>
        <div className="flex flex-wrap gap-1.5">
          {apt.features.map((f) => (
            <span
              key={f}
              className="text-[11px] text-white/70 border border-white/10 rounded-full px-3 py-1"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button onClick={() => setView('floor')} className="btn btn-ghost flex-1 justify-center">
          Back to floor
        </button>
        <button onClick={() => setView('contact')} className="btn btn-gold flex-1 justify-center">
          Reserve
        </button>
      </div>
    </div>
  )
}

export function PenthousePanel() {
  const { currentFloor, setView } = useStore()
  const apt = apartmentTypes.find((a) => a.id === 'penthouse')!
  return (
    <div className="float-up max-w-md w-full">
      <div className="pill mb-3 text-gold-400 border-gold-400/30">
        <span className="w-1 h-1 rounded-full bg-gold-400" />
        Crown Collection
      </div>
      <h2 className="display text-4xl text-ink-50 leading-tight">
        The {currentFloor === 99 ? '99th' : 'Top'} floor
        <br />
        <span className="gold-text italic">{apt.name}.</span>
      </h2>
      <p className="mt-3 text-sm text-white/65 leading-relaxed">{apt.description}</p>

      <div className="mt-5 glass rounded-2xl p-5 space-y-3">
        <div className="flex justify-between">
          <span className="text-xs text-white/50 uppercase tracking-wider">Bedrooms</span>
          <span className="text-sm text-ink-50">{apt.bedrooms}</span>
        </div>
        <div className="h-divider" />
        <div className="flex justify-between">
          <span className="text-xs text-white/50 uppercase tracking-wider">Bathrooms</span>
          <span className="text-sm text-ink-50">{apt.bathrooms}</span>
        </div>
        <div className="h-divider" />
        <div className="flex justify-between">
          <span className="text-xs text-white/50 uppercase tracking-wider">Interior</span>
          <span className="text-sm text-ink-50">{fmtNum(apt.sqft)} sqft</span>
        </div>
        <div className="h-divider" />
        <div className="flex justify-between">
          <span className="text-xs text-white/50 uppercase tracking-wider">Ceiling</span>
          <span className="text-sm text-ink-50">4.6m</span>
        </div>
        <div className="h-divider" />
        <div className="flex justify-between">
          <span className="text-xs text-white/50 uppercase tracking-wider">Exposure</span>
          <span className="text-sm text-ink-50">360°</span>
        </div>
      </div>

      <div className="mt-5 glass rounded-2xl p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">Asking</div>
        <div className="display text-4xl gold-text mt-1">{fmtPrice(apt.price)}</div>
        <div className="text-[11px] text-white/40 mt-1">
          By private appointment only
        </div>
      </div>

      <button
        onClick={() => setView('contact')}
        className="mt-6 w-full btn btn-gold justify-center"
      >
        Request private viewing
      </button>
    </div>
  )
}

export function AmenitiesPanel() {
  return (
    <div className="float-up max-w-md w-full">
      <div className="pill mb-3">Sub-floors · 1–7</div>
      <h2 className="display text-3xl text-ink-50">
        Six floors of amenities, <span className="text-white/60">below the residences.</span>
      </h2>
      <p className="mt-3 text-sm text-white/60 leading-relaxed">
        Triple-height sky lobby on the ground floor, with a full wellness stack
        below: hammam, plunge pools, fitness studios, and private dining.
      </p>

      <ul className="mt-5 space-y-2.5">
        {building.amenities.map((a, i) => (
          <li
            key={a}
            className="flex items-start gap-3 p-3 glass rounded-xl text-sm text-white/80"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500/15 text-gold-400 flex items-center justify-center text-[10px] font-medium">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{a}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LobbyPanel() {
  const { setView } = useStore()
  return (
    <div className="float-up max-w-md w-full">
      <div className="pill mb-3 text-gold-400 border-gold-400/30">
        <span className="w-1 h-1 rounded-full bg-gold-400" />
        Ground Floor
      </div>
      <h2 className="display text-3xl text-ink-50 leading-tight">
        The <span className="gold-text italic">sky lobby.</span>
      </h2>
      <p className="mt-3 text-sm text-white/65 leading-relaxed">
        A 12-metre triple-height arrival experience in polished Calacatta
        marble. A 24-hour concierge, curated art, and lounge seating arranged
        around a centrepiece sculpture.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {[
          { k: 'Height', v: '12m' },
          { k: 'Concierge', v: '24/7' },
          { k: 'Valet', v: 'Yes' },
          { k: 'Art', v: 'Curated' },
        ].map((s) => (
          <div key={s.k} className="glass rounded-2xl p-3">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
              {s.k}
            </div>
            <div className="display text-2xl text-ink-50 mt-0.5">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
          What's inside
        </div>
        {[
          { name: 'Concierge desk', desc: 'Hand-cut marble counter, gold-leaf trim' },
          { name: 'Lounge seating', desc: 'Two private clusters flanking the centrepiece' },
          { name: 'Gold-leaf artwork', desc: '6m commissioned installation' },
          { name: 'Indoor trees', desc: 'Mature ficus in bronze planters' },
        ].map((row) => (
          <div key={row.name} className="glass rounded-xl p-3">
            <div className="text-sm text-ink-50">{row.name}</div>
            <div className="text-xs text-white/50 mt-0.5">{row.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button onClick={() => setView('building')} className="btn btn-ghost flex-1 justify-center">
          Back to tower
        </button>
        <button onClick={() => setView('contact')} className="btn btn-gold flex-1 justify-center">
          Visit gallery
        </button>
      </div>
    </div>
  )
}

export function ObservatoryPanel() {
  const { setView } = useStore()
  return (
    <div className="float-up max-w-md w-full">
      <div className="pill mb-3 text-gold-400 border-gold-400/30">
        <span className="w-1 h-1 rounded-full bg-gold-400" />
        Floor 100 · Crown
      </div>
      <h2 className="display text-3xl text-ink-50 leading-tight">
        The <span className="gold-text italic">observatory</span> at the top of the world.
      </h2>
      <p className="mt-3 text-sm text-white/65 leading-relaxed">
        412 metres above the Hudson. A glass-railed helipad, an observatory
        telescope, and a circular daybed for sunrise coffee over the city.
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { k: 'Height', v: '412m' },
          { k: 'Helipad', v: 'Yes' },
          { k: 'Telescope', v: '14"' },
        ].map((s) => (
          <div key={s.k} className="glass rounded-2xl p-3 text-center">
            <div className="display text-2xl text-ink-50">{s.v}</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 mt-1">
              {s.k}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 glass rounded-2xl p-5 space-y-3">
        {[
          { name: 'Helipad', desc: 'FAA-permitted, 20m diameter circle' },
          { name: 'Observatory telescope', desc: '14" carbon-fibre truss on gold tripod' },
          { name: 'Compass rose', desc: 'Inlaid bronze cardinal markers' },
          { name: 'Crown daybed', desc: 'Circular lounge with cashmere cushions' },
          { name: 'Beacon', desc: 'Aviation warning light, dusk-to-dawn' },
        ].map((row) => (
          <div key={row.name} className="flex items-start justify-between gap-3">
            <div className="text-sm text-ink-50">{row.name}</div>
            <div className="text-xs text-white/50 text-right">{row.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button onClick={() => setView('building')} className="btn btn-ghost flex-1 justify-center">
          Back to tower
        </button>
        <button onClick={() => setView('contact')} className="btn btn-gold flex-1 justify-center">
          Private viewing
        </button>
      </div>
    </div>
  )
}

export function ContactPanel() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', budget: '2-4M' })
  return (
    <div className="float-up max-w-md w-full">
      <div className="pill mb-3">Sales Gallery</div>
      <h2 className="display text-3xl text-ink-50">
        Schedule a private appointment.
      </h2>
      <p className="mt-3 text-sm text-white/60 leading-relaxed">
        The sales gallery is open by appointment on the 8th floor. Submit your
        details and a representative will respond within one business day.
      </p>

      {submitted ? (
        <div className="mt-6 rounded-2xl p-6 text-center bg-ink-950 border border-white/15">
          <div className="display text-2xl text-ink-50">Thank you, {form.name || 'friend'}.</div>
          <p className="text-sm text-white/70 mt-2">
            We've received your inquiry. A representative will reach out shortly.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
          className="mt-6 space-y-3"
        >
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-white/50">
              Full name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full bg-ink-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-ink-50 placeholder:text-white/30 outline-none focus:border-gold-500/60"
              placeholder="Jordan Reyes"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-white/50">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full bg-ink-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-ink-50 placeholder:text-white/30 outline-none focus:border-gold-500/60"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-white/50">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full bg-ink-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-ink-50 placeholder:text-white/30 outline-none focus:border-gold-500/60"
                placeholder="(212) 555-0100"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-white/50">
              Budget
            </label>
            <select
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="mt-1 w-full bg-ink-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-ink-50 outline-none focus:border-gold-500/60"
            >
              <option>Under 1M</option>
              <option>1-2M</option>
              <option>2-4M</option>
              <option>4-8M</option>
              <option>8M+</option>
            </select>
          </div>
          <button type="submit" className="w-full btn btn-gold justify-center mt-2">
            Submit inquiry
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl p-3 bg-ink-950 border border-white/10">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">
            Gallery
          </div>
          <div className="text-ink-50 mt-1">212-555-AETH</div>
        </div>
        <div className="rounded-xl p-3 bg-ink-950 border border-white/10">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">
            Address
          </div>
          <div className="text-ink-50 mt-1">{building.address}</div>
        </div>
      </div>
    </div>
  )
}
