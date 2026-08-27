import { render, screen, fireEvent } from '@testing-library/react'
import { CardGrid } from './CardGrid'
import type { Restaurant } from '../../types/Restaurant'

const makeRestaurant = (overrides: Partial<Restaurant> = {}): Restaurant => ({
  id: 'r1',
  name: 'El Faro',
  cuisine: 'Andaluza',
  city: 'Cádiz',
  province: 'Cádiz',
  coordinates: { lat: 36.53, lng: -6.29 },
  address: 'Calle San Félix 15',
  googleMapsUrl: 'https://maps.google.com/?q=El+Faro',
  photos: [],
  personalNote: 'Excelente marisquería',
  tags: ['mariscos'],
  ...overrides,
})

const twoRestaurants: Restaurant[] = [
  makeRestaurant({ id: 'r1', name: 'El Faro' }),
  makeRestaurant({ id: 'r2', name: 'Casa Lucio' }),
]

describe('CardGrid', () => {
  it('renders all restaurant cards', () => {
    render(<CardGrid restaurants={twoRestaurants} onCardClick={() => {}} />)
    expect(screen.getByText('El Faro')).toBeInTheDocument()
    expect(screen.getByText('Casa Lucio')).toBeInTheDocument()
  })

  it('shows empty state when restaurants array is empty', () => {
    render(<CardGrid restaurants={[]} onCardClick={() => {}} />)
    expect(screen.getByText('No hay restaurantes que coincidan con los filtros.')).toBeInTheDocument()
  })

  it('shows plate emoji in empty state', () => {
    render(<CardGrid restaurants={[]} onCardClick={() => {}} />)
    expect(screen.getByText('🍽️')).toBeInTheDocument()
  })

  it('does not show empty state when there are restaurants', () => {
    render(<CardGrid restaurants={twoRestaurants} onCardClick={() => {}} />)
    expect(screen.queryByText('No hay restaurantes que coincidan con los filtros.')).not.toBeInTheDocument()
  })

  it('calls onCardClick with the correct restaurant when a card is clicked', () => {
    const handleClick = vi.fn()
    render(<CardGrid restaurants={twoRestaurants} onCardClick={handleClick} />)
    fireEvent.click(screen.getByRole('button', { name: /ver detalle de el faro/i }))
    expect(handleClick).toHaveBeenCalledWith(twoRestaurants[0])
  })

  it('calls onCardClick for the second card independently', () => {
    const handleClick = vi.fn()
    render(<CardGrid restaurants={twoRestaurants} onCardClick={handleClick} />)
    fireEvent.click(screen.getByRole('button', { name: /ver detalle de casa lucio/i }))
    expect(handleClick).toHaveBeenCalledWith(twoRestaurants[1])
  })

  it('renders one card when restaurants has a single entry', () => {
    render(<CardGrid restaurants={[makeRestaurant()]} onCardClick={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })
})
