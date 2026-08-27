import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './components/Header/Header'
import { CardGrid } from './components/CardGrid/CardGrid'
import { MapView } from './components/MapView/MapView'
import { RestaurantModal } from './components/RestaurantModal/RestaurantModal'
import { useTheme } from './hooks/useTheme'
import { useFilters } from './hooks/useFilters'
import type { Restaurant, ViewMode } from './types/Restaurant'
import restaurantsData from './data/restaurants.json'
import './App.css'

const restaurants: Restaurant[] = restaurantsData as Restaurant[]

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const { filters, setCity, setCuisine, clearFilters, filteredRestaurants, availableCities, availableCuisines } = useFilters(restaurants)
  const [view, setView] = useState<ViewMode>('cards')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  return (
    <div className="app">
      <Header
        view={view}
        onViewChange={setView}
        theme={theme}
        onThemeToggle={toggleTheme}
        filters={filters}
        onCityChange={setCity}
        onCuisineChange={setCuisine}
        onClearFilters={clearFilters}
        availableCities={availableCities}
        availableCuisines={availableCuisines}
        totalCount={restaurants.length}
        filteredCount={filteredRestaurants.length}
      />

      <main className="app__main">
        <AnimatePresence mode="wait">
          {view === 'cards' ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="app__view"
            >
              <CardGrid
                restaurants={filteredRestaurants}
                onCardClick={setSelectedRestaurant}
              />
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="app__view app__view--map"
            >
              <MapView
                restaurants={filteredRestaurants}
                theme={theme}
                onMarkerClick={setSelectedRestaurant}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedRestaurant && (
          <RestaurantModal
            restaurant={selectedRestaurant}
            onClose={() => setSelectedRestaurant(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
