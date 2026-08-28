import { render, screen } from '@testing-library/react'
import { RestaurantCard } from './RestaurantCard'
import type { Restaurant } from '../../types/Restaurant'

const baseRestaurant: Restaurant = {
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
  tags: ['mariscos', 'vista al mar', 'terraza'],
}

describe('RestaurantCard', () => {
  it('renders restaurant name in heading', () => {
    const { container } = render(<RestaurantCard restaurant={baseRestaurant} />)
    expect(container.querySelector('.card__name')).toHaveTextContent('El Faro')
  })

  it('renders city and province', () => {
    const { container } = render(<RestaurantCard restaurant={baseRestaurant} />)
    expect(container.querySelector('.card__location')).toHaveTextContent('Cádiz · Cádiz')
  })

  it('renders all tags', () => {
    const withMoreTags = { ...baseRestaurant, tags: ['a', 'b', 'c', 'd'] }
    render(<RestaurantCard restaurant={withMoreTags} />)
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('b')).toBeInTheDocument()
    expect(screen.getByText('c')).toBeInTheDocument()
    expect(screen.getByText('d')).toBeInTheDocument()
  })

  it('card opens Google Maps on click', () => {
    render(<RestaurantCard restaurant={baseRestaurant} />)
    const card = screen.getByRole('link', { name: /El Faro/i })
    expect(card).toBeInTheDocument()
  })

  it('shows warning chip with full warning text when warning is set', () => {
    const withWarning = { ...baseRestaurant, warning: 'Reserva obligatoria' }
    const { container } = render(<RestaurantCard restaurant={withWarning} />)
    expect(container.querySelector('.card__warning-chip')).toHaveTextContent('Reserva obligatoria')
  })

  it('does not show warning chip when warning is absent', () => {
    const { container } = render(<RestaurantCard restaurant={baseRestaurant} />)
    expect(container.querySelector('.card__warning-chip')).not.toBeInTheDocument()
  })

  it('shows personal note as blockquote', () => {
    const { container } = render(<RestaurantCard restaurant={baseRestaurant} />)
    expect(container.querySelector('.card__note')).toHaveTextContent('Excelente marisquería')
  })


  it('shows generated cover when photos array is empty', () => {
    const { container } = render(<RestaurantCard restaurant={baseRestaurant} />)
    expect(container.querySelector('.card__cover')).toBeInTheDocument()
    expect(container.querySelector('.card__cover-emojis')).toBeInTheDocument()
  })

  it('uses first photo when photos array is non-empty', () => {
    const withPhoto = { ...baseRestaurant, photos: ['https://example.com/photo.jpg'] }
    render(<RestaurantCard restaurant={withPhoto} />)
    const img = screen.getByRole('img', { name: 'El Faro' })
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })

  it('card has no button element', () => {
    render(<RestaurantCard restaurant={baseRestaurant} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
