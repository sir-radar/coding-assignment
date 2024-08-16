import { useEffect, useCallback, useRef } from 'react';

type CallbackType = (query: string) => void

export const useInfiniteScroll = (callback: CallbackType, query?: string | null) => {
  const currentPage = useRef<number>(1);

  const initInfiniteScroll = useCallback(() => {
    const { innerHeight } = window;
		const { scrollTop, scrollHeight } = document.documentElement;

    if (innerHeight + scrollTop + 1 >= scrollHeight) {
        currentPage.current += 1;
        callback(query!);
    }
	}, [query, callback]);

  useEffect(() => {
    window.addEventListener('scroll', initInfiniteScroll);
    return () => window.removeEventListener('scroll', initInfiniteScroll);
  }, [query, initInfiniteScroll]);

  return { currentPage, initInfiniteScroll };
};
