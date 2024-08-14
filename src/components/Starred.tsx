import { Link } from 'react-router-dom'
import starredSlice from '../data/starredSlice'
import Movie from './Movie'
import { IMovie } from '../types/movie'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'

import '../styles/starred.scss'

interface StarredProps {
  viewTrailer: (movie: IMovie) => void
}

const Starred = ({ viewTrailer }: StarredProps) => {
  const { starred } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const handleClearAllStarred = () => {
    dispatch(starredSlice.actions.clearAllStarred());
  };

  return (
    <div className="starred" data-testid="starred">
      {starred.starredMovies.length > 0 && (
        <div data-testid="starred-movies" className="starred-movies">
          <h6 className="header">Starred Movies</h6>
          <div className="row">
            {starred.starredMovies.map((movie) => (
              <Movie key={movie.id} movie={movie} viewTrailer={viewTrailer} />
            ))}
          </div>

          <footer className="text-center">
            <button
              className="btn btn-primary"
              onClick={handleClearAllStarred}
            >
              Remove All Starred
            </button>
          </footer>
        </div>
      )}

      {starred.starredMovies.length === 0 && (
        <div className="text-center empty-cart">
          <i className="bi bi-star" />
          <p>There are no starred movies.</p>
          <p>
            Go to <Link to="/">Home</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Starred
