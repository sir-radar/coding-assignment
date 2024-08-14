import ReactPlayer from 'react-player'
import Loader from './Loader';

interface YoutubePlayerProps {
  videoKey: string;
  error?: string
  loading?: boolean
}

const YoutubePlayer = ({ videoKey, loading, error }: YoutubePlayerProps) => {
  if (loading) return <Loader />
  if (error) return <h6>Error loading trailer</h6>
  return (
    videoKey ?
      <div>
        <ReactPlayer
          className="video-player"
          url={`https://www.youtube.com/watch?v=${videoKey}`}
          controls={true}
          playing={true}
          data-testid="youtube-player"
        />
      </div>
      : <div style={{ padding: "30px" }}><h6>no trailer available. Try another movie</h6></div>
  );
}

export default YoutubePlayer;
