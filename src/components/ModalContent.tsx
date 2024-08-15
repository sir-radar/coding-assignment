import "../styles/modal.scss"

interface ModalContentProps {
  children: React.ReactNode
  closeModal: () => void
}

export default function ModalContent({ children, closeModal }: ModalContentProps) {
  return (
    <div data-testid="modal-body" className="modal">
      <div className="overlay" onClick={() =>  closeModal()}></div>
      <div className="modal-content">
        <button data-testid="modal-close-btn" type="button" className="close" onClick={() => closeModal()} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        {children}
      </div>
    </div>
  )
}
