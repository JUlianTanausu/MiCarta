import { render, screen, fireEvent } from '@testing-library/react'
import { RestaurantModal } from './RestaurantModal'
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

describe('RestaurantModal', () => {
  it('renders restaurant name', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    expect(screen.getByText('El Faro')).toBeInTheDocument()
  })

  it('renders city, province and cuisine', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    expect(screen.getByText('Cádiz, Cádiz · Andaluza')).toBeInTheDocument()
  })

  it('renders address when provided', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    expect(screen.getByText('Calle San Félix 15')).toBeInTheDocument()
  })

  it('renders personal note with quotation marks', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    expect(screen.getByText('"Excelente marisquería"')).toBeInTheDocument()
  })

  it('renders "Mi nota" label', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    expect(screen.getByText('Mi nota')).toBeInTheDocument()
  })

  it('renders all tags', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    expect(screen.getByText('mariscos')).toBeInTheDocument()
    expect(screen.getByText('vista al mar')).toBeInTheDocument()
    expect(screen.getByText('terraza')).toBeInTheDocument()
  })

  it('renders Google Maps action button', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    const link = screen.getByRole('link', { name: /google maps/i })
    expect(link).toHaveAttribute('href', baseRestaurant.googleMapsUrl)
  })

  it('renders phone link when phone is provided', () => {
    const withPhone = { ...baseRestaurant, phone: '+34956000000' }
    render(<RestaurantModal restaurant={withPhone} onClose={() => {}} />)
    expect(screen.getByRole('link', { name: /llamar/i })).toHaveAttribute('href', 'tel:+34956000000')
  })

  it('does not render phone link when phone is absent', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    expect(screen.queryByRole('link', { name: /llamar/i })).not.toBeInTheDocument()
  })

  it('renders website link when websiteUrl is provided', () => {
    const withWeb = { ...baseRestaurant, websiteUrl: 'https://elfaro.es' }
    render(<RestaurantModal restaurant={withWeb} onClose={() => {}} />)
    expect(screen.getByRole('link', { name: /web/i })).toHaveAttribute('href', 'https://elfaro.es')
  })

  it('does not render website link when websiteUrl is absent', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    // Only the Google Maps link should be present
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('renders warning block when warning is provided', () => {
    const withWarning = { ...baseRestaurant, warning: 'Reserva obligatoria' }
    render(<RestaurantModal restaurant={withWarning} onClose={() => {}} />)
    expect(screen.getByText('Reserva obligatoria')).toBeInTheDocument()
  })

  it('does not render warning block when warning is absent', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    expect(screen.queryByText('Reserva obligatoria')).not.toBeInTheDocument()
  })

  it('renders visitDate when provided', () => {
    const withDate = { ...baseRestaurant, visitDate: 'febrero 2025' }
    render(<RestaurantModal restaurant={withDate} onClose={() => {}} />)
    expect(screen.getByText('Visitado en febrero 2025')).toBeInTheDocument()
  })

  it('does not render visitDate row when visitDate is absent', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    expect(screen.queryByText(/Visitado en/i)).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(<RestaurantModal restaurant={baseRestaurant} onClose={handleClose} />)
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay is clicked', () => {
    const handleClose = vi.fn()
    const { container } = render(<RestaurantModal restaurant={baseRestaurant} onClose={handleClose} />)
    // The overlay is the first child of the fragment — find it by class
    const overlay = container.querySelector('.modal-overlay') as HTMLElement
    fireEvent.click(overlay)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(<RestaurantModal restaurant={baseRestaurant} onClose={handleClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('locks body scroll on mount and restores on unmount', () => {
    const { unmount } = render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('uses placeholder image when photos array is empty', () => {
    render(<RestaurantModal restaurant={baseRestaurant} onClose={() => {}} />)
    const img = screen.getByRole('img', { name: /El Faro foto 1/i })
    expect(img).toHaveAttribute('src', expect.stringContaining('unsplash.com'))
  })

  it('uses first photo when photos array is non-empty', () => {
    const withPhoto = { ...baseRestaurant, photos: ['https://example.com/photo.jpg'] }
    render(<RestaurantModal restaurant={withPhoto} onClose={() => {}} />)
    const img = screen.getByRole('img', { name: /El Faro foto 1/i })
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })

  it('does not render thumbnails when there is only one photo', () => {
    const withPhoto = { ...baseRestaurant, photos: ['https://example.com/photo.jpg'] }
    render(<RestaurantModal restaurant={withPhoto} onClose={() => {}} />)
    expect(screen.queryByText('Miniatura 1')).not.toBeInTheDocument()
  })

  it('renders thumbnail buttons when multiple photos are provided', () => {
    const withPhotos = {
      ...baseRestaurant,
      photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    }
    render(<RestaurantModal restaurant={withPhotos} onClose={() => {}} />)
    const thumbBtns = document.querySelectorAll('.modal__thumb')
    expect(thumbBtns).toHaveLength(2)
  })
})
