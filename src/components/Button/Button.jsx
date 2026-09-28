function Button({ children, variant = 'primary', type = 'button', onClick, disabled = false, ...props }) {
  return (
    <button className={`button button--${variant}`} type={type} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export default Button
