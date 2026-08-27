import '@testing-library/jest-dom'
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
  initParticlesEngine: vi.fn(async (callback) => {
    return callback({})
  }),
}))

vi.mock('@tsparticles/slim', () => ({
  loadSlimEngine: vi.fn(),
}))
