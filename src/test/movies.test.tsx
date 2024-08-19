import { waitFor, screen, fireEvent } from '@testing-library/react'
import Movies from '../components/pages/Movies'
import { renderAppSelectMock, renderWithProviders } from './utils'
import { moviesMock } from './movies.mocks'
import { useGetMovies } from '../hooks/useGetMovies'
import { useTrailerContext } from '../hooks/useTrailerContext'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { FetchStatus } from '../types/movie'

jest.mock('../hooks/useAppSelector', () => ({
  useAppSelector: jest.fn()
}))

jest.mock('../hooks/useGetMovies', () => ({
  useGetMovies: jest.fn()
}))

jest.mock('../hooks/useGetMovies')
jest.mock('../hooks/useAppSelector')
jest.mock('../hooks/useTrailerContext')
jest.mock('../hooks/useInfiniteScroll')

describe('Movies component', () => {
  let useGetMoviesMock: jest.Mock
  let useInfiniteScrollMock: jest.Mock

  beforeEach(() => {
    renderAppSelectMock()
    useGetMoviesMock = (useGetMovies as jest.Mock).mockReturnValue(jest.fn())

    useGetMoviesMock = useGetMovies as jest.Mock
    useInfiniteScrollMock = useInfiniteScroll as jest.Mock
    ;(useTrailerContext as jest.Mock).mockReturnValue({
      videoKey: '',
      loading: false,
      error: '',
      isOpen: true,
      viewTrailer: jest.fn(),
      closeModal: jest.fn()
    })
  })

  it('should render with no movies', () => {
    renderAppSelectMock([])

    const { getByTestId } = renderWithProviders(<Movies />)
    expect(getByTestId('movies')).toBeEmptyDOMElement()
  })

  it('should render with movies', () => {
    renderAppSelectMock(moviesMock)
    const { getAllByTestId } = renderWithProviders(<Movies />)
    expect(getAllByTestId('movie-card')).toHaveLength(2)
  })

  it('should render with loading state', () => {
    renderAppSelectMock([], [], [], FetchStatus.LOADING)
    renderWithProviders(<Movies />)
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('should render with error state', () => {
    renderAppSelectMock([], [], [], FetchStatus.ERROR)
    renderWithProviders(<Movies />)
    expect(screen.getByText('Error fetching movies')).toBeInTheDocument()
  })

  it('should fetch movies on first render', async () => {
    renderWithProviders(<Movies />)
    await waitFor(() => expect(useGetMoviesMock).toHaveBeenCalledTimes(1))
  })

  it('should initialize infinite scroll functionality', async () => {
    renderAppSelectMock(moviesMock)
    useInfiniteScrollMock.mockReturnValue(jest.fn())
    const { getByTestId } = renderWithProviders(<Movies />)
    fireEvent.scroll(getByTestId('movies'), { target: { scrollTop: 100 } })
    await waitFor(() => expect(useInfiniteScrollMock).toHaveBeenCalledTimes(1))
  })
})
