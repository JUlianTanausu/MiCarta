import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// IntersectionObserver is not implemented in jsdom; mock it so Framer Motion's
// whileInView feature does not throw during tests.
class IntersectionObserverMock {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
})

// Mock tsparticles library for tests
vi.mock('@tsparticles/react', () => ({
  default: () => null,
  ParticlesProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('@tsparticles/slim', () => ({
  loadSlim: vi.fn().mockResolvedValue(undefined),
}))
