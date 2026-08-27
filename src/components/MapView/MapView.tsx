import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { createMarkerIcon } from '../MapMarker/MapMarker'
import type { Restaurant, Theme } from '../../types/Restaurant'
import './MapView.css'

interface MapViewProps {
  restaurants: Restaurant[]
  theme: Theme
}

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const SPAIN_CENTER: [number, number] = [40.4168, -3.7038]

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80'

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 350)
  }, [map])
  return null
}

export function MapView({ restaurants, theme: _theme }: MapViewProps) {
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
        <MapResizer />
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

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
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  )
}
