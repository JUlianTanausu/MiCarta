import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { createMarkerIcon } from '../MapMarker/MapMarker'
import type { Restaurant, Theme } from '../../types/Restaurant'
import './MapView.css'

interface MapViewProps {
  restaurants: Restaurant[]
  theme: Theme
  onMarkerClick: (restaurant: Restaurant) => void
}

const TILE_URLS: Record<Theme, string> = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
}

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

const SPAIN_CENTER: [number, number] = [40.4168, -3.7038]

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80'

export function MapView({ restaurants, theme, onMarkerClick }: MapViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <motion.div
      className="map-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <MapContainer
        center={SPAIN_CENTER}
        zoom={6}
        className="map-view__container"
        zoomControl={false}
      >
        <TileLayer url={TILE_URLS[theme]} attribution={TILE_ATTRIBUTION} />

        {restaurants.map(restaurant => (
          <Marker
            key={restaurant.id}
            position={[restaurant.coordinates.lat, restaurant.coordinates.lng]}
            icon={createMarkerIcon(activeId === restaurant.id)}
            eventHandlers={{
              click: () =>
                setActiveId(prev =>
                  prev === restaurant.id ? null : restaurant.id,
                ),
            }}
          >
            <Popup className="map-popup">
              <div className="map-popup__content">
                <img
                  src={restaurant.photos[0] ?? PLACEHOLDER_IMG}
                  alt={restaurant.name}
                  className="map-popup__img"
                />
                <div className="map-popup__info">
                  <h3 className="map-popup__name">{restaurant.name}</h3>
                  <p className="map-popup__location">
                    {restaurant.city} · {restaurant.cuisine}
                  </p>
                  <button
                    className="map-popup__btn"
                    onClick={() => onMarkerClick(restaurant)}
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  )
}
