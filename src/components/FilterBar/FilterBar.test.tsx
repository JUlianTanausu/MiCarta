import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from './FilterBar'
import type { FilterState } from '../../types/Restaurant'

const CITIES = ['Madrid', 'Barcelona', 'Sevilla']
const EMPTY_FILTERS: FilterState = { city: '' }

function makeProps(overrides: Partial<Parameters<typeof FilterBar>[0]> = {}) {
  return {
    filters: EMPTY_FILTERS,
    onCityChange: vi.fn(),
    onClear: vi.fn(),
    availableCities: CITIES,
    isOpen: false,
    onClose: vi.fn(),
    ...overrides,
  }
}

describe('FilterBar — desktop bar', () => {
  it('renders province select', () => {
    render(<FilterBar {...makeProps()} />)
    expect(screen.getByLabelText('Provincia')).toBeInTheDocument()
  })

  it('populates city options including "Todas"', () => {
    render(<FilterBar {...makeProps()} />)
    const select = screen.getByLabelText('Provincia')
    const options = Array.from((select as HTMLSelectElement).options).map(o => o.value)
    expect(options).toEqual(['', ...CITIES])
  })

  it('does not show "Limpiar" button when no filters are active', () => {
    render(<FilterBar {...makeProps()} />)
    expect(screen.queryByText('Limpiar')).not.toBeInTheDocument()
  })

  it('shows "Limpiar" button when city filter is active', () => {
    render(<FilterBar {...makeProps({ filters: { city: 'Madrid' } })} />)
    expect(screen.getByText('Limpiar')).toBeInTheDocument()
  })

  it('calls onClear when "Limpiar" is clicked', async () => {
    const onClear = vi.fn()
    render(<FilterBar {...makeProps({ filters: { city: 'Madrid' }, onClear })} />)
    await userEvent.click(screen.getByText('Limpiar'))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('calls onCityChange with the selected value', async () => {
    const onCityChange = vi.fn()
    render(<FilterBar {...makeProps({ onCityChange })} />)
    await userEvent.selectOptions(screen.getByLabelText('Provincia'), 'Barcelona')
    expect(onCityChange).toHaveBeenCalledWith('Barcelona')
  })
})

describe('FilterBar — mobile bottom sheet', () => {
  it('does not render sheet content when isOpen is false', () => {
    render(<FilterBar {...makeProps({ isOpen: false })} />)
    expect(screen.queryByText('Filtrar restaurantes')).not.toBeInTheDocument()
  })

  it('renders sheet content when isOpen is true', () => {
    render(<FilterBar {...makeProps({ isOpen: true })} />)
    expect(screen.getByText('Filtrar restaurantes')).toBeInTheDocument()
  })

  it('renders "Aplicar" button in the sheet', () => {
    render(<FilterBar {...makeProps({ isOpen: true })} />)
    expect(screen.getByText('Aplicar')).toBeInTheDocument()
  })

  it('does not show "Limpiar filtros" in the sheet when no filters are active', () => {
    render(<FilterBar {...makeProps({ isOpen: true })} />)
    expect(screen.queryByText('Limpiar filtros')).not.toBeInTheDocument()
  })

  it('shows "Limpiar filtros" in the sheet when a filter is active', () => {
    render(<FilterBar {...makeProps({ isOpen: true, filters: { city: 'Sevilla' } })} />)
    expect(screen.getByText('Limpiar filtros')).toBeInTheDocument()
  })

  it('calls onClose when "Aplicar" is clicked', async () => {
    const onClose = vi.fn()
    render(<FilterBar {...makeProps({ isOpen: true, onClose })} />)
    await userEvent.click(screen.getByText('Aplicar'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClear and onClose when "Limpiar filtros" is clicked', async () => {
    const onClear = vi.fn()
    const onClose = vi.fn()
    render(
      <FilterBar
        {...makeProps({ isOpen: true, filters: { city: 'Madrid' }, onClear, onClose })}
      />
    )
    await userEvent.click(screen.getByText('Limpiar filtros'))
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the overlay is clicked', async () => {
    const onClose = vi.fn()
    render(<FilterBar {...makeProps({ isOpen: true, onClose })} />)
    const overlay = document.querySelector('.filter-bar__overlay') as HTMLElement
    expect(overlay).toBeInTheDocument()
    await userEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
