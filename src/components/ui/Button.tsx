interface ButtonProps {
  handleClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  children: React.ReactNode
}
export default function Button({ handleClick, children }: ButtonProps) {
  return (
    <button className='btn btn-primary' onClick={handleClick}>
      {children}
    </button>
  )
}
