import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { useGetMovies } from '../hooks/useGetMovies'

import Movie from './Movie'
import Loader from './Loader'
import { IMovie } from '../types/movie'

import '../styles/movies.scss'


interface MoviesProps {
	viewTrailer: (movie: IMovie) => void,
	handleInfiniteScroll: () => void,
	currentPage: number
}

const Movies = ({ viewTrailer, handleInfiniteScroll, currentPage }: MoviesProps) => {
	const state = useAppSelector((state) => state)
	const { movies } = state
	const [searchParams] = useSearchParams()
	const searchQuery = searchParams.get('search')
	const getMovies = useGetMovies(searchQuery)

	useEffect(() => {
		handleInfiniteScroll()
		getMovies(searchQuery, currentPage)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

    return (
        <div data-testid="movies" className="movies">
					{movies.movies.results?.map((movie, i) => {
						return (
							<Movie
								movie={movie}
								key={`movie-${i}-${movie.id}`}
								viewTrailer={viewTrailer}
							/>
						)
					})}
					{movies.movies.results?.length === 0 && <h4>No movies found</h4>}
					{movies.fetchStatus === 'loading' && <Loader />}
					{movies.fetchStatus === 'error' && <h4>Error fetching movies</h4>}
        </div>
    )
}

export default Movies
