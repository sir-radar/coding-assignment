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
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useGetMovie } from '../hooks/useGetMovie'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { useModal } from '../hooks/useModal'
import { TrailerContext } from '../context/TrailerContext'

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

const mockReturns = {
  videoKey: '',
  loading: false,
  error: '',
  isOpen: false,
  viewTrailer: jest.fn(),
  closeModal: jest.fn()
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
  } = {},
  trailerproviderData = mockReturns
) {
  setupListeners(store.dispatch)

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <TrailerContext.Provider value={trailerproviderData}>
          <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
        </TrailerContext.Provider>
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
        results: moviesData
      },
      fetchStatus
    },
    starred: {
      starredMovies: starredData
    },
    watchLater: {
      watchLaterMovies: watchLaterData
    }
  })
}

export const renderAppDispatchMock = (fn = jest.fn()) => {
  return (useAppDispatch as jest.Mock).mockReturnValue(fn)
}

export const useGetMovieMock = (getMovieFn = jest.fn()) => {
  return (useGetMovie as jest.Mock).mockReturnValue({
    videoKey: '',
    loading: false,
    error: null,
    getMovie: getMovieFn
  })
}

export const useInfiniteScrollMock = (mockFn = jest.fn()) => {
  return (useInfiniteScroll as jest.Mock).mockReturnValue({
    currentPage: { current: 1 },
    initInfiniteScroll: mockFn,
    resetInfiniteScroll: jest.fn()
  })
}

export const useModalMock = (isOpen = false, openModalMockFn = jest.fn(), closeModalMockFn = jest.fn()) => {
  return (useModal as jest.Mock).mockReturnValue({
    isOpen,
    openModal: openModalMockFn,
    closeModal: closeModalMockFn
  })
}
