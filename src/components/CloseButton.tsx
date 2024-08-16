interface CloseButtonProps {
  handleClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
export default function CloseButton({ handleClick } : CloseButtonProps) {
  return (
    <button data-testid="close-btn" type="button" className="close" onClick={(e) => handleClick(e)} aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  )
}
