import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { Restaurant } from '../../types/Restaurant'
import { TAG_EMOJI } from '../../data/tagEmoji'
import './RestaurantCard.css'

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
  const { name, city, province, photos, warning, tags, googleMapsUrl, personalNote } = restaurant
  const hasPhoto = photos.length > 0 && photos[0]

  const cardRef = useRef<HTMLElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(rawX, { stiffness: 280, damping: 28 })
  const rotateY = useSpring(rawY, { stiffness: 280, damping: 28 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    rawY.set((x - 0.5) * 18)
    rawX.set((0.5 - y) * 12)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.article
      ref={cardRef}
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => window.location.href = googleMapsUrl}
      role="link"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = googleMapsUrl }}
      aria-label={`Ver ${name} en Google Maps`}
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
            ⚠️ {warning}
          </div>
        )}
      </div>

      <div className="card__body">
        <div className="card__meta">
          <h2 className="card__name">{name}</h2>
          <p className="card__location">📍 {city} · {province}</p>
        </div>

        <blockquote className="card__note">
          💬 {personalNote}
        </blockquote>

        {tags.length > 0 && (
          <div className="card__tags">
            {tags.map(tag => (
              <span key={tag} className="card__tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="card__actions">
          <span className="card__action-hint">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Ver en Google Maps
          </span>
        </div>
      </div>
    </motion.article>
  )
}
