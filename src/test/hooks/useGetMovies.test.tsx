import { renderHook, act } from '@testing-library/react';
import { useGetMovies } from '../../hooks/useGetMovies';
import { FetchType } from '../../types/movie';
import { renderAppDispatchMock } from '../utils';

jest.mock('../../hooks/useAppDispatch');

jest.mock('../../data/moviesSlice', () => ({
  fetchMovies: jest.fn(),
}));

describe('useGetMovies', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a function', () => {
    const { result } = renderHook(() => useGetMovies());
    expect(typeof result.current).toBe('function');
  });

  it('should call dispatch with when called', () => {
    const query = 'test query';
    const page = 1;
    const type = FetchType.SEARCH;
    const mockDispatch = jest.fn();
    renderAppDispatchMock(mockDispatch);

    const { result } = renderHook(() => useGetMovies());
    act(() => {
      result.current(query, page, type);
    });

    // Assert that dispatch was called with the correct action
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
})
