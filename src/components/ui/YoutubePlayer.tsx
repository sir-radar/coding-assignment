import ReactPlayer from 'react-player'
import Loader from './Loader'
import Heading from './Heading'

interface YoutubePlayerProps {
  videoKey: string
  error?: string
  loading?: boolean
}

const YoutubePlayer = ({ videoKey, loading, error }: YoutubePlayerProps) => {
  if (loading) return <Loader />
  if (error) return <Heading level={6}>Error loading trailer</Heading>
  return videoKey ? (
    <ReactPlayer
      className='video-player'
      url={`https://www.youtube.com/watch?v=${videoKey}`}
      controls={true}
      playing={true}
      data-testid='youtube-player'
    />
  ) : (
    <div style={{ padding: '30px' }}>
      <Heading level={6}>no trailer available. Try another movie</Heading>
    </div>
  )
}

export default YoutubePlayer
