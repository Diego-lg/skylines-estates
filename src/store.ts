import { create } from 'zustand'
import { floors } from './data/building'

export type ViewName =
  | 'hero'
  | 'building'
  | 'floor'
  | 'room'
  | 'penthouse'
  | 'amenities'
  | 'lobby'
  | 'observatory'
  | 'contact'

interface State {
  view: ViewName
  currentFloor: number
  hoveredFloor: number | null
  showAllFloors: boolean
  rotationAuto: boolean
  setView: (v: ViewName) => void
  setCurrentFloor: (n: number) => void
  setHoveredFloor: (n: number | null) => void
  setShowAllFloors: (b: boolean) => void
  setRotationAuto: (b: boolean) => void
  goToFloor: (n: number) => void
}

export const useStore = create<State>((set) => ({
  view: 'hero',
  currentFloor: 42,
  hoveredFloor: null,
  showAllFloors: true,
  rotationAuto: true,
  setView: (v) => set({ view: v }),
  setCurrentFloor: (n) => set({ currentFloor: Math.max(8, Math.min(99, n)) }),
  setHoveredFloor: (n) => set({ hoveredFloor: n }),
  setShowAllFloors: (b) => set({ showAllFloors: b }),
  setRotationAuto: (b) => set({ rotationAuto: b }),
  goToFloor: (n) => {
    const f = floors.find((x) => x.number === n)
    if (!f) return
    if (f.tier === 'crown') {
      set({ view: 'observatory', currentFloor: n })
    } else if (f.tier === 'penthouse') {
      set({ view: 'penthouse', currentFloor: n })
    } else if (f.tier === 'sub') {
      set({ view: 'lobby', currentFloor: n })
    } else {
      set({ view: 'floor', currentFloor: n })
    }
  },
}))
