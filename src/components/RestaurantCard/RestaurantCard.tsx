import { motion } from 'framer-motion'
import type { Restaurant } from '../../types/Restaurant'
import './RestaurantCard.css'

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick: (restaurant: Restaurant) => void
}

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const { id, name, cuisine, city, photos, warning, tags, googleMapsUrl, websiteUrl, phone } = restaurant
  const heroImg = photos[0] ?? PLACEHOLDER_IMG

  return (
    <motion.article
      className="card"
      layoutId={`card-${id}`}
      onClick={() => onClick(restaurant)}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalle de ${name}`}
      onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick(restaurant)
          }
        }}
    >
      <div className="card__image-wrapper">
        <img
          src={heroImg}
          alt={name}
          className="card__image"
          loading="lazy"
        />
        <div className="card__image-gradient" />
        {warning && (
          <div className="card__warning-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Reservar recomendado
          </div>
        )}
      </div>

      <div className="card__body">
        <div className="card__meta">
          <h2 className="card__name">{name}</h2>
          <p className="card__location">{city} · {cuisine}</p>
        </div>

        {tags.length > 0 && (
          <div className="card__tags">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="card__tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="card__actions" onClick={e => e.stopPropagation()}>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card__action-btn"
            title="Ver en Google Maps"
            aria-label="Ver en Google Maps"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </a>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="card__action-btn"
              title="Llamar"
              aria-label="Llamar al restaurante"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.42-1.42a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
          )}
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card__action-btn"
              title="Web del restaurante"
              aria-label="Visitar web del restaurante"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
