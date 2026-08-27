export interface Coordinates {
  lat: number
  lng: number
}

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  city: string
  province: string
  coordinates: Coordinates
  address: string
  phone?: string
  googleMapsUrl: string
  websiteUrl?: string
  photos: string[]
  warning?: string
  personalNote: string
  tags: string[]
  visitDate?: string
}

export type ViewMode = 'cards' | 'map'

export interface FilterState {
  city: string
}
