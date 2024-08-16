import CloseButton from "./CloseButton"

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
        <CloseButton handleClick={closeModal}/>
        {children}
      </div>
    </div>
  )
}
