import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logoSrc from '../../assets/logo.png'
import './SplashScreen.css'

interface SplashScreenProps {
  onDone: () => void
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="splash"
          exit={{ y: '-100vh' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          onClick={() => setVisible(false)}
          aria-label="Intro de miCarta, toca para saltar"
          role="presentation"
        >
          <motion.img
            src={logoSrc}
            alt="miCarta logo"
            className="splash__logo"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
          />
          <motion.h1
            className="splash__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.55 }}
          >
            miCarta
          </motion.h1>
          <motion.p
            className="splash__tagline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.9 }}
          >
            mis rutas, mis sitios
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
