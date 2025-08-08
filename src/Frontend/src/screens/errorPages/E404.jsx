import "../css/errores.css"

export const E404 = () => {
  const handleGoBack = () => {
    window.history.back()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  const handleSearch = () => {
    const searchTerm = document.querySelector('.error-404-search-input').value
    if (searchTerm.trim()) {
      alert(`Buscando: ${searchTerm}`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="error-404-container">
      <div className="error-404-content">
        <div className="error-404-icon-section">
          <div className="error-404-icon">🔍</div>
          <div className="error-404-code">404</div>
        </div>
        
        <div className="error-404-text-section">
          <h1 className="error-404-title">Página No Encontrada</h1>
          <p className="error-404-description">
            La página que estás buscando no existe o ha sido movida. Verifica la URL o utiliza la navegación para encontrar lo que necesitas.
          </p>
        </div>

        <div className="error-404-actions">
          <button className="error-404-primary-button" onClick={handleGoHome}>
            <span className="error-404-button-icon">🏠</span>
            Ir al Dashboard
          </button>
          <button className="error-404-secondary-button" onClick={handleGoBack}>
            <span className="error-404-button-icon">←</span>
            Volver Atrás
          </button>
        </div>

        
      </div>

      <div className="error-404-background">
        <div className="error-404-bg-shape error-404-shape-1"></div>
        <div className="error-404-bg-shape error-404-shape-2"></div>
        <div className="error-404-bg-shape error-404-shape-3"></div>
      </div>
    </div>
  )
}
