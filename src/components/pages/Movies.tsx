import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useGetMovies } from '../../hooks/useGetMovies'
import { useTrailerContext } from '../../hooks/useTrailerContext'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

import { Movie, Loader, Heading } from '../ui'

import { FetchStatus, FetchType } from '../../types/movie'

import '../../styles/movies.scss'

const Movies = () => {
  const currentPage = useRef<number>(1)
  const { movies } = useAppSelector((state) => state)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const getMovies = useGetMovies()
  const { viewTrailer } = useTrailerContext()

  const sentinelRef = useInfiniteScroll(
    useCallback(
      (query) => {
        if (currentPage.current < movies.movies.total_pages) {
          if (movies.fetchStatus === FetchStatus.SUCCESS) {
            currentPage.current++
            getMovies(query, currentPage.current, FetchType.INFINITE)
          }
        }
      },
      [getMovies, movies.fetchStatus, movies.movies.total_pages]
    ),
    searchQuery
  )

  const setRef = (node: HTMLDivElement) => {
    if (sentinelRef && typeof sentinelRef === 'function') {
      sentinelRef(node)
    }
  }

  useEffect(() => {
    // Run only on first render
    if (movies.movies.results?.length === 0) {
      getMovies(searchQuery)
    }
  }, [getMovies, searchQuery, movies.movies.results?.length])

  useEffect(() => {
    // Reset current page when a search is made
    currentPage.current = 1
  }, [searchQuery])

  return (
    <>
      <div data-testid='movies' className='movies'>
        {movies.movies.results?.map((movie) => <Movie movie={movie} key={movie.id} viewTrailer={viewTrailer} />)}
      </div>
      {movies.fetchStatus === FetchStatus.SUCCESS && movies.movies.results?.length === 0 ? (
        <Heading level={4}>No movies found</Heading>
      ) : null}
      {movies.fetchStatus === FetchStatus.LOADING && <Loader />}
      {movies.fetchStatus === FetchStatus.ERROR && <Heading level={4}>Error fetching movies</Heading>}
      {movies.movies.results?.length > 0 ? <div ref={setRef} className='sentinel' /> : null}
    </>
  )
}

export default Movies
