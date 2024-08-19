import { renderHook, act, waitFor } from '@testing-library/react'
import { useGetMovie } from '../../hooks/useGetMovie'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 })
  })
) as jest.Mock

describe('useGetMovie hook', () => {
  it('should initial state', () => {
    const { result } = renderHook(() => useGetMovie())
    expect(result.current.videoKey).toBeUndefined()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it('should have videoKey after successful movie fetch', async () => {
    const movieId = '123'
    const videoData = {
      videos: {
        results: [
          {
            type: 'Trailer',
            key: 'trailer-key'
          }
        ]
      }
    }

    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => videoData
    })

    const { result } = renderHook(() => useGetMovie())

    act(() => {
      result.current.getMovie(movieId)
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.videoKey).toBe('trailer-key')
      expect(result.current.error).toBeUndefined()
    })
  })

  it('should return error message after failed movie fetch with error message', async () => {
    const movieId = '123'
    const errorMessage = 'Failed to fetch movie'

    ;(fetch as jest.Mock).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useGetMovie())

    act(() => {
      result.current.getMovie(movieId)
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(errorMessage)
    })
  })

  it('should not have videoKey after movie fetch with no trailer', async () => {
    const movieId = '123'
    const videoData = {
      videos: {
        results: []
      }
    }

    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => videoData
    })

    const { result } = renderHook(() => useGetMovie())

    act(() => {
      result.current.getMovie(movieId)
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.videoKey).toBeUndefined()
    })
  })

  it('should pick first vidoeKey after movie fetch with multiple trailers', async () => {
    const movieId = '123'
    const videoData = {
      videos: {
        results: [
          {
            type: 'Trailer',
            key: 'trailer-key-1'
          },
          {
            type: 'Trailer',
            key: 'trailer-key-2'
          }
        ]
      }
    }

    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => videoData
    })

    const { result } = renderHook(() => useGetMovie())

    act(() => {
      result.current.getMovie(movieId)
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.videoKey).toBe('trailer-key-1')
    })
  })
})
