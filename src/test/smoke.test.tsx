import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App smoke test', () => {
  it('renders heading', () => {
    // Mark splash screen as already shown for this test
    sessionStorage.setItem('micarta-splash-shown', '1')
    render(<App />)
    expect(screen.getByRole('heading', { name: /miCarta/i })).toBeInTheDocument()
  })
})
