import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App smoke test', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /miCarta/i })).toBeInTheDocument()
  })
})
