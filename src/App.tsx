import { useEffect, useRef } from 'react'
import { createSearchParams, useSearchParams, useNavigate, useLocation } from "react-router-dom"
import 'reactjs-popup/dist/index.css'
import AppRoutes from './routes';

import { Header, YoutubePlayer, Modal } from './components/ui'

import { FetchType } from './types/movie'
import { useGetMovies } from './hooks/useGetMovies'
import { useDebounce } from './hooks/useDebounce'
import { useInfiniteScroll } from './hooks/useInfiniteScroll'
import { useAppSelector } from './hooks/useAppSelector'
import { useTrailerContext } from './hooks/useTrailerContext';

import './app.scss'



const App = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const navigate = useNavigate()
  const location = useLocation();
	const getMovies = useGetMovies(searchQuery)
  // const { videoKey, loading, error, getMovie } = useGetMovie();
  // const { isOpen, openModal, closeModal } = useModal();
  const state = useAppSelector((state) => state)
	const { movies } = state
  const containerRef = useRef<HTMLDivElement>(null)
  const { isOpen, closeModal, videoKey, loading, error } = useTrailerContext()

  const { currentPage, initInfiniteScroll, resetInfiniteScroll } = useInfiniteScroll((query) => {
    getMovies(query, currentPage.current, FetchType.INFINITE)
	},movies.movies.total_pages, searchQuery )

  const getSearchResults = useDebounce((query: string) => {
    navigate({
      pathname: '/',
      search: `?${createSearchParams({ search: query })}`,
    })
    getMovies(query, 1, FetchType.SEARCH)
  }, 700);

  const searchMovies = (query: string) => {
    containerRef.current?.scrollIntoView()
    currentPage.current = 1
    getSearchResults(query)
  }

  useEffect(() => {
    // Reset infinite scroll when location is not home
     if (location.pathname === '/') {
      initInfiniteScroll();
    } else {
      resetInfiniteScroll();
    }
  }, [initInfiniteScroll, resetInfiniteScroll, location.pathname])

  return (
    <div className="App">
      <Header searchMovies={searchMovies} />

      <div ref={containerRef} className="container">
        <Modal showContent={isOpen} closeModal={closeModal}>
          <YoutubePlayer videoKey={videoKey || ''} loading={loading} error={error} />
        </Modal>

        <AppRoutes />
      </div>
    </div>
  )
}

export default App

