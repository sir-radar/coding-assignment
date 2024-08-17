import { screen, fireEvent } from '@testing-library/react'
import { renderAppSelectMock, renderWithProviders } from './utils'
import Starred from '../components/pages/Starred'
import starredSlice from '../data/starredSlice'
import { moviesMock } from './movies.mocks'

jest.mock('../hooks/useAppSelector', () => ({
  useAppSelector: jest.fn()
}))

const viewTrailerMock = jest.fn()

describe('Starred component', () => {
  it('shlould render with starred movies', () => {
    renderAppSelectMock([], moviesMock, [])
    renderWithProviders(<Starred viewTrailer={viewTrailerMock} />)

    const starredMovies = screen.getByTestId('starred-movies')
    expect(starredMovies).toBeInTheDocument()
  })

  it('should render with no starred movies', () => {
    renderAppSelectMock([])
    renderWithProviders(<Starred viewTrailer={viewTrailerMock} />)

    const emptyMessage = screen.getByTestId('empty-strarred-message')
    expect(emptyMessage).toBeInTheDocument()
  })

  it('should call clearAllStarred action on button click', () => {
    renderAppSelectMock([], moviesMock, [])
    const handleClearAllStarred = jest.spyOn(starredSlice.actions, 'clearAllStarred')

    renderWithProviders(<Starred viewTrailer={() => {}} />)

    const button = screen.getByText('Remove All Starred')
    fireEvent.click(button)
    expect(handleClearAllStarred).toHaveBeenCalledTimes(1)
  })
})
