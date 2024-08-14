import { renderHook } from '@testing-library/react';
import { useDebounce } from '../../hooks/useDebounce';

describe('useDebounce', () => {
  it('should not call the callback immediately', () => {
    const callback = jest.fn();
    const delay = 100;
    const { result } = renderHook(() => useDebounce(callback, delay));
    result.current();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the callback after the delay', async () => {
    const callback = jest.fn();
    const delay = 100;
    const { result } = renderHook(() => useDebounce(callback, delay));
    result.current();
    await new Promise(resolve => setTimeout(resolve, delay + 10));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should only call the callback once even if called multiple times within the delay period', async () => {
    const callback = jest.fn();
    const delay = 100;
    const { result } = renderHook(() => useDebounce(callback, delay));
    result.current();
    result.current();
    await new Promise(resolve => setTimeout(resolve, delay + 10));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel the debounced callback when the component is unmounted', async () => {
    const callback = jest.fn();
    const delay = 100;
    const { result, unmount } = renderHook(() => useDebounce(callback, delay));
    result.current();
    unmount();
    await new Promise(resolve => setTimeout(resolve, delay + 10));
    expect(callback).not.toHaveBeenCalled();
  });
});
