import { useState } from "react"
import { Gastos } from "./Gastos"
import { Reportes } from "./Reportes"
import { Miembros } from "./Miembros"
import { Categorias } from "./Categorias"
import "./css/layout.css"
import "./css/general.css"

import Espacios from "./Espacios"

export const Hub = () => {
  const [seccionActiva, setSeccionActiva] = useState("dashboard")
  const [espacioActual, setEspacioActual] = useState("Casa Principal")

  const sidebar = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "gastos", label: "Gastos", icon: "💰" },
    { id: "reportes", label: "Reportes", icon: "📊" },
    { id: "miembros", label: "Miembros", icon: "👥" },
    { id: "categorias", label: "Categorías", icon: "📋" }
  ]

  const spaces = [
    { name: "Casa Principal", code: "CP2024", miembros: 4, isAdmin: true },
    { name: "Departamento", code: "DEPT01", miembros: 2, isAdmin: false },
    { name: "Casa de Playa", code: "PLAYA3", miembros: 6, isAdmin: true },
  ]

  const renderContent = () => {
    switch (seccionActiva) {
      case "dashboard":
        return <Espacios espacioActual={espacioActual} />
      case "gastos":
        return <Gastos espacioActual={espacioActual} />
      case "reportes":
        return <Reportes espacioActual={espacioActual} />
      case "miembros":
        return <Miembros espacioActual={espacioActual} />
      case "categorias":
        return <Categorias espacioActual={espacioActual} />
      default:
        return <Dashboard espacioActual={espacioActual} />
    }
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">$</div>
            <div className="logo-text">
              <h2>Gasta2</h2>
              <p>Gestión Familiar</p>
            </div>
          </div>
        </div>

        <div className="space-selector">
          <label>Espacio Actual</label>
          <select className="space-select" value={espacioActual} onChange={(e) => setEspacioActual(e.target.value)}>
            {spaces.map((space, index) => (
              <option key={index} value={space.name}>
                {space.name} {space.isAdmin ? "(Admin)" : ""}
              </option>
            ))}
          </select>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {sidebar.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  onClick={() => setSeccionActiva(item.id)}
                  className={`nav-button ${seccionActiva === item.id ? "active" : ""}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="user-profile">
          <div className="user-avatar">MG</div>
          <div className="user-info">
            <h4>María González</h4>
            <p>Administrador</p>
          </div>
          <button className="icon-button">⚙️</button>
        </div>
      </div>

      <div className="main-content">
        <header className="top-bar">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Buscar gastos, miembros..." className="search-input" />
          </div>
          <div className="top-bar-actions">
            <button className="icon-button">🔔</button>
            <button className="icon-button">👤</button>
          </div>
        </header>

        <main className="content-area">{renderContent()}</main>
      </div>
    </div>
  )
}
