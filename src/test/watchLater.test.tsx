import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './utils';
import WatchLater from '../components/pages/WatchLater';
import watchLaterSlice from '../data/watchLaterSlice'
import { moviesMock } from './movies.mocks';
import { IMovie } from '../types/movie'

jest.mock('../hooks/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

const renderAppSelectMock = (data:IMovie[] = []) => {
  return require('../hooks/useAppSelector').useAppSelector.mockReturnValue({
    movies: {
      movies: {
				total_pages: 1,
				results: [],
      	},
      },
      starred: {
        starredMovies: [],
			},
			watchLater: {
				watchLaterMovies: data
			}
  });
}

const viewTrailerMock = jest.fn()

describe('WatchLater component', () => {
  it('shlould render with watchLater movies', () => {
    renderAppSelectMock(moviesMock);
    renderWithProviders(<WatchLater viewTrailer={viewTrailerMock} />);

    const starredMovies = screen.getByTestId('watch-later-movies');
    expect(starredMovies).toBeInTheDocument();
  });

	it('should render with no watchLater movies', () => {
		renderAppSelectMock([]);
    renderWithProviders(<WatchLater viewTrailer={viewTrailerMock} />);

    const emptyMessage = screen.getByTestId('empty-watch-later-message');
    expect(emptyMessage).toBeInTheDocument();
  });

  it('should call removeAllWatchLater action on button click', () => {
		renderAppSelectMock(moviesMock);
		const removeAllWatchLater = jest.spyOn(watchLaterSlice.actions, 'removeAllWatchLater');

    renderWithProviders(<WatchLater viewTrailer={() => {}} />)

    const button = screen.getByText('Empty list');
    fireEvent.click(button);
    expect(removeAllWatchLater).toHaveBeenCalledTimes(1);
  });
});
