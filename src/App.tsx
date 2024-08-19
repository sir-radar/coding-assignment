import { useRef } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import 'reactjs-popup/dist/index.css'
import AppRoutes from './routes'

import { Header, YoutubePlayer, Modal } from './components/ui'

import { FetchType } from './types/movie'
import { useGetMovies } from './hooks/useGetMovies'
import { useDebounce } from './hooks/useDebounce'
import { useTrailerContext } from './hooks/useTrailerContext'

import './app.scss'

const App = () => {
  const deBounceTime = 700
  const navigate = useNavigate()
  const getMovies = useGetMovies()
  const containerRef = useRef<HTMLDivElement>(null)
  const { isOpen, closeModal, videoKey, loading, error } = useTrailerContext()

  const getSearchResults = useDebounce((query: string) => {
    navigate({
      pathname: '/',
      search: `?${createSearchParams({ search: query })}`
    })
    getMovies(query, 1, FetchType.SEARCH)
  }, deBounceTime)

  const searchMovies = (query: string) => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' })
    getSearchResults(query)
  }

  return (
    <div className='App'>
      <Header searchMovies={searchMovies} />

      <div ref={containerRef} className='container'>
        <Modal showContent={isOpen} closeModal={closeModal}>
          <YoutubePlayer videoKey={videoKey || ''} loading={loading} error={error} />
        </Modal>

        <AppRoutes />
      </div>
    </div>
  )
}

export default App
