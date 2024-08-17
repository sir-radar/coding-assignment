import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import moviesSlice from '../data/moviesSlice'
import starredSlice from '../data/starredSlice'
import watchLaterSlice from '../data/watchLaterSlice'
import { IRootState } from '../data/store'
import { IMovie } from '../types/movie'
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';

const preloadedState: IRootState = {
  movies: {
    movies: {
      results: [],
      total_pages: 0
    },
    fetchStatus: ''
  },
  starred: {
    starredMovies: []
  },
  watchLater: {
    watchLaterMovies: []
  }
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    store = configureStore({
      reducer: {
        movies: moviesSlice.reducer,
        starred: starredSlice.reducer,
        watchLater: watchLaterSlice.reducer
      },
    preloadedState
    }),
    ...renderOptions
  } = {}
) {
  setupListeners(store.dispatch)

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
      </Provider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export const renderAppSelectMock = (
  moviesData: IMovie[] = [],
  starredData: IMovie[] = [],
  watchLaterData: IMovie[] = [],
  fetchStatus: string = ''
) => {
  return (useAppSelector as jest.Mock).mockReturnValue({
    movies: {
      movies: {
        total_pages: 1,
        results: moviesData,
      },
      fetchStatus
    },
    starred: {
      starredMovies: starredData,
    },
    watchLater: {
      watchLaterMovies: watchLaterData,
    },
  });
};

export const renderAppDispatchMock = () => {
  return (useAppDispatch as jest.Mock).mockReturnValue(jest.fn());
}
