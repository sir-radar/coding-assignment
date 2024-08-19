import { Link } from 'react-router-dom'

import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useTrailerContext } from '../../hooks/useTrailerContext'

import { Movie } from '../ui'
import Heading from '../ui/Heading'

import watchLaterSlice from '../../data/watchLaterSlice'

import '../../styles/starred.scss'

const WatchLater = () => {
  const { watchLater } = useAppSelector((state) => state)
  const { removeAllWatchLater } = watchLaterSlice.actions
  const { viewTrailer } = useTrailerContext()
  const dispatch = useAppDispatch()

  return (
    <div className='starred' data-testid='watch-later-div'>
      {watchLater.watchLaterMovies.length > 0 && (
        <div data-testid='watch-later-movies' className='starred-movies'>
          <Heading level={6} className='header'>
            Watch Later List
          </Heading>
          <div className='row'>
            {watchLater.watchLaterMovies.map((movie) => (
              <Movie movie={movie} key={movie.id} viewTrailer={viewTrailer} />
            ))}
          </div>

          <footer className='text-center'>
            <button className='btn btn-primary' onClick={() => dispatch(removeAllWatchLater())}>
              Empty list
            </button>
          </footer>
        </div>
      )}

      {watchLater.watchLaterMovies.length === 0 && (
        <div data-testid='empty-watch-later-message' className='text-center empty-cart'>
          <i className='bi bi-heart' />
          <p>You have no movies saved to watch later.</p>
          <p>
            Go to <Link to='/'>Home</Link>
          </p>
        </div>
      )}
    </div>
  )
}

export default WatchLater
