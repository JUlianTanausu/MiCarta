import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App smoke test', () => {
  it('renders heading', () => {
    render(<App />)
    const headings = screen.getAllByRole('heading', { name: /miCarta/i })
    expect(headings.length).toBeGreaterThanOrEqual(1)
  })
})
