import { useState } from "react"
import "./css/espacio.css"
import "./css/general.css"

export default function Resumen({ espacioActual, nombreEspacio }) {
  const gastosRecientes = [
    { id: 1, description: "Supermercado Soriana", amount: 1250, category: "Comida", user: "María", date: "2024-01-15" },
    { id: 2, description: "Recibo de luz", amount: 850, category: "Energéticas", user: "Juan", date: "2024-01-14" },
    {
      id: 3,
      description: "Productos de limpieza",
      amount: 320,
      category: "Personales",
      user: "Ana",
      date: "2024-01-13",
    },
    { id: 4, description: "Gas LP", amount: 450, category: "Energéticas", user: "Carlos", date: "2024-01-12" },
  ]

  const categorias = [
    { name: "Comida", type: "food", expenses: 12, total: 4500 },
    { name: "Energéticas", type: "energy", expenses: 8, total: 2300 },
    { name: "Personales", type: "personal", expenses: 15, total: 1800 },
    { name: "Transporte", type: "transport", expenses: 6, total: 1200 },
  ]

  return (
    <>
      <div>
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Panel principal</h1>
            <p>Resumen de gastos del espacio: {nombreEspacio}</p>
          </div>
          <button className="primary-button">
            <span>+</span>
            Agregar Gasto
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card green">
            <div className="stat-header">Total del Mes</div>
            <div className="stat-value">$8,800</div>
            <div className="stat-change positive">
              <span>📈</span>
              +12% vs mes anterior
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-header">Mi Contribución</div>
            <div className="stat-value">$2,640</div>
            <div className="stat-change neutral">30% del total</div>
          </div>

          <div className="stat-card purple">
            <div className="stat-header">Gastos Registrados</div>
            <div className="stat-value">41</div>
            <div className="stat-change neutral">Este mes</div>
          </div>

          <div className="stat-card orange">
            <div className="stat-header">Miembros Activos</div>
            <div className="stat-value">4</div>
            <div className="stat-change neutral">En este espacio</div>
          </div>
        </div>

        <div className="content-grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <span>📊</span>
                Gastos por Categoría
              </h3>
            </div>
            <div className="card-content">
              {categorias.map((category, index) => (
                <div key={index} className="category-item">
                  <div className="category-info">
                    <span className={`category-badge ${category.type}`}>{category.name}</span>
                    <span className="category-count">{category.expenses} gastos</span>
                  </div>
                  <span className="category-amount">${category.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <span>📅</span>
                Gastos Recientes
              </h3>
            </div>
            <div className="card-content">
              {gastosRecientes.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <h4>{expense.description}</h4>
                    <div className="expense-meta">
                      {expense.user} • {expense.date}
                    </div>
                  </div>
                  <div className="expense-amount">
                    <div className="amount">${expense.amount}</div>
                    <span className="expense-category">{expense.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
              {/*<div
        className={`modal fade ${modalActIsOpen && step === 2 ? "show d-block" : ""}`}
        id="modalAdicionales"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalAdicionalesLabel"
        aria-hidden="true"
        style={{ width: "95%" }}
      >
        <div className="modal-dialog modal-md modal-dialog-centered" role="document" style={{ maxWidth: "40vw", maxHeight: "10vh" }}>
          <div className="modal-content">
            <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 className="modal-title" id="modalAdicionalesLabel">Datos adicionales</h5>
              <button type="button" className="close" aria-label="Close" onClick={closeModalAct}
                style={{ backgroundColor: "transparent", border: "none", fontSize: "1.25rem", color: "black", cursor: "pointer" }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: "40vh", overflow: "hidden" }}>
              <div className="container">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label>Sexo:</label>
                      <select className="form-select" value={sexo} onChange={(e) => setSexo(e.target.value)}>
                        <option value="">Selecciona tu sexo</option>
                        <option value="Macho">Macho</option>
                        <option value="Hembra">Hembra</option>
                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label>Preferencia:</label>
                      <input type="text" className="form-control" value={preferencias} onChange={(e) => setPreferencias(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label>Raza:</label>
                      <input type="text" className="form-control" value={raza} onChange={(e) => setRaza(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label>Ubicación:</label>
                      <input type="text" className="form-control" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label>Edad:</label>
                      <input type="number" className="form-control" value={edad} onChange={(e) => setEdad(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label>Fecha de nacimiento:</label>
                      <input type="date" className="form-control" value={fechaNac} onChange={(e) => setFechaNac(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={() => setStep(3)}>Cambiar contraseña</button>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Anterior</button>
              <button type="button" className="btn btn-success" onClick={actualizarMascota}>Actualizar</button>
            </div>
          </div>
        </div>
      </div>
      {modalActIsOpen && step === 2 && <div className="modal-backdrop fade show"></div>}
*/}
      
    </>
  )
}
