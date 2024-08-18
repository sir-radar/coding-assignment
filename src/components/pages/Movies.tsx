import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useGetMovies } from '../../hooks/useGetMovies'
import { useTrailerContext } from '../../hooks/useTrailerContext'

import { Movie, Loader } from '../ui'


import '../../styles/movies.scss'




const Movies = () => {
	const state = useAppSelector((state) => state)
	const { movies } = state
	const [searchParams] = useSearchParams()
	const searchQuery = searchParams.get('search')
	const getMovies = useGetMovies(searchQuery)
	const { viewTrailer } = useTrailerContext()

	useEffect(() => {
		// Run only on first render
		if (movies.movies.results?.length === 0) {
			getMovies(searchQuery)
		}
	}, [getMovies,searchQuery, movies.movies.results?.length])

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
