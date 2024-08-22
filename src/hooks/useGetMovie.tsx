import { useState, useCallback } from 'react'

import fetchWrapper from '../utils/fetchWrapper'

import { API_KEY, ENDPOINT } from '../constants'

interface UseGetMovieResult {
  videoKey: string | undefined
  loading: boolean
  error?: string
  getMovie: (id: string) => Promise<void>
}

interface VideoData {
  videos: {
    results: {
      key: string
      name: string
      type: string
    }[]
  }
}

export const useGetMovie = (): UseGetMovieResult => {
  const [videoKey, setVideoKey] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const getMovie = useCallback(async (id: string) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setLoading(true)
    setError(undefined)
    setVideoKey(undefined)

    const response = await fetchWrapper<VideoData>(URL)

    if (response.error) {
      setError(response.error || 'Something went wrong')
    }

    if (response?.data?.videos) {
      const videoData: VideoData = response.data

      if (videoData.videos && videoData.videos.results.length) {
        const trailer = videoData.videos.results.find((vid) => vid.type === 'Trailer')
        setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key)
      }
    }
    setLoading(false)
  }, [])
  return { videoKey, loading, error, getMovie }
}
