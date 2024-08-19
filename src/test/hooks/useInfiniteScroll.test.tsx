import { renderHook, act } from '@testing-library/react'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

describe('useInfiniteScroll', () => {
  let observeMock: jest.Mock
  let disconnectMock: jest.Mock
  let intersectionObserverMock: jest.Mock

  beforeEach(() => {
    observeMock = jest.fn()
    disconnectMock = jest.fn()

    intersectionObserverMock = jest.fn().mockImplementation((callback) => ({
      observe: observeMock,
      disconnect: disconnectMock,
      takeRecords: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
      callback
    }))

    // Mock the IntersectionObserver
    window.IntersectionObserver = intersectionObserverMock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a function that can be used as a ref', () => {
    const { result } = renderHook(() => useInfiniteScroll(() => {}))
    expect(typeof result.current).toBe('function')
  })

  it('should not call the callback when the observed node is intersecting for the first time', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useInfiniteScroll(callback))

    const node = document.createElement('div')

    act(() => {
      result.current(node)
    })

    // Simulate an intersection
    const mockEntries = [{ isIntersecting: true }]
    act(() => {
      intersectionObserverMock.mock.calls[0][0](mockEntries)
    })

    expect(callback).not.toHaveBeenCalledTimes(1)
  })

  it('should call the callback when the observed node is intersecting for the second time', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useInfiniteScroll(callback))

    const node = document.createElement('div')

    act(() => {
      result.current(node)
    })

    // Simulate an intersection
    const mockEntries = [{ isIntersecting: true }]
    act(() => {
      intersectionObserverMock.mock.calls[0][0](mockEntries)
      intersectionObserverMock.mock.calls[0][0](mockEntries)
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should not call the callback when the observed node is not intersecting', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useInfiniteScroll(callback))

    const node = document.createElement('div')

    act(() => {
      result.current(node)
    })

    // Simulate no intersection
    const mockEntries = [{ isIntersecting: false }]
    act(() => {
      intersectionObserverMock.mock.calls[0][0](mockEntries)
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should disconnect the observer when the component is unmounted', () => {
    const { result, unmount } = renderHook(() => useInfiniteScroll(() => {}))

    const node = document.createElement('div')

    act(() => {
      result.current(node)
    })

    unmount()

    expect(disconnectMock).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple renders without throwing an error', () => {
    const { result, rerender } = renderHook(() => useInfiniteScroll(() => {}))

    const node = document.createElement('div')

    act(() => {
      result.current(node)
    })

    rerender()

    act(() => {
      result.current(node)
    })

    expect(() => rerender()).not.toThrow()
  })
})
