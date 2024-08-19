import { Link } from 'react-router-dom'

import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useTrailerContext } from '../../hooks/useTrailerContext'

import { Movie } from '../ui'

import starredSlice from '../../data/starredSlice'

import '../../styles/starred.scss'

const Starred = () => {
  const { starred } = useAppSelector((state) => state)
  const { viewTrailer } = useTrailerContext()

  const dispatch = useAppDispatch()

  const handleClearAllStarred = () => {
    dispatch(starredSlice.actions.clearAllStarred())
  }

  return (
    <div className='starred' data-testid='starred'>
      {starred.starredMovies.length > 0 && (
        <div data-testid='starred-movies' className='starred-movies'>
          <h6 className='header'>Starred Movies</h6>
          <div className='row'>
            {starred.starredMovies.map((movie) => (
              <Movie key={movie.id} movie={movie} viewTrailer={viewTrailer} />
            ))}
          </div>

          <footer className='text-center'>
            <button className='btn btn-primary' onClick={handleClearAllStarred}>
              Remove All Starred
            </button>
          </footer>
        </div>
      )}

      {starred.starredMovies.length === 0 && (
        <div data-testid='empty-strarred-message' className='text-center empty-cart'>
          <i className='bi bi-star' />
          <p>There are no starred movies.</p>
          <p>
            Go to <Link to='/'>Home</Link>
          </p>
        </div>
      )}
    </div>
  )
}

export default Starred
