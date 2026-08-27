import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

it('defaults to dark theme', () => {
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('dark')
})

it('toggles from dark to light', () => {
  const { result } = renderHook(() => useTheme())
  act(() => result.current.toggleTheme())
  expect(result.current.theme).toBe('light')
  expect(document.documentElement.getAttribute('data-theme')).toBe('light')
})

it('persists theme in localStorage', () => {
  const { result } = renderHook(() => useTheme())
  act(() => result.current.toggleTheme())
  expect(localStorage.getItem('micarta-theme')).toBe('light')
})

it('reads initial theme from localStorage', () => {
  localStorage.setItem('micarta-theme', 'light')
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('light')
})
