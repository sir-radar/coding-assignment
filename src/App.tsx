import { useRef, useState } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import 'reactjs-popup/dist/index.css'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import YoutubePlayer from './components/YoutubePlayer'
import Modal from './components/Modal'

import { IMovie } from './types/movie'
import { useGetMovies } from './hooks/useGetMovies'
import { useGetMovie } from './hooks/useGetMovie'
import { useDebounce } from './hooks/useDebounce'
import { useInfiniteScroll } from './hooks/useInfiniteScroll'

import './app.scss'



const App = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()
  const searchQuery = searchParams.get('search')
	const getMovies = useGetMovies(searchQuery)
  const { videoKey, loading, error, getMovie } = useGetMovie();
  const containerRef = useRef<HTMLDivElement>(null)

  const closeModal = () => setOpen(false)

  const { setCurrentPage, currentPage, handleInfiniteScroll } = useInfiniteScroll(() => {
		getMovies(searchQuery, currentPage + 1)
	})

  const getSearchResults = useDebounce((query: string) => {
    getMovies(query, 1, 'search')
  }, 700);

  const searchMovies = (query: string) => {
    navigate('/')
    containerRef?.current?.scrollIntoView()
    setCurrentPage(1)
    setSearchParams(createSearchParams({ search: query }))
    getSearchResults(query)
  }

	const viewTrailer = (movie: IMovie) => {
		getMovie(movie.id)
		setOpen(true)
	}

  return (
    <div className="App">
      <Header searchMovies={searchMovies} />

      <div ref={containerRef} className="container">
        <Modal showContent={isOpen} closeModal={closeModal}>
          <YoutubePlayer videoKey={videoKey!} loading={loading} error={error} />
        </Modal>

        <Routes>
          <Route path="/" element={<Movies viewTrailer={viewTrailer} handleInfiniteScroll={handleInfiniteScroll} currentPage={currentPage}  />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App

