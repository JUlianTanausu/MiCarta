import { useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { Header } from './components/Header/Header'
import { CardGrid } from './components/CardGrid/CardGrid'
import { MapView } from './components/MapView/MapView'
import { SplashScreen } from './components/SplashScreen/SplashScreen'
import type { Restaurant, ViewMode } from './types/Restaurant'
import restaurantsData from './data/restaurants.json'
import './App.css'

const restaurants: Restaurant[] = restaurantsData as Restaurant[]

export default function App() {
  const [view, setView] = useState<ViewMode>('cards')
  const [showSplash, setShowSplash] = useState<boolean>(true)

  const handleSplashDone = () => {
    sessionStorage.setItem('micarta-splash-shown', '1')
    setShowSplash(false)
  }

  return (
    <MotionConfig reducedMotion="user">
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <div className="app">
        <Header
          view={view}
          onViewChange={setView}
          totalCount={restaurants.length}
        />

        <main className="app__main">
          <AnimatePresence mode="wait">
            {view === 'cards' ? (
              <motion.div
                key="cards"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="app__view app__view--cards"
              >
                <CardGrid restaurants={restaurants} />
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="app__view app__view--map"
              >
                <MapView restaurants={restaurants} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </MotionConfig>
  )
}
