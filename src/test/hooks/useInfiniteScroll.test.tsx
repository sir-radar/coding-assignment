import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

describe('useInfiniteScroll', () => {
  const callback = jest.fn();

  beforeEach(() => {
    callback.mockClear();
  });

  it('should initialize with page 1', () => {
    const { result } = renderHook(() => useInfiniteScroll(callback));

    expect(result.current.currentPage).toBe(1);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should increment page number and call callback on scroll', () => {
    const { result } = renderHook(() => useInfiniteScroll(callback));

    Object.defineProperty(window, 'innerHeight', { value: 800 });
    document.documentElement.scrollTop = 1800;
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2600 });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.currentPage).toBe(2);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not increment page or call callback if scroll position does not reach bottom', () => {
		const { result } = renderHook(() => useInfiniteScroll(callback));

    Object.defineProperty(window, 'innerHeight', { value: 800 });
    document.documentElement.scrollTop = 1000;
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2600 });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.currentPage).toBe(1);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should remove the scroll event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useInfiniteScroll(callback));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});

