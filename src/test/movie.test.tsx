import {  fireEvent, screen, waitFor } from '@testing-library/react';
import  Movie  from '../components/ui/Movie';
import { moviesMock } from './movies.mocks';
import { renderAppDispatchMock, renderAppSelectMock, renderWithProviders } from './utils';

jest.mock('../hooks/useAppDispatch', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('../hooks/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

const viewTrailer = jest.fn();

describe('Movie component', () => {
   afterEach(() => {
    // Reset window size after each test
    window.innerWidth = 1024;
    window.innerHeight = 768;

    window.dispatchEvent(new Event('resize'));
   });

  it('should render correctly', () => {
    const movie = moviesMock[0];
    renderAppSelectMock(moviesMock)
    renderWithProviders(<Movie movie={movie} viewTrailer={viewTrailer} />);
    expect(screen.getAllByText(movie.title)[0]).toBeInTheDocument();
    expect(screen.getByText(movie.overview)).toBeInTheDocument();
    expect(screen.getByAltText('Movie poster')).toBeInTheDocument();
  });

  it('should toggle star and unstar correctly', () => {
    const movie = moviesMock[0];
    const dispatch = renderAppDispatchMock();
    renderAppSelectMock(moviesMock)
    renderWithProviders(<Movie movie={movie} viewTrailer={viewTrailer} />);
    const starButton = screen.getByTestId('starred-link');
    fireEvent.click(starButton);
    expect(dispatch).toHaveBeenCalledTimes(1);

    waitFor(() => {
      const unstarButton = screen.getByTestId('unstar-link');
      fireEvent.click(unstarButton);
      expect(dispatch).toHaveBeenCalledTimes(1);
    })
  });

  it('should toggle watch later correctly', () => {
    const movie = moviesMock[0];

    const dispatch = renderAppDispatchMock();
    renderAppSelectMock(moviesMock)

    renderWithProviders(<Movie movie={movie} viewTrailer={viewTrailer} />);

    const watchLaterButton = screen.getByTestId('watch-later');
    fireEvent.click(watchLaterButton);
    expect(dispatch).toHaveBeenCalledTimes(1);

    waitFor(() => {
      const removeWatchLaterButton = screen.getByTestId('remove-watch-later');
      fireEvent.click(removeWatchLaterButton);
      expect(dispatch).toHaveBeenCalledTimes(1);
    })
  });

  it('should toggled opened class on card div correctly when in mobile view', () => {
    window.innerWidth = 375;
    window.innerHeight = 812;
    window.dispatchEvent(new Event('resize'));

    const movie = moviesMock[0];

    renderAppSelectMock(moviesMock)
    renderWithProviders(<Movie movie={movie} viewTrailer={viewTrailer} />);

    const movieCard = screen.getByTestId('movie-card');

    expect(movieCard).toHaveClass('card');

    fireEvent.click(movieCard);

    expect(movieCard).toHaveClass('card opened');
    const closeButton = screen.getByTestId('close-btn');
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(movieCard).toHaveClass('card');
  });

  it('show displays modal and viewTrailer function should be called when view trailer button is clicked', () => {
    const movie = moviesMock[0];

    renderAppSelectMock(moviesMock)
    renderWithProviders(<Movie movie={movie} viewTrailer={viewTrailer} />);
    const viewTrailerButton = screen.getByText('View Trailer');
    fireEvent.click(viewTrailerButton);

    expect(viewTrailer).toHaveBeenCalledTimes(1);
    waitFor(() => {
      expect(screen.getByTestId('modal-body')).toBeInTheDocument;
    })
  });
});
