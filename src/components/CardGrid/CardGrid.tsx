import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { RestaurantCard } from '../RestaurantCard/RestaurantCard'
import type { Restaurant } from '../../types/Restaurant'
import './CardGrid.css'

interface CardGridProps {
  restaurants: Restaurant[]
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 22 },
  },
}

export function CardGrid({ restaurants }: CardGridProps) {
  const [spotlight, setSpotlight] = useState({ x: '-100%', y: '-100%' })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setSpotlight({
      x: `${e.clientX - rect.left}px`,
      y: `${e.clientY - rect.top}px`,
    })
  }

  const handleMouseLeave = () => {
    setSpotlight({ x: '-100%', y: '-100%' })
  }

  if (restaurants.length === 0) {
    return (
      <motion.div
        className="card-grid__empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="card-grid__empty-icon">🍽️</span>
        <p>No hay restaurantes.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="card-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="card-grid__spotlight"
        style={{
          background: `radial-gradient(700px circle at ${spotlight.x} ${spotlight.y}, rgba(46,196,182,0.07), transparent 65%)`,
        }}
      />
      <AnimatePresence mode="popLayout">
        {restaurants.map(restaurant => (
          <motion.div
            key={restaurant.id}
            variants={itemVariants}
            layout
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <RestaurantCard
              restaurant={restaurant}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
