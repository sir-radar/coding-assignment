import Movie from './Movie'
import { IMovie } from '../types/movie'

import '../styles/movies.scss'

interface MoviesProps {
    movies: {
			movies: {
				results: IMovie[]
			}
    },
    viewTrailer: (movie: IMovie) => void,
    closeCard: () => void
}

const Movies = ({ movies, viewTrailer, closeCard }: MoviesProps) => {
    return (
        <div data-testid="movies">
            {movies.movies.results?.map((movie) => {
                return (
                    <Movie
                        movie={movie}
                        key={movie.id}
                        viewTrailer={viewTrailer}
                        closeCard={closeCard}
                    />
                )
            })}
        </div>
    )
}

export default Movies
