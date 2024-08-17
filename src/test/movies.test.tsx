import { waitFor, screen } from '@testing-library/react'
import Movies from '../components/pages/Movies'
import { renderAppSelectMock, renderWithProviders } from './utils'
import { moviesMock } from './movies.mocks'
import { useGetMovies } from '../hooks/useGetMovies'

jest.mock('../hooks/useAppSelector', () => ({
  useAppSelector: jest.fn()
}))

jest.mock('../hooks/useGetMovies', () => ({
  useGetMovies: jest.fn()
}))

describe('Movies component', () => {
  const viewTrailer = jest.fn()
  let useGetMoviesMock: jest.SpyInstance

  beforeEach(() => {
    renderAppSelectMock()
    useGetMoviesMock = (useGetMovies as jest.Mock).mockReturnValue(() => jest.fn())
  })

  it('should render no movies', () => {
    renderWithProviders(<Movies viewTrailer={viewTrailer} />)
    expect(screen.getByTestId('movies')).toBeInTheDocument()
    expect(screen.getByTestId('movies')).toBeEmptyDOMElement()
  })

  it('should render movies', () => {
    renderAppSelectMock(moviesMock)
    renderWithProviders(<Movies viewTrailer={viewTrailer} />)
    expect(screen.getAllByTestId('movie-card')).toHaveLength(2)
  })

  it('should render loading state', () => {
    renderAppSelectMock([], [], [], 'loading')
    renderWithProviders(<Movies viewTrailer={viewTrailer} />)
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('should render error state', () => {
    renderAppSelectMock([], [], [], 'error')
    renderWithProviders(<Movies viewTrailer={viewTrailer} />)
    expect(screen.getByText('Error fetching movies')).toBeInTheDocument()
  })

  it('should fetch movies on first render', async () => {
    renderWithProviders(<Movies viewTrailer={viewTrailer} />)
    await waitFor(() => expect(useGetMoviesMock).toHaveBeenCalledTimes(1))
  })
})
