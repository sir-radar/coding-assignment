import { useEffect, useRef, useCallback } from 'react'

export const useInfiniteScroll = (callback: (query: string) => void, query?: string | null) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const hasIntersectedRef = useRef(false);

  const sentinelRef = useCallback(
    (node: HTMLDivElement) => {
      if (!node) return

      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasIntersectedRef.current) {
          callback(query || '');
        }
        hasIntersectedRef.current = true;
      })
      })

      observerRef.current.observe(node)
    },
    [callback, query]
  )

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  return sentinelRef
}
