import { useState, useMemo } from 'react'
import type { Restaurant, FilterState } from '../types/Restaurant'

const EMPTY_FILTERS: FilterState = { city: '', cuisine: '' }

export function useFilters(restaurants: Restaurant[]) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)

  const setCity = (city: string) => setFilters(prev => ({ ...prev, city }))
  const setCuisine = (cuisine: string) => setFilters(prev => ({ ...prev, cuisine }))
  const clearFilters = () => setFilters(EMPTY_FILTERS)

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const cityMatch = !filters.city || r.city === filters.city
      const cuisineMatch = !filters.cuisine || r.cuisine === filters.cuisine
      return cityMatch && cuisineMatch
    })
  }, [restaurants, filters])

  const availableCities = useMemo(() => {
    return [...new Set(restaurants.map(r => r.city))].sort()
  }, [restaurants])

  const availableCuisines = useMemo(() => {
    return [...new Set(restaurants.map(r => r.cuisine))].sort()
  }, [restaurants])

  return {
    filters,
    setCity,
    setCuisine,
    clearFilters,
    filteredRestaurants,
    availableCities,
    availableCuisines,
  }
}
