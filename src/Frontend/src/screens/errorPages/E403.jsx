import "../css/errores.css"

export const E403 = () => {
  const handleGoBack = () => {
    window.history.back()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }


  return (
    <div className="error-403-container">
      <div className="error-403-content">
        <div className="error-403-icon-section">
          <div className="error-403-icon">🚫</div>
          <div className="error-403-code">403</div>
        </div>
        
        <div className="error-403-text-section">
          <h1 className="error-403-title">Acceso Prohibido</h1>
          <p className="error-403-description">
            No tienes los permisos necesarios para acceder a este recurso. Solo los administradores pueden realizar esta acción.
          </p>
          <div className="error-403-details">
            <p className="error-403-detail-text">
              Si necesitas acceso a esta función, solicita permisos de administrador al propietario del espacio.
            </p>
          </div>
        </div>

        <div className="error-403-actions">
          <button className="error-403-secondary-button" onClick={handleGoBack}>
            <span className="error-403-button-icon">←</span>
            Volver Atrás
          </button>
          <button className="error-403-tertiary-button" onClick={handleGoHome}>
            <span className="error-403-button-icon">🏠</span>
            Ir al Dashboard
          </button>
        </div>

        <div className="error-403-help">
          <div className="error-403-help-title">Información sobre permisos</div>
          <div className="error-403-help-content">
            <div className="error-403-permission-item">
              <span className="error-403-permission-icon">✅</span>
              <span className="error-403-permission-text">Puedes ver gastos y reportes</span>
            </div>
            <div className="error-403-permission-item">
              <span className="error-403-permission-icon">✅</span>
              <span className="error-403-permission-text">Puedes agregar tus propios gastos</span>
            </div>
            <div className="error-403-permission-item">
              <span className="error-403-permission-icon">❌</span>
              <span className="error-403-permission-text">No puedes modificar gastos de otros</span>
            </div>
            <div className="error-403-permission-item">
              <span className="error-403-permission-icon">❌</span>
              <span className="error-403-permission-text">No puedes gestionar miembros</span>
            </div>
          </div>
        </div>
      </div>

      <div className="error-403-background">
        <div className="error-403-bg-shape error-403-shape-1"></div>
        <div className="error-403-bg-shape error-403-shape-2"></div>
        <div className="error-403-bg-shape error-403-shape-3"></div>
      </div>
    </div>
  )
}
