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
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04, delayChildren: 0.55 } },
            }}
          >
            {'miCarta'.split('').map((char, i) => (
              <motion.span
                key={i}
                className={i < 2 ? 'splash__title-mi' : 'splash__title-carta'}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 20 } },
                }}
              >
                {char}
              </motion.span>
            ))}
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
