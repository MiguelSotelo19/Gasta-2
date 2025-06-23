import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { useState } from "react"
import { Gastos } from "./Gastos"
import { Reportes } from "./Reportes"
import { Miembros } from "./Miembros"
import { Categorias } from "./Categorias"
import Resumen from "./Resumen"
import "./css/layout.css"
import "./css/general.css"

export const Hub = () => {
    const [seccionActiva, setSeccionActiva] = useState("resumen")
    const [espacioActual, setEspacioActual] = useState("Casa Principal")

    const sidebar = [
        { id: "resumen", label: "Panel principal", icon: "🏠" },
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
            case "resumen":
                return <Resumen espacioActual={espacioActual} />
            case "gastos":
                return <Gastos espacioActual={espacioActual} />
            case "reportes":
                return <Reportes espacioActual={espacioActual} />
            case "miembros":
                return <Miembros espacioActual={espacioActual} />
            case "categorias":
                return <Categorias espacioActual={espacioActual} />
            default:
                return <Resumen espacioActual={espacioActual} />
        }
    }

    const [nuevoEspacio, setNuevoEspacio] = useState("")
    const [modalNuevoEspacioAbierto, setModalNuevoEspacioAbierto] = useState(false)

    const agregarEspacio = () => {
        if (!nuevoEspacio.trim()) {
            toast.error("El nombre del espacio no puede estar vacío.")
            return
        }

        const nombreExiste = spaces.some(space => space.name.toLowerCase() === nuevoEspacio.trim().toLowerCase())

        if (nombreExiste) {
            toast.error("Ese nombre ya está en uso.")
            return
        }

        toast.success("Espacio agregado correctamente.")
        setNuevoEspacio("")
        setModalNuevoEspacioAbierto(false)
    }

    return (
        <div className="app-container">
            <ToastContainer position="top-center" autoClose={3000} />

            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon">$</div>
                        <div className="logo-text ">
                            <h2>Gasta2</h2>
                            <p>Gestión Familiar</p>
                        </div>
                    </div>
                </div>

                <div className="space-selector">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <label className="mb-0">Espacio Actual</label>
                        <button type="button" className="btn btn-success btn-sm" style={{ padding: "0.25rem 0.75rem" }}
                            onClick={() => setModalNuevoEspacioAbierto(true)} >
                            Agregar
                        </button>
                    </div>
                    <select className="space-select d-felx pe-3" value={espacioActual} onChange={(e) => setEspacioActual(e.target.value)}>
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
                                <button  className={`nav-button ${seccionActiva === item.id ? "active" : ""}`}
                                    onClick={() => setSeccionActiva(item.id)}>
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

            {modalNuevoEspacioAbierto && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: "400px" }}>
                            <div className="modal-content">
                                <div className="modal-header d-flex justify-content-between">
                                    <h5 className="modal-title">Agregar nuevo espacio</h5>
                                    <button type="button" className="close" aria-label="Close" onClick={() => setModalNuevoEspacioAbierto(false)}
                                        style={{ backgroundColor: "transparent", border: "none", fontSize: "1.25rem", color: "black", cursor: "pointer" }}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <input type="text" className="form-control" placeholder="Nombre del nuevo espacio"
                                        value={nuevoEspacio} onChange={(e) => setNuevoEspacio(e.target.value)}/>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalNuevoEspacioAbierto(false)}>
                                        Cancelar
                                    </button>
                                    <button type="button" className="btn btn-success" onClick={agregarEspacio}>
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

        </div>
    )
}
