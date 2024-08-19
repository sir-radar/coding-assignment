import { renderHook, act } from '@testing-library/react'
import { useModal } from '../../hooks/useModal'

describe('useModal', () => {
  it('should return isOpen as false by default', () => {
    const { result } = renderHook(() => useModal())

    expect(result.current.isOpen).toBe(false)
  })

  it('should set isOpen to true when openModal is called', () => {
    const { result } = renderHook(() => useModal())

    act(() => {
      result.current.openModal()
    })

    expect(result.current.isOpen).toBe(true)
  })

  it('should set isOpen to false when closeModal is called', () => {
    const { result } = renderHook(() => useModal())

    act(() => {
      result.current.openModal()
    })

    act(() => {
      result.current.closeModal()
    })

    expect(result.current.isOpen).toBe(false)
  })
})
