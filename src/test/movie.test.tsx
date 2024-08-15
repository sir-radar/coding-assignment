import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './utils';
import App from '../App';

it('movies starred and saved to watch later', async () => {
    renderWithProviders(<App />);

    await userEvent.type(screen.getByTestId('search-movies'), 'forrest gump');

    const movieTitle = await screen.findAllByText('Through the Eyes of Forrest Gump');
    expect(movieTitle[0]).toBeInTheDocument();

    const starMovieLink = screen.getAllByTestId('starred-link')[0];
    await userEvent.click(starMovieLink);

    expect(await screen.findByTestId('star-fill')).toBeInTheDocument();
    expect(screen.getByTestId('unstar-link')).toBeInTheDocument();

    const watchLaterLink = screen.getAllByTestId('watch-later')[0];
    await userEvent.click(watchLaterLink);

    expect(await screen.findByTestId('remove-watch-later')).toBeInTheDocument();

    await userEvent.click(screen.getAllByTestId('remove-watch-later')[0]);

    await waitFor(() => {
        expect(screen.queryByTestId('remove-watch-later')).not.toBeInTheDocument();
    });
});
