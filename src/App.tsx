import { useEffect, useRef } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
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
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const navigate = useNavigate()
	const getMovies = useGetMovies(searchQuery)
  const { videoKey, loading, error, getMovie } = useGetMovie();
  const { isOpen, openModal, closeModal } = useModal();
  const state = useAppSelector((state) => state)
	const { movies } = state
  const containerRef = useRef<HTMLDivElement>(null)


  const { currentPage, initInfiniteScroll } = useInfiniteScroll((query) => {
    getMovies(query, currentPage.current, FetchType.INFINITE)
	},movies.movies.total_pages, searchQuery )

  const getSearchResults = useDebounce((query: string) => {
    getMovies(query, 1, FetchType.SEARCH)
  }, 700);

  const searchMovies = (query: string) => {
    navigate('/')
    containerRef.current?.scrollIntoView()
    currentPage.current = 1
    setSearchParams(createSearchParams({ search: query }))
    getSearchResults(query)
  }

	const viewTrailer = (movie: IMovie) => {
		getMovie(movie.id)
		openModal()
  }

  useEffect(() => {
    initInfiniteScroll()
  }, [initInfiniteScroll])

  return (
    <div className="App">
      <Header searchMovies={searchMovies} />

      <div ref={containerRef} className="container">
        <Modal showContent={isOpen} closeModal={closeModal}>
          <YoutubePlayer videoKey={videoKey || ''} loading={loading} error={error} />
        </Modal>

        <Routes>
          <Route path="/" element={<Movies viewTrailer={viewTrailer}  />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App

