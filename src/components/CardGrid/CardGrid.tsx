import { motion, AnimatePresence } from 'framer-motion'
import { RestaurantCard } from '../RestaurantCard/RestaurantCard'
import type { Restaurant } from '../../types/Restaurant'
import './CardGrid.css'

interface CardGridProps {
  restaurants: Restaurant[]
  onCardClick: (restaurant: Restaurant) => void
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
}

export function CardGrid({ restaurants, onCardClick }: CardGridProps) {
  if (restaurants.length === 0) {
    return (
      <motion.div
        className="card-grid__empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="card-grid__empty-icon">🍽️</span>
        <p>No hay restaurantes que coincidan con los filtros.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="card-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {restaurants.map(restaurant => (
          <motion.div
            key={restaurant.id}
            variants={itemVariants}
            layout
            exit={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <RestaurantCard
              restaurant={restaurant}
              onClick={onCardClick}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
