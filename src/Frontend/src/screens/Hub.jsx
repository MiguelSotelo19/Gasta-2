import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { use, useEffect, useState } from "react"
import { Gastos } from "./Gastos"
import { Reportes } from "./Reportes"
import { Miembros } from "./Miembros"
import { Categorias } from "./Categorias"
import Resumen from "./Resumen"
import "./css/layout.css"
import "./css/general.css"
import axiosInstance from "../services/axiosInstance"
import { Button } from "../components/ui/button"

export const Hub = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const userId = localStorage.getItem("userId");
    const urlUser = `${API_URL}/api/usuarios/all`
    const urlEspaciosUser = `${API_URL}/api/usuarios-espacios/all?idUsuario=`
    const urlCrearEspacio = `${API_URL}/api/espacios/crear`
    const [seccionActiva, setSeccionActiva] = useState("resumen")
    const [espacioActual, setEspacioActual] = useState(null)

    useEffect(() => {
        getUser();
        getEspacios();
    }, []);

    const sidebar = [
        { id: "resumen", label: "Panel principal", icon: "🏠" },
        { id: "gastos", label: "Gastos", icon: "💰" },
        { id: "reportes", label: "Reportes", icon: "📊" },
        { id: "miembros", label: "Miembros", icon: "👥" },
        { id: "categorias", label: "Categorías", icon: "📋" }
    ]

    const renderContent = () => {
        if (!espacioActual) return <div className="p-4">Cargando...</div>; // Evita fallos si aún no está definido

        switch (seccionActiva) {
            case "resumen":
                return <Resumen espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />
            case "gastos":
                return <Gastos espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio}/>
            case "reportes":
                return <Reportes espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio}/>
            case "miembros":
                return <Miembros espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio}/>
            case "categorias":
                return <Categorias espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio}/>
            default:
                return <Resumen espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio}/>
        }
    }


    const [nuevoEspacio, setNuevoEspacio] = useState("")
    const [modalNuevoEspacioAbierto, setModalNuevoEspacioAbierto] = useState(false)
    const [modalConfiguracionAbierto, setModalConfiguracionAbierto] = useState(false)
    const [usuario, setUsuario] = useState("")
    const [espaciosDisponibles, setEspaciosDisponibles] = useState(0);
    const [espacios, setEspacios] = useState([])
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")

    const getUser = async () => {
        try {
            const respuesta = await axiosInstance(urlUser)

            const usuarioEncontrado = respuesta.data.data.find((u) => u.id === parseInt(userId));

            setUsuario(usuarioEncontrado);
            //setEspaciosDisponibles(usuarioEncontrado.espaciosdisponibles)
            setNombre(usuarioEncontrado.nombreusuario)
            setCorreo(usuarioEncontrado.correo)
            console.log("usuario", usuarioEncontrado)
        } catch (e) {
            console.log(e)
        }
    };

    const getEspacios = async () => {
        try {
            const url = urlEspaciosUser + userId
            const respuesta = await axiosInstance(url)
            const espaciosData = respuesta.data.data;
            setEspacios(espaciosData);
            console.log(respuesta.data.data)
            if (!espacioActual && espaciosData.length > 0) {
                setEspacioActual(espaciosData[0]);
            }
            console.log(espacioActual)
        } catch (e) {
            console.log(e)
        }
    }


    const agregarEspacio = async () => {
        const nombreNormalizado = nuevoEspacio.trim().toLowerCase();
        if (!nombreNormalizado) {
            toast.error("El nombre del espacio no puede estar vacío.");
            return;
        }

        const espaciosUnicos = new Set(espacios.map(espacios => espacios.nombreEspacio.toLowerCase()));
        if (espaciosUnicos.has(nombreNormalizado)) {
            toast.error("Ya tienes un espacio con ese nombre");
            return;
        }

        if (espacios.size >= 5) {
            toast.error("Solo puedes crear 5 espacios únicos.");
            return;
        }
        try {
            console.log(urlCrearEspacio)
            const parametros = {
                nombre: nuevoEspacio,
                idUsuario: parseInt(userId)
            }
            console.log(parametros)
            const response = await axiosInstance.post(urlCrearEspacio, parametros);

            console.log(response)
            if (response) {
                toast.success("Espacio agregado correctamente.");
                setNuevoEspacio("");
                setModalNuevoEspacioAbierto(false);
                getEspacios();
                getUser();
                setSeccionActiva("miembros")
            }

        } catch (e) {
        if (e.response?.status === 403) {
            toast.error("Solo se permiten crear 5 espacios únicos.");
            setNuevoEspacio("");
            setModalNuevoEspacioAbierto(false);
        } else {
            toast.error("Hubo un error al crear el espacio.");
            setNuevoEspacio("");
            setModalNuevoEspacioAbierto(false);
            console.error("Error desconocido:", e);
        }
    }

    };


    return (
        <div className="app-container">
            <ToastContainer position="top-center" autoClose={3000} />

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
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <label className="mb-0">Espacio Actual</label>
                        <button type="button" className="btn btn-success btn-sm" style={{ padding: "0.25rem 0.75rem" }}
                            onClick={() => setModalNuevoEspacioAbierto(true)}
                        >
                            Agregar
                        </button>

                    </div>
                    <select
                        className="space-select d-flex pe-3"
                        value={espacioActual?.nombreEspacio || ""}
                        onChange={(e) => {
                            const seleccionado = espacios.find(esp => esp.nombreEspacio === e.target.value);
                            if (seleccionado) setEspacioActual(seleccionado);
                        }}
                    >
                        {espacios.length === 0 ? (
                            <option disabled>No tienes espacios. ¡Únete o crea alguno!</option>
                        ) : (
                            espacios.map((espacio, index) => (
                                <option key={index} value={espacio.nombreEspacio}>
                                    {espacio.nombreEspacio} {espacio.rol === "Administrador" ? "(Admin)" : ""}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {sidebar.map((item) => (
                            <li key={item.id} className="nav-item">
                                <button
                                    className={`nav-button ${seccionActiva === item.id ? "active" : ""}`}
                                    onClick={() => setSeccionActiva(item.id)}>
                                    <span className="nav-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="user-profile ps-5">
                    <div className="user-info mt-1">
                        <h5>👤 {nombre}</h5>
                    </div>
                    <button className="icon-button" onClick={() => setModalConfiguracionAbierto(true)}>
                        ⚙️
                    </button>
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
                        <button className="icon-button" onClick={''} >
                            👤
                        </button>
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
                                    <input type="text" className="form-control" placeholder="Nombre del nuevo espacio" value={nuevoEspacio}
                                        onChange={(e) => setNuevoEspacio(e.target.value)}
                                    />
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

            {modalConfiguracionAbierto && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header d-flex justify-content-between">
                                    <h5 className="modal-title">Configuración de cuenta</h5>
                                    <button type="button" className="close" aria-label="Close" onClick={() => setModalConfiguracionAbierto(false)}
                                        style={{ backgroundColor: "transparent", border: "none", fontSize: "1.25rem", color: "black", cursor: "pointer" }}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" value={''} readOnly />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Correo electrónico</label>
                                        <input type="email" className="form-control" value={''} readOnly />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">NIP</label>
                                        <input type="text" className="form-control" value={''} readOnly />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalConfiguracionAbierto(false)}>
                                        Cerrar
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => {

                                    }}
                                    >
                                        Cerrar sesión
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

export default Hub;