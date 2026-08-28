import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { createMarkerIcon } from '../MapMarker/MapMarker'
import type { Restaurant } from '../../types/Restaurant'
import './MapView.css'

interface MapViewProps {
  restaurants: Restaurant[]
}

const TAG_EMOJI: Record<string, string> = {
  mariscos: '🦞', arroces: '🥘', paella: '🥘', pescado: '🐟',
  carnes: '🥩', brasa: '🔥', bocadillo: '🥖', torreznos: '🥓', tapas: '🍢', 'carne cabra': '🐐', cordero: '🐑', cochinillo: '🐷', sushi: '🍣', pizza: '🍕',
  pasta: '🍝', cocina: '🍳', postres: '🍮', vinos: '🍷', cervezas: '🍺', cremaet: '☕', 'plato combinado': '🍽️',
}

function PopupCover({ restaurant }: { restaurant: Restaurant }) {
  if (restaurant.photos.length > 0 && restaurant.photos[0]) {
    return (
      <img
        src={restaurant.photos[0]}
        alt={restaurant.name}
        className="map-popup__img"
      />
    )
  }
  const emojis = restaurant.tags
    .map(t => TAG_EMOJI[t.toLowerCase()])
    .filter(Boolean)
    .slice(0, 2)
  if (!emojis.length) emojis.push('🍽️')
  return (
    <div className="map-popup__cover" aria-hidden="true">
      <div className="map-popup__cover-emojis">{emojis.join('  ')}</div>
      <div className="map-popup__cover-name">{restaurant.name}</div>
    </div>
  )
}

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const SPAIN_CENTER: [number, number] = [40.4168, -3.7038]

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 350)
  }, [map])
  return null
}

export function MapView({ restaurants }: MapViewProps) {
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
              <div className="map-popup__card">
                <div className="map-popup__image-wrapper">
                  <PopupCover restaurant={restaurant} />
                  {restaurant.warning && (
                    <div className="map-popup__warning-chip">
                      {restaurant.warning}
                    </div>
                  )}
                </div>
                <div className="map-popup__body">
                  <div className="map-popup__meta">
                    <p className="map-popup__name">{restaurant.name}</p>
                    <p className="map-popup__location">
                      {restaurant.city} · {restaurant.province}
                    </p>
                  </div>
                  <blockquote className="map-popup__note">
                    "{restaurant.personalNote}"
                  </blockquote>
                  {restaurant.tags.length > 0 && (
                    <div className="map-popup__tags">
                      {restaurant.tags.map(tag => (
                        <span key={tag} className="map-popup__tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <a
                    href={restaurant.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-popup__btn"
                    aria-label={`Ver ${restaurant.name} en Google Maps`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Google Maps
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  )
}
