import { useEffect, useCallback, useState } from 'react';

export const useInfiniteScroll = (callback?: () => void) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleInfiniteScroll = useCallback(() => {
    const { innerHeight, scrollY } = window;
		const { offsetHeight } = document.documentElement;

    if (innerHeight + scrollY >= offsetHeight - 1) {
			if (callback) {
				setCurrentPage((prev) => prev + 1);
        callback();
      }
    }
	}, [callback]);

  useEffect(() => {
    window.addEventListener('scroll', handleInfiniteScroll);
    return () => window.removeEventListener('scroll', handleInfiniteScroll);
  }, [handleInfiniteScroll]);

  return { currentPage, setCurrentPage, handleInfiniteScroll };
};
