import { render, screen } from '@testing-library/react'
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
    const { container } = render(<CardGrid restaurants={twoRestaurants} />)
    const names = container.querySelectorAll('.card__name')
    expect(names[0]).toHaveTextContent('El Faro')
    expect(names[1]).toHaveTextContent('Casa Lucio')
  })

  it('shows empty state when restaurants array is empty', () => {
    render(<CardGrid restaurants={[]} />)
    expect(screen.getByText('No hay restaurantes que coincidan con los filtros.')).toBeInTheDocument()
  })

  it('shows plate emoji in empty state', () => {
    render(<CardGrid restaurants={[]} />)
    expect(screen.getByText('🍽️')).toBeInTheDocument()
  })

  it('does not show empty state when there are restaurants', () => {
    render(<CardGrid restaurants={twoRestaurants} />)
    expect(screen.queryByText('No hay restaurantes que coincidan con los filtros.')).not.toBeInTheDocument()
  })

  it('renders one card when restaurants has a single entry', () => {
    render(<CardGrid restaurants={[makeRestaurant()]} />)
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })
})
