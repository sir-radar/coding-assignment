import { useState } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import 'reactjs-popup/dist/index.css'
import {  ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import YouTubePlayer from './components/YoutubePlayer'


import './app.scss'
import { IMovie } from './types/movie'
import { useGetMovies } from './hooks/useGetMovies'

const App = () => {

  const [searchParams, setSearchParams] = useSearchParams()
  const [videoKey, setVideoKey] = useState()
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()
  const searchQuery = searchParams.get('search')
  const getMovies = useGetMovies(searchQuery)

  const closeModal = () => setOpen(false)

  const closeCard = () => {

  }

  const getSearchResults = (query: string) => {
    setSearchParams(createSearchParams({ search: query }))
    getMovies(query)
  }

  const searchMovies = (query: string) => {
    navigate('/')
    getSearchResults(query)
  }

	const viewTrailer = (movie: IMovie) => {
		getMovie(movie.id)
		if (!videoKey) setOpen(true)
		setOpen(true)
	}


  const getMovie = async (id: string) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setVideoKey(undefined)
    const videoData = await fetch(URL)
      .then((response) => response.json())

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(vid => vid.type === 'Trailer')
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key)
    }
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
