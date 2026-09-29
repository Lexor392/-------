function Icon({ name, library = 'material', className = '' }) {
  if (library === 'bootstrap') {
    return <i className={`bi bi-${name} ${className}`.trim()} aria-hidden="true" />
  }

  return <span className={`material-symbols-rounded ${className}`.trim()} aria-hidden="true">{name}</span>
}

export default Icon
