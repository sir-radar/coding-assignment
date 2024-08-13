import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { MovieResponse } from "../types/movie";

export const fetchMovies = createAsyncThunk('fetch-movies', async (apiUrl: string) => {
    const response = await fetch(apiUrl)
    return response.json()
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
            state.movies = action.payload
            state.fetchStatus = 'success'
        }).addCase(fetchMovies.pending, (state) => {
            state.fetchStatus = 'loading'
        }).addCase(fetchMovies.rejected, (state) => {
            state.fetchStatus = 'error'
        })
    }
})

export default moviesSlice
