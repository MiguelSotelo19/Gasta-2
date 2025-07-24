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
import "../components/css/modal-espacios.css"
import axiosInstance from "../services/axiosInstance"
import { Button } from "../components/ui/button"
import ModalEspacios from "../components/modalEspacios"
import { useNavigate } from "react-router-dom"

export const Hub = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const userId = localStorage.getItem("userId");
    const urlUser = `${API_URL}/api/usuarios/all`
    const urlEspaciosUser = `${API_URL}/api/usuarios-espacios/all?idUsuario=`
    const urlCrearEspacio = `${API_URL}/api/espacios/crear`

    const navigate = useNavigate();
    const [seccionActiva, setSeccionActiva] = useState("resumen")
    const [espacioActual, setEspacioActual] = useState(null)
    const [nuevoEspacio, setNuevoEspacio] = useState("")
    const [modalNuevoEspacioAbierto, setModalNuevoEspacioAbierto] = useState(false)
    const [modalConfiguracionAbierto, setModalConfiguracionAbierto] = useState(false)
    const [modoModal, setModoModal] = useState("opciones");
    const [usuario, setUsuario] = useState("")
    const [espaciosDisponibles, setEspaciosDisponibles] = useState(0);
    const [espacios, setEspacios] = useState([])
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")

    useEffect(() => {
        console.log("userId:", userId);
        console.log("token :", localStorage.getItem("accessToken"))
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
                return <Gastos espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />
            case "reportes":
                return <Reportes espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />
            case "miembros":
                return <Miembros espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />
            case "categorias":
                return <Categorias espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />
            default:
                return <Resumen espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />
        }
    }

    const getUser = async () => {
        try {
            const respuesta = await axiosInstance(urlUser)

            const usuarioEncontrado = respuesta.data.data.find((u) => u.id === parseInt(userId));

            setUsuario(usuarioEncontrado);
            setEspaciosDisponibles(usuarioEncontrado.espaciosdisponibles)
            setNombre(usuarioEncontrado.nombreusuario)
            setCorreo(usuarioEncontrado.correo)
            console.log("usuario", usuarioEncontrado)
        } catch (e) {
            console.log("error getUser: ", e)
        }
    };

    const getEspacios = async () => {
        try {
            const url = urlEspaciosUser + userId
            const respuesta = await axiosInstance(url)
            const espaciosData = respuesta.data.data;
            setEspacios(espaciosData);
            console.log("espaciosdata: ", espaciosData)
            console.log("getespacios: ", respuesta.data.data)
            if (!espacioActual && espaciosData.length > 0) {
                setEspacioActual(espaciosData[0]);
            }
            console.log("espacioActual: ", espacioActual)
        } catch (e) {
            console.log("errorGetEspacios: ", e)
        }
    }

    const agregarEspacio = async () => {
        console.log("userId:", userId);
        const nombreNormalizado = nuevoEspacio.trim().toLowerCase();
        if (!nombreNormalizado) {
            toast.error("El nombre del espacio no puede estar vacío.");
            return;
        }

        const espaciosUnicos = new Set(
            espacios
                .filter((espacio) => espacio.nombreEspacio) // filtra nulos o undefined
                .map((espacio) => espacio.nombreEspacio.toLowerCase())
        );

        if (espaciosUnicos.has(nombreNormalizado)) {
            toast.error("Ya tienes un espacio con ese nombre");
            return;
        }

        if (espaciosDisponibles <= 0) {
            toast.error("Solo puedes crear 5 espacios únicos.");
            return;
        }
        try {
            console.log("urlCrearEspacios: ", urlCrearEspacio)
            const parametros = {
                nombre: nombreNormalizado,
                idUsuario: parseInt(userId)
            }
            console.log("parametros: ", parametros)
            console.log("token dentro de la peticion: ", localStorage.getItem("accessToken"))
            const response = await axiosInstance.post(urlCrearEspacio, parametros);

            console.log("response: ", response)
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
                console.log(e)
            } else {
                toast.error("Hubo un error al crear el espacio.");
                setNuevoEspacio("");
                setModalNuevoEspacioAbierto(false);
                console.error("Error desconocido:", e);
            }
        }

    };

    const cerrarSesion = async () => {
        try {

            localStorage.removeItem("accessToken");
            localStorage.removeItem("userId");

            navigate("/");

        } catch (error) {
            console.log(error)
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
                        <button type="button" className="primary-button" style={{ padding: "0.25rem 0.75rem" }}
                            onClick={() => {
                                setModalNuevoEspacioAbierto(true);
                                setModoModal("opciones");
                            }}
                        >
                            Agregar
                        </button>

                    </div>
                    <select className="space-select d-flex pe-3" value={espacioActual?.nombreEspacio || ""}
                        onChange={(e) => {
                            const seleccionado = espacios.find(esp => esp.nombreEspacio === e.target.value);
                            if (seleccionado) setEspacioActual(seleccionado);
                        }}
                    >
                        {espacios.length === 0 ? (
                            <option disabled>No tienes espacios. ¡Únete o crea alguno!</option>
                        ) : (
                            espacios.map((espacio, index) => (
                                <option className="capitalize" key={index} value={espacio.nombreEspacio}>
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
                        <button className="icon-button" onClick={() => setModalConfiguracionAbierto(true)} >
                            👤
                        </button>
                    </div>
                </header>

                <main className="content-area">{renderContent()}</main>
            </div>

            <ModalEspacios
                modalNuevoEspacioAbierto={modalNuevoEspacioAbierto}
                setModalNuevoEspacioAbierto={setModalNuevoEspacioAbierto}
                modoModal={modoModal}
                setModoModal={setModoModal}
                nuevoEspacio={nuevoEspacio}
                setNuevoEspacio={setNuevoEspacio}
                agregarEspacio={agregarEspacio}
            />


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
                                    <button type="button" className="btn btn-danger" onClick={cerrarSesion}
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