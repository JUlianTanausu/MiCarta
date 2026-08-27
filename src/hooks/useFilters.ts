import { useState, useMemo } from 'react'
import type { Restaurant, FilterState } from '../types/Restaurant'

const EMPTY_FILTERS: FilterState = { city: '' }

export function useFilters(restaurants: Restaurant[]) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)

  const setCity = (city: string) => setFilters(prev => ({ ...prev, city }))
  const clearFilters = () => setFilters(EMPTY_FILTERS)

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => !filters.city || r.city === filters.city)
  }, [restaurants, filters])

  const availableCities = useMemo(() => {
    return [...new Set(restaurants.map(r => r.city))].sort((a, b) => a.localeCompare(b, 'es'))
  }, [restaurants])

  return {
    filters,
    setCity,
    clearFilters,
    filteredRestaurants,
    availableCities,
  }
}
