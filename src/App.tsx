import {  useEffect, useRef } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate, useLocation } from "react-router-dom"
import 'reactjs-popup/dist/index.css'
import Movies from './components/pages/Movies'
import Starred from './components/pages/Starred'
import WatchLater from './components/pages/WatchLater'

import { Header, YoutubePlayer, Modal } from './components/ui'

import { FetchType, IMovie } from './types/movie'
import { useGetMovies } from './hooks/useGetMovies'
import { useGetMovie } from './hooks/useGetMovie'
import { useDebounce } from './hooks/useDebounce'
import { useInfiniteScroll } from './hooks/useInfiniteScroll'
import { useModal } from './hooks/useModal'
import { useAppSelector } from './hooks/useAppSelector'

import './app.scss'


const App = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const navigate = useNavigate()
  const location = useLocation();
	const getMovies = useGetMovies(searchQuery)
  const { videoKey, loading, error, getMovie } = useGetMovie();
  const { isOpen, openModal, closeModal } = useModal();
  const state = useAppSelector((state) => state)
	const { movies } = state
  const containerRef = useRef<HTMLDivElement>(null)

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

	const viewTrailer = (movie: IMovie) => {
		getMovie(movie.id)
		openModal()
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

        <Routes>
          <Route path="/" element={<Movies viewTrailer={viewTrailer} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App

