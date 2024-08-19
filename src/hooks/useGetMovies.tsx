import { useCallback } from 'react'
import { useAppDispatch } from './useAppDispatch'
import { fetchMovies } from '../data/moviesSlice'
import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from '../constants'
import { FetchType } from '../types/movie'

export const useGetMovies = () => {
  const dispatch = useAppDispatch();

  const getMovies = useCallback(
    (query: string | null, page: number = 1, type: FetchType = FetchType.SEARCH) => {
      const endpoint = getEndpoint(query, page);
      dispatch(fetchMovies({ apiUrl: endpoint, type }));
    },
    [dispatch]
  );

  return getMovies;
};

const getEndpoint = (query: string | null, page: number) => {
  if (query) {
    return `${ENDPOINT_SEARCH}&query=${query}&page=${page}`;
  }
  return `${ENDPOINT_DISCOVER}&page=${page}`;
};
