import { useNavigate } from "react-router-dom";
import "../css/errores.css"

export const E401 = () => {
  const token = localStorage.getItem("accessToken")
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate();
  const handleGoBack = () => {
    window.history.back()
  }

  const handleGoHome = () => {
    if (userId && token){
      navigate("/Hub")
    } else {
      navigate("/")
    }
    
  }

  const handleLogin = () => {
    navigate("/")
  }

  return (
    <div className="error-401-container">
      <div className="error-401-content">
        <div className="error-401-icon-section">
          <div className="error-401-icon">🔒</div>
          <div className="error-401-code">401</div>
        </div>
        
        <div className="error-401-text-section">
          <h1 className="error-401-title">Acceso No Autorizado</h1>
          <p className="error-401-description">
            No tienes permisos para acceder a esta página. Por favor, inicia sesión con una cuenta válida.
          </p>
          <div className="error-401-details">
            <p className="error-401-detail-text">
              Si crees que esto es un error, contacta al administrador del espacio.
            </p>
          </div>
        </div>

        <div className="error-401-actions">
          {!token && (
            <button className="error-401-primary-button" onClick={handleLogin}>
            <span className="error-401-button-icon">🔑</span>
            Iniciar Sesión
          </button>
          )}
          <button className="error-401-secondary-button" onClick={handleGoBack}>
            <span className="error-401-button-icon">←</span>
            Volver Atrás
          </button>
          <button className="error-401-tertiary-button" onClick={handleGoHome}>
            <span className="error-401-button-icon">🏠</span>
            Ir al Inicio
          </button>
        </div>

        <div className="error-401-help">
          <div className="error-401-help-title">¿Necesitas ayuda?</div>
          <div className="error-401-help-links">
            <span className="error-401-help-separator">•</span>
            <a href="/forgot-password" className="error-401-help-link">Olvidé mi contraseña</a>
            <span className="error-401-help-separator">•</span>
            <a href="/register" className="error-401-help-link">Crear Cuenta</a>
          </div>
        </div>
      </div>

      <div className="error-401-background">
        <div className="error-401-bg-shape error-401-shape-1"></div>
        <div className="error-401-bg-shape error-401-shape-2"></div>
        <div className="error-401-bg-shape error-401-shape-3"></div>
      </div>
    </div>
  )
}
