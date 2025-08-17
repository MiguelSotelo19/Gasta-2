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
import { Generico } from "./Generico"

export const Hub = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const urlUser = `${API_URL}/api/usuarios/all`;
    const urlEspaciosUser = `${API_URL}/api/usuarios-espacios/all?idUsuario=`;
    const urlCrearEspacio = `${API_URL}/api/espacios/crear`;
    const urlEspaciosUserAll = `${API_URL}/api/espacios/`;
    const urlUnirseEspacio = `${API_URL}/api/usuarios-espacios/unirse`;
    const urlEspacio = `${API_URL}/api/espacios/`;
    const urlEspaciosUserGlobal = `${API_URL}/api/usuarios-espacios/all-global`;
    const urlEliminarUsuario = `${API_URL}/api/usuarios-espacios/`;

    const navigate = useNavigate();
    const [seccionActiva, setSeccionActiva] = useState("resumen");
    const [espacioActual, setEspacioActual] = useState(null);
    const [nuevoEspacio, setNuevoEspacio] = useState("");
    const [modalNuevoEspacioAbierto, setModalNuevoEspacioAbierto] = useState(false);
    const [dropdownAbierto, setDropdownAbierto] = useState(false);
    const [modoModal, setModoModal] = useState("opciones");
    const [usuario, setUsuario] = useState("");
    const [espaciosDisponibles, setEspaciosDisponibles] = useState(0);
    const [espacios, setEspacios] = useState([]); //Espacios donde está el usuario
    const [todosEspacios, setTodosEspacios] = useState([]); //Todos los espacios
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [codigoEspacio, setCodigoEspacio] = useState("");
    
    // Estados adicionales para el componente Generico
    const [miembrosDelEspacio, setMiembrosDelEspacio] = useState([]);
    const [nombreAdmin, setNombreAdmin] = useState([]);
    const [idAdmin, setIdAdmin] = useState(0);
    const [idEspacio, setIdEspacio] = useState(0);
    const [codigo, setCodigo] = useState("");

    useEffect(() => {
        getUser();
        getEspacios();
        getTodosEspacios();
    }, []);

    useEffect(() => {
        if (espacioActual) {
            async function gets() {
                await getEspacio();
                await getMiembrosEspacio();
            }
            gets();
        }
    }, [espacioActual]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-dropdown-container')) {
                setDropdownAbierto(false);
            }
        };

        if (dropdownAbierto) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownAbierto]);

    const sidebar = [
        { id: "resumen", label: "Panel principal", icon: "🏠" },
        { id: "gastos", label: "Gastos", icon: "💰" },
        { id: "reportes", label: "Reportes", icon: "📊" },
        { id: "miembros", label: "Miembros", icon: "👥" },
        { id: "categorias", label: "Categorías", icon: "📋" }
    ];

    const getMiembrosEspacio = async () => {
        if (!espacioActual) return;
        
        try {
            const respuesta = await axiosInstance(urlEspaciosUserGlobal);
            const miembrosEspacio = respuesta.data.data.filter((espacio) => 
                espacio.nombreEspacio === espacioActual.nombreEspacio
            );
            const miembroAdmin = respuesta.data.data.find((espacio) => 
                espacio.rol === "Administrador" && espacio.nombreEspacio === espacioActual.nombreEspacio
            );

            setMiembrosDelEspacio(miembrosEspacio);
            setNombreAdmin(miembroAdmin);

            if (miembroAdmin) {
                const idAdminReal = await getId(miembroAdmin);
                setIdAdmin(idAdminReal);
            }
        } catch (e) {
            console.log("Error getMiembrosEspacio:", e);
            toast.error("Ha ocurrido un error. Intente de nuevo más tarde.");
        }
    };

    const getEspacio = async () => {
        if (!espacioActual) return;
        
        try {
            const respuesta = await axiosInstance(urlEspacio);
            const espacioSeleccionado = respuesta.data.data.find((u) => 
                u.nombre === espacioActual.nombreEspacio
            );
            if (espacioSeleccionado) {
                setCodigo(espacioSeleccionado.codigoinvitacion);
                setIdEspacio(espacioSeleccionado.id);
            }
        } catch (e) {
            console.log("Error getEspacio:", e);
            toast.error("Ha ocurrido un error. Intente de nuevo más tarde.");
        }
    };

    const getId = async (usuario) => {
        try {
            const respuesta = await axiosInstance(urlUser);
            const usuarioEncontrado = respuesta.data.data.find((u) => 
                u.nombreusuario === usuario.nombreUsuario
            );

            if (!usuarioEncontrado) {
                toast.error("No se ha encontrado el usuario.");
                return null;
            }

            return usuarioEncontrado.id;
        } catch (e) {
            console.log("Error getId:", e);
            toast.error("Ha ocurrido un error. Intente de nuevo más tarde.");
            return null;
        }
    };

    const actualizarEstadoEspacio = async () => {
        try {
            await getEspacios(); 
            
            await getEspacio(); 
            await getMiembrosEspacio();
            
            window.location.reload();
        } catch (error) {
            console.log("Error actualizarEstadoEspacio:", error);
            toast.error("Error al actualizar el estado del espacio");
        }
    };

    const renderContent = () => {
        if (!espacioActual) {
            return (
                <Generico desactivado={false} esAdmin={false}  espacioActual={null} miembrosDelEspacio={[]}
                    onUpdateSpace={actualizarEstadoEspacio} getMiembrosEspacio={getMiembrosEspacio} getEspacio={getEspacio}/>
            );
        }
        
        if (espacioActual && espacioActual.status === false && espacioActual.rol === "Invitado") {
            return (
                <Generico desactivado={true} esAdmin={false} espacioActual={espacioActual} miembrosDelEspacio={miembrosDelEspacio}
                    onUpdateSpace={actualizarEstadoEspacio} getMiembrosEspacio={getMiembrosEspacio} getEspacio={getEspacio} />
            );
        }
        
        if (espacioActual && espacioActual.status === false && espacioActual.rol === "Administrador") {
            return (
                <Generico desactivado={true}  esAdmin={true} espacioActual={{ ...espacioActual, idEspacio: idEspacio }}
                    miembrosDelEspacio={miembrosDelEspacio} onUpdateSpace={actualizarEstadoEspacio} getMiembrosEspacio={getMiembrosEspacio} getEspacio={getEspacio} />
            );
        }
        
        switch (seccionActiva) {
            case "resumen":
                return <Resumen espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />;
            case "gastos":
                return <Gastos espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />;
            case "reportes":
                return <Reportes espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />;
            case "miembros":
                return (
                    <Miembros espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} onSalirDelEspacio={onSalirDelEspacio} />
                );
            case "categorias":
                return <Categorias espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />;
            default:
                return <Resumen espacioActual={espacioActual} nombreEspacio={espacioActual.nombreEspacio} />;
        }
    };

    const getUser = async () => {
        try {
            const respuesta = await axiosInstance(urlUser);
            const usuarioEncontrado = respuesta.data.data.find((u) => u.id === parseInt(userId));

            setUsuario(usuarioEncontrado);
            setEspaciosDisponibles(usuarioEncontrado.espaciosdisponibles);
            setNombre(usuarioEncontrado.nombreusuario);
            setCorreo(usuarioEncontrado.correo);
        } catch (e) {
            console.log("error getUser: ", e);
        }
    };

    const getEspacios = async () => {
        try {
            const url = urlEspaciosUser + userId;
            const respuesta = await axiosInstance(url);
            const espaciosData = respuesta.data.data.filter((espacio) => espacio.nombreEspacio);
            console.log("Espacios data:", respuesta.data.data);
            setEspacios(espaciosData);
            
            if (espaciosData.length === 0) {
                setEspacioActual(null);
                return;
            }
            
            if (!espacioActual || !espaciosData.some(e => e.id === espacioActual.id)) {
                setEspacioActual(espaciosData[0]);
            }
        } catch (e) {
            console.log("errorGetEspacios: ", e);
        }
    };

    const getTodosEspacios = async () => {
        try {
            const respuesta = await axiosInstance(urlEspaciosUserAll);
            setTodosEspacios(respuesta.data.data);
        } catch (e) {
            console.log("errorGetEspacios: ", e);
        }
    };

    const onSalirDelEspacio = async () => {
        toast.success(`Has salido del espacio.`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await getEspacios();
        setSeccionActiva("resumen");
    };

    const agregarEspacio = async () => {
        const nombreNormalizado = nuevoEspacio.trim().toLowerCase();
        if (!nombreNormalizado) {
            toast.error("El nombre del espacio no puede estar vacío.");
            return;
        }

        const espaciosUnicos = new Set(
            espacios.filter((espacio) => espacio.nombreEspacio)
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
            const parametros = {
                nombre: nombreNormalizado,
                idUsuario: parseInt(userId)
            };
            const response = await axiosInstance.post(urlCrearEspacio, parametros);

            if (response) {
                toast.success("Espacio agregado correctamente.");
                setNuevoEspacio("");
                setModalNuevoEspacioAbierto(false);
                getEspacios();
                getUser();
                setSeccionActiva("miembros");
            }
        } catch (e) {
            if (e.response?.status === 403) {
                toast.error("Solo se permiten crear 5 espacios únicos.");
                setNuevoEspacio("");
                setModalNuevoEspacioAbierto(false);
                console.log(e);
            } else {
                toast.error("Hubo un error al crear el espacio.");
                setNuevoEspacio("");
                setModalNuevoEspacioAbierto(false);
                console.error("Error desconocido:", e);
            }
        }
    };

    const unirseAEspacio = async (codigoEspacio) => {
        try {
            const idUsuario = parseInt(localStorage.getItem("userId"));

            if (!idUsuario || !codigoEspacio) {
                toast.error("Faltan datos necesarios");
                return;
            }

            if (!/^\d{5}$/.test(codigoEspacio)) {
                toast.error("El código debe tener 5 dígitos");
                return;
            }

            const espacioCoincidente = todosEspacios.find((espacio) => 
                espacio.codigoinvitacion === codigoEspacio
            );

            if (!espacioCoincidente) {
                toast.error("El código no corresponde a ningún espacio existente");
                return;
            }

            const yaUnido = espacios.some((espacio) => 
                espacio.nombreEspacio === espacioCoincidente.nombre
            );

            if (yaUnido) {
                toast.error("Ya estás dentro de este espacio");
                return;
            }

            const parametros = {
                idUsuario,
                codigoEspacio
            };

            const response = await axiosInstance.post(urlUnirseEspacio, parametros);
            toast.success("Te has unido al espacio correctamente");
            await getEspacios();
            setModalNuevoEspacioAbierto(false);
            setModoModal("opciones");
        } catch (error) {
            console.error("Error al unirse:", error);
            if (error.response?.status === 409) {
                toast.error("Ya estás dentro de este espacio");
            } else {
                toast.error("No fue posible unirse al espacio");
            }
        }
    };

    
    const cerrarSesion = async () => {
        try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userId");
            navigate("/");
        } catch (error) {
            console.log(error);
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
                    <button className="icon-button" onClick={() => setDropdownAbierto(!dropdownAbierto)}>
                        ⚙️
                    </button>
                </div>
            </div>

            <div className="main-content">
                <header className="top-bar">
                    <div className="search-container">
                        <span className="search-icon"></span>
                    </div>
                    <div className="top-bar-actions">
                        {/*<button className="icon-button">🔔</button>*/}
                        <div className="user-dropdown-container" style={{ position: 'relative' }}>
                            <button className="icon-button pe-5" onClick={() => setDropdownAbierto(!dropdownAbierto)}>
                                👤 {userName}
                            </button>
                            {dropdownAbierto && (
                                <div className="user-dropdown" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: '0',
                                    backgroundColor: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                    zIndex: 1000,
                                    minWidth: '150px'
                                }}>
                                    <button 
                                        onClick={cerrarSesion}
                                        style={{
                                            width: '100%',
                                            padding: '10px 15px',
                                            border: 'none',
                                            backgroundColor: 'transparent',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            color: '#dc3545'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
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
                unirseAEspacio={unirseAEspacio}
                codigoEspacio={codigoEspacio}
                setCodigoEspacio={setCodigoEspacio}
            />
        </div>
    )
}

export default Hub;