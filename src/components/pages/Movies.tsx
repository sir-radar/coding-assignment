import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useGetMovies } from '../../hooks/useGetMovies'

import { Movie, Loader } from '../ui'

import { IMovie } from '../../types/movie'

import '../../styles/movies.scss'


interface MoviesProps {
	viewTrailer: (movie: IMovie) => void,
}

const Movies = ({ viewTrailer }: MoviesProps) => {
	const state = useAppSelector((state) => state)
	const { movies } = state
	const [searchParams] = useSearchParams()
	const searchQuery = searchParams.get('search')
	const getMovies = useGetMovies(searchQuery)

	useEffect(() => {
		getMovies(searchQuery)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
			<>
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
				</div>
				{movies.fetchStatus === 'success' && movies.movies.results?.length === 0 ? <h4>No movies found</h4> : null}
				{movies.fetchStatus === 'loading' && <Loader />}
				{movies.fetchStatus === 'error' && <h4>Error fetching movies</h4>}
			</>
    )
}

export default Movies
