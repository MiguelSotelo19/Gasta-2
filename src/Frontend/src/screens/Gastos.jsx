import "./css/general.css"

export const Gastos = ({ espacioActual, nombreEspacio }) =>{
    return(
        <>
        <div>
            <div className="dashboard-header">
              <div className="dashboard-title">
                <h1>Gastos</h1>
                <p>Administra todos los gastos del espacio: { nombreEspacio }</p>
              </div>
              <button className="primary-button">
                <span>+</span>
                Nuevo Gasto
              </button>
            </div>
            <div className="empty-state">
              <p>Sección de gastos en desarrollo</p>
            </div>
          </div>
        </>
    )
}