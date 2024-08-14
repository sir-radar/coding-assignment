import "../styles/modal.scss"

interface ModalContentProps {
  children: React.ReactNode
  closeModal: () => void
}

export default function ModalContent({ children, closeModal }: ModalContentProps) {
  return (
    <div className="modal">
      <div className="overlay" onClick={() =>  closeModal()}></div>
      <div className="modal-content">
        <button type="button" className="close" onClick={() => closeModal()} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        {children}
      </div>
    </div>
  )
}
