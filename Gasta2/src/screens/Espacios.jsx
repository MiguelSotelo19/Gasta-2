import { useState } from "react"
import "./css/espacio.css"
import "./css/general.css"

export default function Espacios({ espacioActual }) {
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
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Resumen de gastos del espacio: {espacioActual}</p>
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
  )
}
