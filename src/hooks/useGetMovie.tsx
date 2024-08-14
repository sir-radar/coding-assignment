import { useState, useCallback } from 'react';
import { API_KEY, ENDPOINT } from '../constants';

interface UseGetMovieResult {
  videoKey: string | undefined;
  loading: boolean;
  error?: string;
  getMovie: (id: string) => Promise<void>;
}

export const useGetMovie = (): UseGetMovieResult => {
  const [videoKey, setVideoKey] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const getMovie = useCallback(async (id: string) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setLoading(true);
    setError(undefined);
    setVideoKey(undefined);

    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch movie with id ${id}`);
      }

      const videoData = await response.json();

      if (videoData.videos && videoData.videos.results.length) {
        const trailer = videoData.videos.results.find(
          (vid: any) => vid.type === 'Trailer'
        );
        setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  return { videoKey, loading, error, getMovie };
};
