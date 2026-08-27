import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlimEngine } from '@tsparticles/slim'
import type { ISourceOptions } from '@tsparticles/engine'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { ViewToggle } from '../ViewToggle/ViewToggle'
import { FilterBar } from '../FilterBar/FilterBar'
import type { Theme, ViewMode, FilterState } from '../../types/Restaurant'
import logoSrc from '../../assets/logo.png'
import './Header.css'

interface HeaderProps {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  theme: Theme
  onThemeToggle: () => void
  filters: FilterState
  onCityChange: (city: string) => void
  onCuisineChange: (cuisine: string) => void
  onClearFilters: () => void
  availableCities: string[]
  availableCuisines: string[]
  totalCount: number
  filteredCount: number
}

const particlesOptions: ISourceOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    number: { value: 50, density: { enable: true } },
    color: { value: '#D4582A' },
    opacity: { value: { min: 0.05, max: 0.2 } },
    size: { value: { min: 1, max: 2.5 } },
    move: {
      enable: true,
      speed: 0.6,
      direction: 'right' as const,
      random: true,
      straight: false,
      outModes: { default: 'out' as const },
    },
    links: {
      enable: true,
      distance: 100,
      color: '#D4582A',
      opacity: 0.06,
      width: 1,
    },
  },
  detectRetina: true,
}

export function Header({
  view,
  onViewChange,
  theme,
  onThemeToggle,
  filters,
  onCityChange,
  onCuisineChange,
  onClearFilters,
  availableCities,
  availableCuisines,
  totalCount,
  filteredCount,
}: HeaderProps) {
  const [particlesReady, setParticlesReady] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const hasActiveFilters = !!(filters.city || filters.cuisine)

  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlimEngine(engine)
    }).then(() => setParticlesReady(true))
  }, [])

  const handleParticlesLoaded = useCallback(async () => {}, [])

  return (
    <header className="header">
      {particlesReady && (
        <Particles
          id="header-particles"
          className="header__particles"
          options={particlesOptions}
          particlesLoaded={handleParticlesLoaded}
        />
      )}

      <div className="header__inner">
        <div className="header__brand">
          <motion.img
            src={logoSrc}
            alt="miCarta logo"
            className="header__logo"
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <div className="header__brand-text">
            <span className="header__title">miCarta</span>
            <span className="header__subtitle">
              {filteredCount < totalCount
                ? `${filteredCount} de ${totalCount} restaurantes`
                : `${totalCount} restaurante${totalCount !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        <FilterBar
          filters={filters}
          onCityChange={onCityChange}
          onCuisineChange={onCuisineChange}
          onClear={onClearFilters}
          availableCities={availableCities}
          availableCuisines={availableCuisines}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />

        <div className="header__controls">
          <motion.button
            className={`header__filter-btn${hasActiveFilters ? ' header__filter-btn--active' : ''}`}
            onClick={() => setFilterOpen(true)}
            whileTap={{ scale: 0.9 }}
            aria-label="Abrir filtros"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            {hasActiveFilters && <span className="header__filter-dot" aria-hidden="true" />}
          </motion.button>

          <ViewToggle currentView={view} onChange={onViewChange} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  )
}
