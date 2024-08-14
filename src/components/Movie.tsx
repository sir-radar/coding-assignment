import starredSlice from '../data/starredSlice'
import watchLaterSlice from '../data/watchLaterSlice'
import placeholder from '../assets/not-found-500X750.jpeg'
import { IMovie } from '../types/movie'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { ENDPOINT_MOVIE_POSTER } from '../constants'

interface MovieProps {
    movie: IMovie
    viewTrailer: (movie: IMovie) => void
}


const Movie = ({ movie, viewTrailer }: MovieProps) => {

    const { starred, watchLater } = useAppSelector((state) => state);
	const { starMovie, unstarMovie } = starredSlice.actions
	const { addToWatchLater, removeFromWatchLater } = watchLaterSlice.actions
    const dispatch = useAppDispatch();

    const toggleStar = () => {
		const isStarred = starred.starredMovies.some(m => m.id === movie.id);
		const action = isStarred ? unstarMovie : starMovie;
		dispatch(action({ ...movie }));
	};

	const toggleWatchLater = () => {
		const isWatchLater = watchLater.watchLaterMovies.some(m => m.id === movie.id);
		const action = isWatchLater ? removeFromWatchLater : addToWatchLater;
		dispatch(action({ ...movie }));
	};

	const isMovieStarred = (movie: IMovie) => {
		return starred.starredMovies.some(m => m.id === movie.id);
	};

	const isMovieInWatchLater = (movie: IMovie) => {
		return watchLater.watchLaterMovies.some(m => m.id === movie.id);
	};

    const closeCard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        e?.currentTarget?.parentElement?.classList?.remove('opened')
    }

    return (
        <div className="wrapper col-3 col-sm-4 col-md-3 col-lg-3 col-xl-2">
        <div className="card" onClick={(e) => e.currentTarget.classList.add('opened')} >
            <div className="card-body text-center">
					<div className="overlay" />
					<div className="info_panel">
						<div className="overview">{movie.overview}</div>
						<div className="year">{movie.release_date?.substring(0, 4)}</div>
						<span className="btn-star" data-testid={`${isMovieStarred(movie) ? 'unstar' : 'starred'}-link`} onClick={toggleStar}>
							<i className={`bi bi-${isMovieStarred(movie) ? 'star-fill' : 'star'}`}  data-testid={`${isMovieStarred(movie) ? 'star-fill' : ''}`}/>
						</span>
						<button type="button" data-testid={`${isMovieInWatchLater(movie) ? 'remove-watch-later' : 'watch-later'}`} className="btn btn-light btn-watch-later" onClick={toggleWatchLater}>
							{isMovieInWatchLater(movie) ? <i className="bi bi-check" /> : 'Watch Later'}
						</button>
						<button type="button" className="btn btn-dark" onClick={() => viewTrailer(movie)}>View Trailer</button>
					</div>
					<img loading="lazy" className="center-block" src={(movie.poster_path) ? `${ENDPOINT_MOVIE_POSTER}/${movie.poster_path}` : placeholder} alt="Movie poster" />
				</div>
            <h6 className="title mobile-card">{movie.title}</h6>
            <h6 className="title">{movie.title}</h6>
            <button type="button" className="close" onClick={(e) => closeCard(e)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>
    )
}

export default Movie
