// Building & apartment data — 100 floors of stratified luxury
export type ApartmentStatus = 'available' | 'reserved' | 'sold'

export interface ApartmentType {
  id: string
  name: string
  bedrooms: number
  bathrooms: number
  sqft: number
  price: number // USD
  description: string
  features: string[]
  view: string
}

export interface FloorInfo {
  number: number
  tier: 'sub' | 'residential' | 'sky' | 'penthouse' | 'crown'
  apartments: number
  ceilingHeight: number // meters
  sqft: number
  layouts: string[] // apartment type ids on this floor
}

export interface Building {
  name: string
  tagline: string
  totalFloors: number
  height: number // meters
  yearBuilt: number
  address: string
  amenities: string[]
}

export const building: Building = {
  name: 'Aether Tower One',
  tagline: 'Vertical living, reimagined from the 8th floor up.',
  totalFloors: 100,
  height: 412, // meters (1.4 Burj Khalifa scale)
  yearBuilt: 2026,
  address: '888 Crescent Loop, Hudson Yards, New York',
  amenities: [
    'Triple-height sky lobby',
    '75m infinity pool on floor 78',
    'Private dining & wine cellar',
    'Helipad access (floor 100)',
    'Concierge & valet 24/7',
    'Sub-floor spa & hammam',
    'Rooftop observatory deck',
  ],
}

export const apartmentTypes: ApartmentType[] = [
  {
    id: 'studio',
    name: 'Sky Studio',
    bedrooms: 0,
    bathrooms: 1,
    sqft: 540,
    price: 825000,
    description: 'A compact jewel box with floor-to-ceiling glass and a sleeping mezzanine.',
    features: ['City-east exposure', 'Smart glass', 'Heated oak floor'],
    view: 'East',
  },
  {
    id: 'one-bed',
    name: 'One Bedroom',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 820,
    price: 1320000,
    description: 'Generously proportioned living with a chef-grade island kitchen.',
    features: ['Open galley kitchen', 'Walk-in closet', 'Private balcony'],
    view: 'South',
  },
  {
    id: 'two-bed',
    name: 'Two Bedroom Corner',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1240,
    price: 2150000,
    description: 'Corner exposure, dual-aspect living, primary suite with soaking tub.',
    features: ['Dual exposure', 'Soaking tub', 'In-unit laundry'],
    view: 'South-East',
  },
  {
    id: 'three-bed',
    name: 'Three-Bedroom Sky',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1860,
    price: 3680000,
    description: 'Family-scale living high above the harbor. Library nook included.',
    features: ['Library nook', 'Double oven', 'Service entry'],
    view: 'South-West',
  },
  {
    id: 'sky-villa',
    name: 'Sky Villa',
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3120,
    price: 8900000,
    description: 'A full-floor residence with private elevator, plunge pool and 360° terrace.',
    features: ['Private elevator', 'Plunge pool', 'Wraparound terrace'],
    view: '360°',
  },
  {
    id: 'penthouse',
    name: 'Crown Penthouse',
    bedrooms: 5,
    bathrooms: 5,
    sqft: 5400,
    price: 21500000,
    description: 'Two-floor crown residence with retractable observatory roof.',
    features: ['Observatory roof', 'Wine wall', 'In-residence staff suite'],
    view: '360°',
  },
]

// Distribute layouts across floors with a coherent stratification
const layout = (floor: number): FloorInfo => {
  let tier: FloorInfo['tier']
  let layouts: string[]
  let ceilingHeight: number
  if (floor <= 7) {
    tier = 'sub'
    layouts = []
    ceilingHeight = 4.5
  } else if (floor <= 35) {
    tier = 'residential'
    // 4 apts/floor: 2× one-bed, 1× studio, 1× two-bed
    layouts = ['studio', 'one-bed', 'one-bed', 'two-bed']
    ceilingHeight = 3.2
  } else if (floor <= 70) {
    tier = 'residential'
    // 2 apts/floor: 1× two-bed, 1× three-bed
    layouts = ['two-bed', 'three-bed']
    ceilingHeight = 3.4
  } else if (floor <= 90) {
    tier = 'sky'
    // 1× sky-villa
    layouts = ['sky-villa']
    ceilingHeight = 4.0
  } else if (floor <= 99) {
    tier = 'penthouse'
    // 1× penthouse (full floor)
    layouts = ['penthouse']
    ceilingHeight = 4.6
  } else {
    tier = 'crown'
    layouts = []
    ceilingHeight = 6.0
  }
  return {
    number: floor,
    tier,
    apartments: layouts.length,
    ceilingHeight,
    sqft: layouts.reduce((s, id) => {
      const t = apartmentTypes.find((a) => a.id === id)
      return s + (t?.sqft || 0)
    }, 0),
    layouts,
  }
}

export const floors: FloorInfo[] = Array.from({ length: 100 }, (_, i) => layout(i + 1))

export const statusByFloor: Record<number, ApartmentStatus> = (() => {
  // Deterministic pseudo-random based on floor
  const map: Record<number, ApartmentStatus> = {}
  for (let f = 8; f <= 99; f++) {
    const seed = (f * 9301 + 49297) % 233280
    const r = seed / 233280
    map[f] = r < 0.18 ? 'sold' : r < 0.32 ? 'reserved' : 'available'
  }
  return map
})()

export const priceRange = {
  min: 825000,
  max: 21500000,
}
