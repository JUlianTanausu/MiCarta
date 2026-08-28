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
  googleMapsUrl: string
  photos: string[]
  warning?: string
  personalNote: string
  tags: string[]
  visitDate?: string
}

export type ViewMode = 'cards' | 'map'
