import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Restaurant } from '../../types/Restaurant'
import './RestaurantModal.css'

interface RestaurantModalProps {
  restaurant: Restaurant
  onClose: () => void
}

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'

export function RestaurantModal({ restaurant, onClose }: RestaurantModalProps) {
  const { id, name, cuisine, city, province, address, phone, googleMapsUrl, websiteUrl, photos, warning, personalNote, tags, visitDate } = restaurant
  const [activePhoto, setActivePhoto] = useState(0)
  const displayPhotos = photos.length > 0 ? photos : [PLACEHOLDER_IMG]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="modal"
        layoutId={`card-${id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        {/* Galería */}
        <div className="modal__gallery">
          <img
            key={activePhoto}
            src={displayPhotos[activePhoto]}
            alt={`${name} foto ${activePhoto + 1}`}
            className="modal__hero"
          />
          <div className="modal__gallery-gradient" />

          {displayPhotos.length > 1 && (
            <div className="modal__thumbnails">
              {displayPhotos.map((photo, i) => (
                <button
                  key={i}
                  className={`modal__thumb ${i === activePhoto ? 'modal__thumb--active' : ''}`}
                  onClick={() => setActivePhoto(i)}
                >
                  <img src={photo} alt={`Miniatura ${i + 1}`} />
                </button>
              ))}
            </div>
          )}

          <button className="modal__close" onClick={onClose} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="modal__content">
          <div className="modal__header">
            <div>
              <h2 className="modal__name">{name}</h2>
              <p className="modal__location">{city}, {province} · {cuisine}</p>
              {visitDate && <p className="modal__date">Visitado en {visitDate}</p>}
            </div>
          </div>

          {warning && (
            <div className="modal__warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {warning}
            </div>
          )}

          {address && (
            <p className="modal__address">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {address}
            </p>
          )}

          {/* Nota personal */}
          <div className="modal__note">
            <p className="modal__note-label">Mi nota</p>
            <blockquote className="modal__note-text">"{personalNote}"</blockquote>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="modal__tags">
              {tags.map(tag => (
                <span key={tag} className="modal__tag">{tag}</span>
              ))}
            </div>
          )}

          {/* Acciones */}
          <div className="modal__actions">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="modal__btn modal__btn--primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Google Maps
            </a>
            {phone && (
              <a href={`tel:${phone}`} className="modal__btn modal__btn--secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.42-1.42a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Llamar
              </a>
            )}
            {websiteUrl && (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="modal__btn modal__btn--secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Web
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
