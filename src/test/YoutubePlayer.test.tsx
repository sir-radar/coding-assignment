import { render, screen, act } from '@testing-library/react';
import YoutubePlayer from '../components/YoutubePlayer';

describe('YoutubePlayer', () => {
  it('renders loading state', async () => {
    await act(async () => {
      render(<YoutubePlayer videoKey="" loading={true} error="" />);
    });
    expect(screen.queryByTestId('youtube-player')).not.toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    await act(async () => {
      render(<YoutubePlayer videoKey="" loading={false} error="Error loading trailer" />);
    });
    expect(screen.queryByTestId('youtube-player')).not.toBeInTheDocument();
    expect(screen.getByText('Error loading trailer')).toBeInTheDocument();
  });

  it('renders video player when videoKey is provided', async () => {
    const videoKey = 'some-video-key';
    await act(async () => {
      render(<YoutubePlayer videoKey={videoKey} loading={false} error="" />);
    });
    expect(screen.getByTestId('youtube-player')).toBeInTheDocument();
  });

  it('renders message when videoKey is not provided', async () => {
    await act(async () => {
      render(<YoutubePlayer videoKey="" loading={false} error="" />);
    });
    expect(screen.getByText('no trailer available. Try another movie')).toBeInTheDocument();
  });
});
