import { motion } from 'framer-motion'
import type { ViewMode } from '../../types/Restaurant'
import './ViewToggle.css'

interface ViewToggleProps {
  currentView: ViewMode
  onChange: (view: ViewMode) => void
}

export function ViewToggle({ currentView, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="group" aria-label="Cambiar vista">
      <motion.button
        className={`view-toggle__btn ${currentView === 'cards' ? 'view-toggle__btn--active' : ''}`}
        onClick={() => onChange('cards')}
        whileTap={{ scale: 0.9 }}
        aria-pressed={currentView === 'cards'}
        title="Vista tarjetas"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
        </svg>
      </motion.button>

      <motion.button
        className={`view-toggle__btn ${currentView === 'map' ? 'view-toggle__btn--active' : ''}`}
        onClick={() => onChange('map')}
        whileTap={{ scale: 0.9 }}
        aria-pressed={currentView === 'map'}
        title="Vista mapa"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
          <line x1="8" y1="2" x2="8" y2="18"/>
          <line x1="16" y1="6" x2="16" y2="22"/>
        </svg>
      </motion.button>
    </div>
  )
}
