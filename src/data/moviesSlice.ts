import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchStatus, FetchType, IMovie, MovieSlice } from '../types/movie'
import fetchWrapper from '../utils/fetchWrapper'

interface FetchMovieParams {
  apiUrl: string
  type: FetchType
}

interface Response {
  page: number
  results: IMovie[]
  total_pages: number
  total_results: number
}

export const fetchMovies = createAsyncThunk('fetch-movies', async ({ apiUrl, type }: FetchMovieParams) => {
  const response = await fetchWrapper<Response>(apiUrl)
  return { response: response.data, type }
})

const initialState: MovieSlice = {
  movies: {
    results: [],
    total_pages: 0
  },
  fetchStatus: FetchStatus.IDLE
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        if (action.payload.type === FetchType.SEARCH) {
          state.movies = action.payload.response || initialState.movies
          state.fetchStatus = FetchStatus.SUCCESS
          return
        }
        // When on the first request page in infinite scroll mode, reset existing movie list to empty array
        if (action.payload.response?.page === 1) {
          state.movies.results = []
        }
        // When on the next request page in infinite scroll mode, prepend new movies
        const results: IMovie[] = action.payload.response?.results || []
        state.movies = { results: [...state.movies.results, ...results], total_pages: action.payload.response?.total_pages || 0 }
        state.fetchStatus = FetchStatus.SUCCESS
      })
      .addCase(fetchMovies.pending, (state) => {
        state.fetchStatus = FetchStatus.LOADING
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.fetchStatus = FetchStatus.ERROR
      })
  }
})

export default moviesSlice
