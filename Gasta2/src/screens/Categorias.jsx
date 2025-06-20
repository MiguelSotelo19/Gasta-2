import "./css/general.css"

export const Categorias = ({ espacioActual }) =>{
    return(
        <>
        <div>
            <div className="dashboard-header">
              <div className="dashboard-title">
                <h1>Categorías</h1>
                <p>Gestiona las categorías de gastos del espacio: { espacioActual }</p>
              </div>
              <button className="primary-button">
                <span>+</span>
                Nueva Categoría
              </button>
            </div>
            <div className="empty-state">
              <p>Sección de categorías en desarrollo</p>
            </div>
          </div>
        </>
    )
}