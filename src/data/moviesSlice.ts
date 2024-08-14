import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { FetchType, IMovie, MovieResponse } from "../types/movie";

interface FetchMovieParams {
	apiUrl: string
	type: FetchType
}

export const fetchMovies = createAsyncThunk('fetch-movies', async({ apiUrl, type }: FetchMovieParams ) => {
  const response = await fetch(apiUrl)
	return { response: await response.json(), type }
})

const initialState: MovieResponse = {
  movies: {
	  results: [],
	},
  fetchStatus: '',
};

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
					if (action.payload.type === FetchType.SEARCH) {
						state.movies = action.payload.response
						state.fetchStatus = 'success'
						return
					}
					const results: IMovie[] = action.payload.response?.results || []
					state.movies = { results: [...state.movies.results, ...results] }
					state.fetchStatus = 'success'
        }).addCase(fetchMovies.pending, (state) => {
            state.fetchStatus = 'loading'
        }).addCase(fetchMovies.rejected, (state) => {
            state.fetchStatus = 'error'
        })
    }
})

export default moviesSlice
