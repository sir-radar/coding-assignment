import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

describe('useInfiniteScroll', () => {
  const callback = jest.fn();

  beforeEach(() => {
    callback.mockClear();
  });

  it('should initialize with page 1', () => {
    const total_pages = 10
    const { result } = renderHook(() => useInfiniteScroll(callback, total_pages));

    expect(result.current.currentPage.current).toBe(1);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should increment page number and call callback on scroll', () => {
    const total_pages = 10
    const { result } = renderHook(() => useInfiniteScroll(callback,total_pages));

    Object.defineProperty(window, 'innerHeight', { value: 800 });
    document.documentElement.scrollTop = 1800;
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2600 });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.currentPage.current).toBe(2);
    expect(callback).toHaveBeenCalledTimes(1);
  });

   it('should not call callback on scroll when total_pages has been reached', () => {
    const total_pages = 1
    renderHook(() => useInfiniteScroll(callback,total_pages));

    Object.defineProperty(window, 'innerHeight', { value: 800 });
    document.documentElement.scrollTop = 1800;
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2600 });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('should call callback with the correct query value when initInfiniteScroll is called', () => {
    const total_pages = 10
    const query = 'test query';
    renderHook(() => useInfiniteScroll(callback, total_pages, query));
    Object.defineProperty(window, 'innerHeight', { value: 800 });
    document.documentElement.scrollTop = 1800;
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2600 });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(query);
  });

  it('should not increment page or call callback if scroll position does not reach bottom', () => {
    const total_pages = 10
		const { result } = renderHook(() => useInfiniteScroll(callback, total_pages));

    Object.defineProperty(window, 'innerHeight', { value: 800 });
    document.documentElement.scrollTop = 1000;
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2600 });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.currentPage.current).toBe(1);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should remove the scroll event listener on unmount', () => {
    const total_pages = 10
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useInfiniteScroll(callback, total_pages));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
