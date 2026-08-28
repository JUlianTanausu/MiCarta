import { useState, useEffect } from 'react'
import { motion, animate } from 'framer-motion'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine, ISourceOptions } from '@tsparticles/engine'
import { ViewToggle } from '../ViewToggle/ViewToggle'
import type { ViewMode } from '../../types/Restaurant'
import logoSrc from '../../assets/logo.png'
import './Header.css'

const initEngine = (engine: Engine): Promise<void> => loadSlim(engine)

interface HeaderProps {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  totalCount: number
}

const particlesOptions: ISourceOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    number: { value: 50, density: { enable: true } },
    color: { value: '#2EC4B6' },
    opacity: { value: { min: 0.04, max: 0.15 } },
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
      color: '#2EC4B6',
      opacity: 0.06,
      width: 1,
    },
  },
  detectRetina: true,
}

export function Header({ view, onViewChange, totalCount }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    const controls = animate(0, totalCount, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayCount(Math.round(v)),
    })
    return () => controls.stop()
  }, [totalCount])

  useEffect(() => {
    // The scrollable container is .app__main, not the document root
    const scroller = document.querySelector('.app__main') as HTMLElement | null
    if (!scroller) return
    const onScroll = () => setScrolled(scroller.scrollTop > 30)
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <h1 className="visually-hidden">miCarta</h1>
      <ParticlesProvider init={initEngine}>
        <Particles
          id="header-particles"
          className="header__particles"
          options={particlesOptions}
        />
      </ParticlesProvider>

      <div className="header__inner">
        <div className="header__brand">
          <motion.img
            src={logoSrc}
            alt="miCarta logo"
            className="header__logo"
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <div className="header__brand-text">
            <span className="header__title">
              <span className="header__title-mi">mi</span>
              <span className="header__title-carta">Carta</span>
            </span>
            <span className="header__subtitle">
              <motion.span key={totalCount}>{displayCount}</motion.span>{' '}
              restaurante{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="header__controls">
          <ViewToggle currentView={view} onChange={onViewChange} />
        </div>
      </div>
    </header>
  )
}
