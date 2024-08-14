import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch'
import { fetchMovies } from '../data/moviesSlice';
import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from '../constants';

export const useGetMovies = (searchQuery: string | null) => {
  const dispatch = useAppDispatch();

  const getMovies = useCallback((newQuery: string | null, page: number = 1, type:string = 'discover') => {
    const endpoint = searchQuery ? `${ENDPOINT_SEARCH}&query=${newQuery ? newQuery : searchQuery}&page=${page}` : `${ENDPOINT_DISCOVER}&page=${page}`;
    dispatch(fetchMovies({ apiUrl: endpoint, type }));
  }, [dispatch, searchQuery]);

  return getMovies;
};
