interface ImageProps {
  alt: string
  src: string
  className: string
}

export default function Image({ alt, src, className }: ImageProps) {
  return <img loading='lazy' className={className} src={src} alt={alt} />
}
