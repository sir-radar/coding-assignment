import { useState } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import 'reactjs-popup/dist/index.css'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import YouTubePlayer from './components/YoutubePlayer'

import { IMovie } from './types/movie'
import { useGetMovies } from './hooks/useGetMovies'
import { useGetMovie } from './hooks/useGetMovie'
import { useDebounce } from './hooks/useDebounce'

import './app.scss'

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()
  const searchQuery = searchParams.get('search')
	const getMovies = useGetMovies(searchQuery)
	const { videoKey, loading, error, getMovie } = useGetMovie();

  const closeModal = () => setOpen(false)

  const closeCard = () => {

  }

  const getSearchResults = useDebounce((query: string) => {
    getMovies(query)
  }, 700);

  const searchMovies = (query: string) => {
    navigate('/')
    setSearchParams(createSearchParams({ search: query }))
    getSearchResults(query)
  }

	const viewTrailer = (movie: IMovie) => {
		getMovie(movie.id)
		if (!videoKey) setOpen(true)
		setOpen(true)
	}

  return (
    <div className="App">
      <Header searchMovies={searchMovies} />

      <div className="container">
        {videoKey ? (
          <YouTubePlayer
            videoKey={videoKey}
          />
        ) : (
          <div style={{padding: "30px"}}><h6>no trailer available. Try another movie</h6></div>
        )}

        <Routes>
          <Route path="/" element={<Movies viewTrailer={viewTrailer} closeCard={closeCard} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
