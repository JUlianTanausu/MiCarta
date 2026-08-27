import { motion } from 'framer-motion'
import type { Restaurant } from '../../types/Restaurant'
import './RestaurantCard.css'

const TAG_EMOJI: Record<string, string> = {
  mariscos: '🦞', arroces: '🥘', paella: '🥘', pescado: '🐟',
  carnes: '🥩', tapas: '🍢', sushi: '🍣', pizza: '🍕',
  pasta: '🍝', cocina: '🍳', postres: '🍮', vinos: '🍷',
}

function RestaurantCover({ tags, name }: { tags: string[]; name: string }) {
  const emojis = tags
    .map(t => TAG_EMOJI[t.toLowerCase()])
    .filter(Boolean)
    .slice(0, 3)
  if (!emojis.length) emojis.push('🍽️')

  return (
    <div className="card__cover" aria-hidden="true">
      <div className="card__cover-emojis">{emojis.join('  ')}</div>
      <div className="card__cover-name">{name}</div>
    </div>
  )
}

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { name, cuisine: _cuisine, province, photos, warning, tags, googleMapsUrl, personalNote } = restaurant
  const hasPhoto = photos.length > 0 && photos[0]

  return (
    <motion.article
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      {/* Photo / Placeholder */}
      <div className="card__image-wrapper">
        {hasPhoto ? (
          <img
            src={photos[0]}
            alt={name}
            className="card__image"
            loading="lazy"
          />
        ) : (
          <RestaurantCover tags={tags} name={name} />
        )}
        <div className="card__image-gradient" />
        {warning && (
          <div className="card__warning-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            {warning}
          </div>
        )}
      </div>

      <div className="card__body">
        <div className="card__meta">
          <h2 className="card__name">{name}</h2>
          <p className="card__location">{province}</p>
        </div>

        <blockquote className="card__note">
          "{personalNote}"
        </blockquote>

        {tags.length > 0 && (
          <div className="card__tags">
            {tags.map(tag => (
              <span key={tag} className="card__tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="card__actions">
          <motion.a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card__action-btn card__action-btn--primary"
            aria-label="Ver en Google Maps"
            whileTap={{ scale: 0.95 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Google
          </motion.a>
        </div>
      </div>
    </motion.article>
  )
}
