import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { useGetMovies } from '../hooks/useGetMovies'

import Movie from './Movie'
import { IMovie } from '../types/movie'

import '../styles/movies.scss'

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
		getMovies()
	}, [])

    return (
        <div data-testid="movies">
            {movies.movies.results?.map((movie) => {
                return (
                    <Movie
                        movie={movie}
                        key={movie.id}
                        viewTrailer={viewTrailer}
                    />
                )
            })}
        </div>
    )
}

export default Movies
