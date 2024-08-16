import { screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './test/utils';
import { moviesMock } from './test/movies.mocks';
import userEvent from '@testing-library/user-event';

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
    require('./hooks/useGetMovies').useGetMovies.mockReturnValue(jest.fn());

		require('./hooks/useDebounce').useDebounce.mockReturnValue(jest.fn());

    require('./hooks/useGetMovie').useGetMovie.mockReturnValue({
      videoKey: '',
      loading: false,
      error: null,
      getMovie: jest.fn(),
		});

    require('./hooks/useInfiniteScroll').useInfiniteScroll.mockReturnValue({
      currentPage: { current: 1 },
      initInfiniteScroll: jest.fn(),
		});

    require('./hooks/useModal').useModal.mockReturnValue({
      isOpen: false,
      openModal: jest.fn(),
      closeModal: jest.fn(),
		});

    require('./hooks/useAppSelector').useAppSelector.mockReturnValue({
      movies: {
        movies: {
          total_pages: 1,
          results: [],
        },
      },
      starred: {
        starredMovies: []
			},
			watchLater: {
				watchLaterMovies: []
			}
    });
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
     require('./hooks/useInfiniteScroll').useInfiniteScroll.mockReturnValue({
      currentPage: { current: 1 },
      initInfiniteScroll: initScrollMock,
		});
    renderWithProviders(<App />)
    expect(initScrollMock).toHaveBeenCalledTimes(1);
  });

  it('search for movies', async () => {
    const getMoviesMock = jest.fn()
    const useDebounceMock = jest.fn()
    require('./hooks/useGetMovies').useGetMovies.mockReturnValue(getMoviesMock);
    require('./hooks/useDebounce').useDebounce.mockReturnValue(useDebounceMock);

    renderWithProviders(<App />)
    await userEvent.type(screen.getByTestId('search-movies'), 'forrest gump')
    await waitFor(() => {
      expect(useDebounceMock).toHaveBeenCalled()
      expect(getMoviesMock).toHaveBeenCalled()
    })
  })

  it('opens the trailer modal when a trailer is viewed', async () => {
    require('./hooks/useAppSelector').useAppSelector.mockReturnValue({
      movies: {
        movies: {
          total_pages: 1,
          results: moviesMock,
        },
      },
      starred: {
        starredMovies: []
			},
			watchLater: {
				watchLaterMovies: []
			}
    });
		const mockGetMovie = jest.fn();
		const mockOpenModal = jest.fn();
    require('./hooks/useGetMovie').useGetMovie.mockReturnValue({
      videoKey: 'sample-key',
      loading: false,
      error: null,
      getMovie: mockGetMovie,
		});

    require('./hooks/useModal').useModal.mockReturnValue({
      isOpen: false,
      openModal: mockOpenModal,
      closeModal: jest.fn(),
    });

    renderWithProviders(<App />);

    fireEvent.click(screen.getAllByText('View Trailer')[0]);

    await waitFor(() => {
			expect(mockGetMovie).toHaveBeenCalled();
			expect(mockOpenModal).toHaveBeenCalled();
    });
  });

  it('should close the modal when close is clicked', async () => {
    require('./hooks/useAppSelector').useAppSelector.mockReturnValue({
      movies: {
        movies: {
          total_pages: 1,
          results: moviesMock,
        },
      },
      starred: {
        starredMovies: []
			},
			watchLater: {
				watchLaterMovies: []
			}
    });
    const mockCloseModal = jest.fn();
    require('./hooks/useModal').useModal.mockReturnValue({
      isOpen: true,
      openModal: jest.fn(),
      closeModal: mockCloseModal,
    });

    renderWithProviders(<App />);
    fireEvent.click(screen.getAllByTestId('close-btn')[2]);

    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });
});

