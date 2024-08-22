import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../components/ui/Modal'

describe('Modal', () => {
  it('should hide the scroll when showContent is true', () => {
    render(<Modal showContent={true} closeModal={() => {}} children={<div>Modal Content</div>} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should show the modal content when showContent is true', () => {
    render(<Modal showContent={true} closeModal={() => {}} children={<div>Modal Content</div>} />)
    expect(screen.getByTestId('modal-body')).toBeInTheDocument()
  })

  it('should not show the modal content when showContent is false', () => {
    render(<Modal showContent={false} closeModal={() => {}} children={<div>Modal Content</div>} />)
    expect(screen.queryByText('modal-body')).not.toBeInTheDocument()
  })

  it('should call closeModal when the close button is clicked', async () => {
    const mockCloseModal = jest.fn()
    render(<Modal showContent={true} closeModal={mockCloseModal} children={<div>Modal Content</div>} />)
    userEvent.click(screen.getByTestId('close-btn'))
    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled()
    })
  })
})
