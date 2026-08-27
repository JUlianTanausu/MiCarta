import { render, screen, fireEvent } from '@testing-library/react'
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
  it('renders restaurant name', () => {
    render(<RestaurantCard restaurant={baseRestaurant} onClick={() => {}} />)
    expect(screen.getByText('El Faro')).toBeInTheDocument()
  })

  it('renders city and cuisine', () => {
    render(<RestaurantCard restaurant={baseRestaurant} onClick={() => {}} />)
    expect(screen.getByText('Cádiz · Andaluza')).toBeInTheDocument()
  })

  it('renders up to 3 tags', () => {
    const withMoreTags = { ...baseRestaurant, tags: ['a', 'b', 'c', 'd'] }
    render(<RestaurantCard restaurant={withMoreTags} onClick={() => {}} />)
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('b')).toBeInTheDocument()
    expect(screen.getByText('c')).toBeInTheDocument()
    expect(screen.queryByText('d')).not.toBeInTheDocument()
  })

  it('shows Google Maps link', () => {
    render(<RestaurantCard restaurant={baseRestaurant} onClick={() => {}} />)
    const link = screen.getByRole('link', { name: /google maps/i })
    expect(link).toHaveAttribute('href', baseRestaurant.googleMapsUrl)
  })

  it('shows phone link when phone is provided', () => {
    const withPhone = { ...baseRestaurant, phone: '+34956000000' }
    render(<RestaurantCard restaurant={withPhone} onClick={() => {}} />)
    expect(screen.getByRole('link', { name: /llamar/i })).toHaveAttribute('href', 'tel:+34956000000')
  })

  it('does not show phone link when phone is absent', () => {
    render(<RestaurantCard restaurant={baseRestaurant} onClick={() => {}} />)
    expect(screen.queryByRole('link', { name: /llamar/i })).not.toBeInTheDocument()
  })

  it('shows website link when websiteUrl is provided', () => {
    const withWeb = { ...baseRestaurant, websiteUrl: 'https://elfaro.es' }
    render(<RestaurantCard restaurant={withWeb} onClick={() => {}} />)
    expect(screen.getByRole('link', { name: /web del restaurante/i })).toHaveAttribute('href', 'https://elfaro.es')
  })

  it('does not show website link when websiteUrl is absent', () => {
    render(<RestaurantCard restaurant={baseRestaurant} onClick={() => {}} />)
    expect(screen.queryByRole('link', { name: /web del restaurante/i })).not.toBeInTheDocument()
  })

  it('shows warning chip when warning is set', () => {
    const withWarning = { ...baseRestaurant, warning: 'Reserva obligatoria' }
    render(<RestaurantCard restaurant={withWarning} onClick={() => {}} />)
    expect(screen.getByText('Reservar recomendado')).toBeInTheDocument()
  })

  it('does not show warning chip when warning is absent', () => {
    render(<RestaurantCard restaurant={baseRestaurant} onClick={() => {}} />)
    expect(screen.queryByText('Reservar recomendado')).not.toBeInTheDocument()
  })

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn()
    render(<RestaurantCard restaurant={baseRestaurant} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledWith(baseRestaurant)
  })

  it('calls onClick when Enter is pressed on card', () => {
    const handleClick = vi.fn()
    render(<RestaurantCard restaurant={baseRestaurant} onClick={handleClick} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledWith(baseRestaurant)
  })

  it('does not call onClick when action buttons are clicked', () => {
    const handleClick = vi.fn()
    render(<RestaurantCard restaurant={baseRestaurant} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('link', { name: /google maps/i }))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('uses placeholder image when photos array is empty', () => {
    render(<RestaurantCard restaurant={baseRestaurant} onClick={() => {}} />)
    const img = screen.getByRole('img', { name: 'El Faro' })
    expect(img).toHaveAttribute('src', expect.stringContaining('unsplash.com'))
  })

  it('uses first photo when photos array is non-empty', () => {
    const withPhoto = { ...baseRestaurant, photos: ['https://example.com/photo.jpg'] }
    render(<RestaurantCard restaurant={withPhoto} onClick={() => {}} />)
    const img = screen.getByRole('img', { name: 'El Faro' })
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })

  it('card has tabIndex=0 for keyboard accessibility', () => {
    render(<RestaurantCard restaurant={baseRestaurant} onClick={() => {}} />)
    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0')
  })

  it('card has correct layoutId data attribute pattern', () => {
    render(<RestaurantCard restaurant={baseRestaurant} onClick={() => {}} />)
    // The article element is the motion.article which carries the layoutId — verify it renders the correct aria-label
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Ver detalle de El Faro')
  })
})
