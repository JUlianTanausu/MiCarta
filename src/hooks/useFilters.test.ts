import { renderHook, act } from '@testing-library/react'
import { useFilters } from './useFilters'
import type { Restaurant } from '../types/Restaurant'

const mockRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Casa Nuri',
    cuisine: 'Mariscos',
    city: 'Barcelona',
    province: 'Barcelona',
    coordinates: { lat: 41.38, lng: 2.17 },
    address: 'Calle Test 1',
    googleMapsUrl: '',
    photos: [],
    personalNote: '',
    tags: [],
  },
  {
    id: 'r2',
    name: 'El Faro',
    cuisine: 'Andaluza',
    city: 'Cádiz',
    province: 'Cádiz',
    coordinates: { lat: 36.53, lng: -6.29 },
    address: 'Calle Test 2',
    googleMapsUrl: '',
    photos: [],
    personalNote: '',
    tags: [],
  },
  {
    id: 'r3',
    name: 'La Mar',
    cuisine: 'Mariscos',
    city: 'Cádiz',
    province: 'Cádiz',
    coordinates: { lat: 36.53, lng: -6.29 },
    address: 'Calle Test 3',
    googleMapsUrl: '',
    photos: [],
    personalNote: '',
    tags: [],
  },
]

it('returns all restaurants when no filters set', () => {
  const { result } = renderHook(() => useFilters(mockRestaurants))
  expect(result.current.filteredRestaurants).toHaveLength(3)
})

it('filters by city', () => {
  const { result } = renderHook(() => useFilters(mockRestaurants))
  act(() => result.current.setCity('Cádiz'))
  expect(result.current.filteredRestaurants).toHaveLength(2)
})

it('clearFilters resets all filters', () => {
  const { result } = renderHook(() => useFilters(mockRestaurants))
  act(() => {
    result.current.setCity('Cádiz')
    result.current.clearFilters()
  })
  expect(result.current.filteredRestaurants).toHaveLength(3)
})

it('provides sorted unique cities', () => {
  const { result } = renderHook(() => useFilters(mockRestaurants))
  expect(result.current.availableCities).toEqual(['Barcelona', 'Cádiz'])
})
