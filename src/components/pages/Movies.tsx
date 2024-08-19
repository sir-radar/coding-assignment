import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useGetMovies } from '../../hooks/useGetMovies'
import { useTrailerContext } from '../../hooks/useTrailerContext'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'

import { Movie, Loader } from '../ui'

import { FetchType } from '../../types/movie'

import '../../styles/movies.scss'


const Movies = () => {
	const currentPage = useRef<number>(1)
	const {movies} = useAppSelector(state => state)
	const [searchParams] = useSearchParams()
	const searchQuery = searchParams.get('search')
	const getMovies = useGetMovies(searchQuery)
	const { viewTrailer } = useTrailerContext()

	const sentinelRef = useInfiniteScroll(useCallback((query) => {
			if (currentPage.current <= movies.movies.total_pages) {
				if (movies.movies.results?.length > 0) {
					getMovies(query, currentPage.current, FetchType.INFINITE);
					currentPage.current++;
				}
			}
    }, [getMovies, movies.movies.results?.length, movies.movies.total_pages]), searchQuery)


	useEffect(() => {
		// Run only on first render
		if (movies.movies.results?.length === 0) {
			getMovies(searchQuery)
		}
	}, [getMovies, searchQuery, movies.movies.results?.length])

	return (
			<>
        <div data-testid="movies" className="movies">
					{movies.movies.results?.map((movie, index) => {
						return (
							<Movie
								movie={movie}
								key={movie.id}
								viewTrailer={viewTrailer}
								ref={
									index === movies.movies.results?.length - 1 ? sentinelRef : null
								}
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
