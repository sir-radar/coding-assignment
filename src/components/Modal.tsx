import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent';


interface ModalProps {
  children: React.ReactNode
  showContent: boolean
  closeModal: () => void
}


export default function Modal({ children, showContent = false, closeModal }: ModalProps) {
  useEffect(() => {
    const body = document.querySelector('body')!;
    body.style.overflow = showContent ? 'hidden' : 'auto';
  }, [showContent])

  return (
    <>
      {showContent ? createPortal(
        <ModalContent closeModal={closeModal}>
          {children}
        </ModalContent>
        ,
        document.body
      ) : null}
    </>
  );
}
