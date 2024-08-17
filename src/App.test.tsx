import { screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { renderAppSelectMock, renderWithProviders, useGetMovieMock, useInfiniteScrollMock, useModalMock } from './test/utils';
import { moviesMock } from './test/movies.mocks';
import userEvent from '@testing-library/user-event';
import { useGetMovies } from './hooks/useGetMovies';
import { useDebounce } from './hooks/useDebounce';

// Mock the custom hooks
jest.mock('./hooks/useGetMovies', () => ({
  useGetMovies: jest.fn(),
}));

jest.mock('./hooks/useGetMovie', () => ({
  useGetMovie: jest.fn(),
}));

jest.mock('./hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: jest.fn(),
}));

jest.mock('./hooks/useModal', () => ({
  useModal: jest.fn(),
}));

jest.mock('./hooks/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('./hooks/useDebounce', () => ({
  useDebounce: jest.fn((fn) => fn),
}));

describe('App Component', () => {
  beforeEach(() => {
    (useGetMovies as jest.Mock).mockReturnValue(jest.fn())

		(useDebounce as jest.Mock).mockReturnValue(jest.fn());

    useGetMovieMock()

    useInfiniteScrollMock()

    useModalMock()

    renderAppSelectMock()
  });

  it('renders the app component correctly', async () => {
    renderWithProviders(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('movies')).toBeInTheDocument();
    });
  });

  it('renders watch later link', () => {
    renderWithProviders(<App />)
    const linkElement = screen.getByText(/watch later/i)
    expect(linkElement).toBeInTheDocument()
  })

  it('renders starred link', () => {
    renderWithProviders(<App />)
    const linkElement = screen.getByTestId('nav-starred')
    expect(linkElement).toBeInTheDocument()
  })

  it('navigates to the starred page', async () => {
    renderWithProviders(<App />);

    fireEvent.click(screen.getByTestId('nav-starred'));

    expect(screen.getByText(/There are no starred movies/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('starred')).toBeInTheDocument();
    });
  });

  it('navigates to the watch later page', async () => {
    renderWithProviders(<App />);

    fireEvent.click(screen.getByText(/watch later/i));

    expect(screen.getByText(/You have no movies saved to watch later./i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('watch-later-div')).toBeInTheDocument();
    });
  });

  it('initInfiniteScroll function is called on mount', () => {
    const initScrollMock = jest.fn()
    useInfiniteScrollMock(initScrollMock)
    renderWithProviders(<App />)
    expect(initScrollMock).toHaveBeenCalledTimes(1);
  });

  it('search for movies', async () => {
    const getMoviesMock = (useGetMovies as jest.Mock).mockReturnValue(jest.fn());
    const useDebounceMock = (useDebounce as jest.Mock).mockReturnValue(jest.fn());

    renderWithProviders(<App />)
    await userEvent.type(screen.getByTestId('search-movies'), 'forrest gump')
    await waitFor(() => {
      expect(useDebounceMock).toHaveBeenCalled()
      expect(getMoviesMock).toHaveBeenCalled()
    })
  })

  it('opens the trailer modal when a trailer is viewed', async () => {
    renderAppSelectMock(moviesMock)
		const mockGetMovie = jest.fn();
    const mockOpenModal = jest.fn();
    useGetMovieMock(mockGetMovie)

    useModalMock(false,mockOpenModal, jest.fn())

    renderWithProviders(<App />);

    fireEvent.click(screen.getAllByText('View Trailer')[0]);

    await waitFor(() => {
			expect(mockGetMovie).toHaveBeenCalled();
			expect(mockOpenModal).toHaveBeenCalled();
    });
  });

  it('should close the modal when close button is clicked', async () => {
    renderAppSelectMock(moviesMock)

    const mockCloseModal = jest.fn();

    useModalMock(true,jest.fn(), mockCloseModal)

    renderWithProviders(<App />);
    fireEvent.click(screen.getAllByTestId('close-btn')[2]);

    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });
});

