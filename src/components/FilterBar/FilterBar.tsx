import { motion, AnimatePresence } from 'framer-motion'
import type { FilterState } from '../../types/Restaurant'
import './FilterBar.css'

interface FilterBarProps {
  filters: FilterState
  onCityChange: (city: string) => void
  onCuisineChange: (cuisine: string) => void
  onClear: () => void
  availableCities: string[]
  availableCuisines: string[]
  isOpen: boolean
  onClose: () => void
}

const hasActiveFilters = (filters: FilterState) => !!(filters.city || filters.cuisine)

export function FilterBar({
  filters, onCityChange, onCuisineChange, onClear,
  availableCities, availableCuisines, isOpen, onClose,
}: FilterBarProps) {
  const active = hasActiveFilters(filters)

  return (
    <>
      {/* Desktop: barra inline */}
      <div className="filter-bar filter-bar--desktop">
        <FilterSelects
          filters={filters}
          onCityChange={onCityChange}
          onCuisineChange={onCuisineChange}
          availableCities={availableCities}
          availableCuisines={availableCuisines}
        />
        {active && (
          <button className="filter-bar__clear" onClick={onClear}>
            Limpiar
          </button>
        )}
      </div>

      {/* Mobile: bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="filter-bar__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="filter-bar filter-bar--sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="filter-bar__handle" />
              <h3 className="filter-bar__title">Filtrar restaurantes</h3>
              <FilterSelects
                filters={filters}
                onCityChange={onCityChange}
                onCuisineChange={onCuisineChange}
                availableCities={availableCities}
                availableCuisines={availableCuisines}
              />
              <div className="filter-bar__actions">
                {active && (
                  <button className="filter-bar__clear" onClick={() => { onClear(); onClose() }}>
                    Limpiar filtros
                  </button>
                )}
                <button className="filter-bar__apply" onClick={onClose}>
                  Aplicar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface FilterSelectsProps {
  filters: FilterState
  onCityChange: (city: string) => void
  onCuisineChange: (cuisine: string) => void
  availableCities: string[]
  availableCuisines: string[]
}

function FilterSelects({ filters, onCityChange, onCuisineChange, availableCities, availableCuisines }: FilterSelectsProps) {
  return (
    <div className="filter-bar__selects">
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-city">Ciudad</label>
        <select
          id="filter-city"
          className="filter-bar__select"
          value={filters.city}
          onChange={e => onCityChange(e.target.value)}
        >
          <option value="">Todas</option>
          {availableCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-cuisine">Cocina</label>
        <select
          id="filter-cuisine"
          className="filter-bar__select"
          value={filters.cuisine}
          onChange={e => onCuisineChange(e.target.value)}
        >
          <option value="">Todas</option>
          {availableCuisines.map(cuisine => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
