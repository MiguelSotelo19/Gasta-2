import "./css/general.css"

export const Reportes = ({ espacioActual, nombreEspacio }) =>{
    return(
        <>
        <div>
            <div className="dashboard-header">
              <div className="dashboard-title">
                <h1>Reportes</h1>
                <p>Visualiza reportes y estadísticas del espacio: { nombreEspacio }</p>
              </div>
              <button className="primary-button">
                <span>📄</span>
                Exportar Reporte
              </button>
            </div>
            <div className="empty-state">
              <p>Sección de reportes en desarrollo</p>
            </div>
          </div>
        </>
    )
}