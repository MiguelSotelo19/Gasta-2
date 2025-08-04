import "./css/miembros.css"
import "./css/general.css"
import axiosInstance from "../services/axiosInstance";
import { useEffect, useState } from "react";
import ModalMiembros from "../components/modalMiembros";
import { ToastContainer, toast } from "react-toastify"
import ModalEliminarUsuario from "../components/modalEliminarUsuario";

export const Miembros = ({ espacioActual, nombreEspacio, onSalirDelEspacio }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const urlEspacio = `${API_URL}/api/espacios/`
    const urlEspaciosUser = `${API_URL}/api/usuarios-espacios/all-global`
    const urlUser = `${API_URL}/api/usuarios/all`
    const urlEliminarUsuario = `${API_URL}/api/usuarios-espacios/`
    const userId = parseInt(localStorage.getItem("userId"));
    const [codigo, setCodigo] = useState("")
    const [nombre, setNombre] = useState("")
    const [mostrarCodigo, setMostrarCodigo] = useState(false);
    const [miembrosDelEspacio, setMiembrosDelEspacio] = useState([])
    const [nombreAdmin, setNombreAdmin] = useState([])
    const [idAdmin, setIdAdmin] = useState(0)
    const [idEspacio, setIdEspacio] = useState(0)
    const [idUsuarioAEliminar, setIdUsuarioAEliminar] = useState(0)

    useEffect(() => {
        if (espacioActual) {
            setMostrarCodigo(false)
            async function gets() {
                await getEspacio();
                await getMiembrosEspacio();
            }
            gets();
        }
    }, [espacioActual]);

    const getMiembrosEspacio = async () => {
        try {
            const respuesta = await axiosInstance(urlEspaciosUser);

            const miembrosEspacio = respuesta.data.data.filter((espacio) => espacio.nombreEspacio === espacioActual.nombreEspacio);
            const miembroAdmin = respuesta.data.data.find((espacio) => espacio.rol === "Administrador" && espacio.nombreEspacio === espacioActual.nombreEspacio);

            setMiembrosDelEspacio(miembrosEspacio);
            setNombreAdmin(miembroAdmin);

            if (miembroAdmin) {
                const idAdminReal = await getId(miembroAdmin);
                setIdAdmin(idAdminReal);
            }

        } catch (e) {
            toast.error("Ha ocurrido un error. Intente de nuevo mas tarde.");
        }
    }

    const getEspacio = async () => {
        try {
            const respuesta = await axiosInstance(urlEspacio)
            const espacioSeleccionado = respuesta.data.data.find((u) => u.nombre === espacioActual.nombreEspacio);
            setCodigo(espacioSeleccionado.codigoinvitacion)
            setNombre(espacioActual.nombreUsuario)
            setIdEspacio(espacioSeleccionado.id)
        } catch (e) {
toast.error("Ha ocurrido un error. Intente de nuevo mas tarde.");        }

    }

    const getId = async (usuario) => {
        try {
            const respuesta = await axiosInstance(urlUser);
            const usuarioEncontrado = respuesta.data.data.find((u) => u.nombreusuario === usuario.nombreUsuario);

            if (!usuarioEncontrado) {
toast.error("No se ha encontrado el usuario.");                
return null;
            }

            return usuarioEncontrado.id;
        } catch (e) {
toast.error("Ha ocurrido un error. Intente de nuevo mas tarde.");
            return null;
        }
    }


    const actualizarRol = async (usuarioSeleccionado) => {
        try {
            if (!usuarioSeleccionado || !espacioActual) {
                toast.error("Faltan datos necesarios para cambiar el rol");
                return;
            }

            const idUsuarioReal = await getId(usuarioSeleccionado);

            if (!idUsuarioReal) {
                toast.error("No se pudo obtener el ID del usuario");
                return;
            }

            if (!idAdmin) {
                toast.error("No se ha identificado el administrador actual");
                return;
            }

            const parametros = {
                idSpace: idEspacio,
                idAdmin: idAdmin,
                idUser: idUsuarioReal
            };


            const response = await axiosInstance.put(`${API_URL}/api/usuarios-espacios/change-role`, parametros);

            toast.success(`${usuarioSeleccionado.nombreUsuario} ahora es administrador`);

            await getMiembrosEspacio();

        } catch (error) {

            if (error.response?.status === 403) {
                toast.error("No tienes permisos para cambiar roles");
            } else if (error.response?.status === 404) {
                toast.error("Usuario o espacio no encontrado");
            } else if (error.response?.status === 409) {
                toast.error("El usuario ya es administrador");
            } else {
                toast.error("Error al cambiar el rol del usuario");
            }
        }
    };

    const eliminarUsuario = async (usuarioSeleccionado) => {
        try {
            if (!usuarioSeleccionado || !idEspacio) {
                toast.error("Faltan datos necesarios para eliminar el usuario");
                return;
            }

            const idUsuarioReal = await getId(usuarioSeleccionado);

            if (!idUsuarioReal) {
                toast.error("No se pudo obtener el ID del usuario");
                return;
            }

            const url = urlEliminarUsuario + `${idEspacio}/usuarios/${idUsuarioReal}`
            const response = await axiosInstance.delete(url);

            if (idUsuarioReal === userId) {
                setModalEliminarAbierto(false);
                if (onSalirDelEspacio) {
                    await onSalirDelEspacio();
                }
                return;
            }

            await getMiembrosEspacio();

        } catch (error) {
            console.error("Error al eliminar usuario:", error);

            if (error.response?.status === 403) {
                toast.error("No tienes permisos para eliminar usuarios");
            } else if (error.response?.status === 404) {
                toast.error("Usuario o espacio no encontrado");
            } else if (error.response?.status === 409) {
                toast.error("No se puede eliminar este usuario");
            } else if (error.response?.status === 400) {
                toast.error("No puedes eliminar al único administrador");
            } else {
                toast.error("Error al eliminar el usuario del espacio");
            }
        }
    };

    const actualizarPorcentajes = async () => {
        /*Para el que le toque realizar esta funcion.
        
        Una vez el usuario se elimina de un espacio, ya sea que se salga solo, o que el admin lo saque,
        abrirá un modal (ModalMiembros o ModalEliminarUsuario, ambos hacen lo mismo), en esa pestaña pedirá al usuario administrador que 
        vuelva a asignar los porcentajes, puesto que siempre deben de sumar 100, tienes que hacer aqui en esta funcion las validaciones,
        lo que se haga en esta funcion lo recibe el modal, al modal casi no le vas a tener que mover nada, primero vas a hacer una consulta
        de tipo GET a http://127.0.0.1:8080/api/usuarios-espacios/porcentaje-faltante, lo que te va a devolver una lista de los espacios (todos)
        los que le faltan porcentaje para tener el 100, vas a hacer, recuerda usar axiosInstance y no axios normal, porque es ruta protegida.
        Una vez tengas ese porcentaje tienes tambien el id del espacio y el status del mismo, vas a hacer una validacion y ponerla en el useEffect,
        esa validacion preguntará que si el espacio seleccionado está dentro de esa peticion GET, si lo está saldrá un mensaje que dirá "Este espacio
        está temporalmente inhabilitado ya que el administrador necesita realizar unos ajustes." el mejor modo de hacerlo es con un jsx nuevo,
        y hacerlo como está en el Hub.jsx linea 60, osea que esa funcion GET va a estár en Hub.jsx, ese mismo jsx que harás tendrá dos versiones
        si eres usuario o si eres admin, si eres usuario te aparecerá el mensaje antes dicho, si eres administrador te abrirá el modal para asignar
        porcentajes,  el administrador tendrá dos opciones, automatica o manual, si es automatica hará peticion POST a 
        http://127.0.0.1:8080/api/{idEspacio}/reasignar-porcentaje, este lo hará de manera automatica y volverá a poner el status del espacio en true 
        (si un espacio está en status=false entonces redireccionas al jsx nuevo). El modo manual es un POST hacia
        http://127.0.0.1:8080/api/{idEspacio}/usuarios/{idUsuario}/asignar-porcentaje, ahi vas a escribir el numero de porcentaje que le corresponde,
        En este archivo tienes ya el id del espacio, el id del admin en caso de usarlo, y el id del usuario ya lo toma el modal, no tienes que realizar
        mucha mas cosa*/
    }

    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    const abrirModalEliminarUsuario = async (member) => {
        setUsuarioAEliminar(member);
        const id = await getId(member)
        setIdUsuarioAEliminar(id)
        setModalEliminarAbierto(true);
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={3000} />
            <div>
                <div className="members-header">
                    {espacioActual == null ? "" : (
                        <div className="dashboard-title">
                            <h1>Miembros</h1>
                            <p>Gestiona los miembros del espacio: {nombreEspacio}</p>
                        </div>
                    )}

                    {espacioActual != null && espacioActual.rol === "Administrador" ? (
                        <div className="members-actions">
                            <button className="outline-button" onClick={() => setMostrarCodigo(true)}>
                                {mostrarCodigo ? (
                                    <>
                                        Código: <span className="code-display">{codigo}</span>
                                    </>
                                ) : (
                                    "Mostrar código"
                                )}
                            </button>
                            <button className="outline-button-salir" onClick={() => abrirModalEliminarUsuario(espacioActual)}>
                                Salir del espacio
                            </button>
                        </div>
                    ) : (
                        <div className="members-actions">
                            <button className="outline-button-salir" onClick={() => abrirModalEliminarUsuario(espacioActual)}>
                                Salir del espacio
                            </button>
                        </div>
                    )}

                </div>


                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title mt-2">Miembros de {nombreEspacio}</h3>
                        {espacioActual.rol != "Administrador" ? (
                            <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                                Visualiza los miembros del espacio y los porcentajes de contribución de cada uno.
                            </p>
                        ) : (
                            <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                                Administra los permisos y porcentajes de contribución de cada miembro.
                            </p>
                        )}
                        <div>
                            {espacioActual.rol === "Administrador" && (
                                <ModalMiembros
                                    nombreEspacio={nombreEspacio}
                                    espacioActual={espacioActual}
                                    miembrosDelEspacio={miembrosDelEspacio}
                                    onDeleteMember={eliminarUsuario}
                                    onMakeAdmin={actualizarRol}
                                    onUpdateSpace={actualizarPorcentajes}
                                />
                            )}

                        </div>
                    </div>
                    <div className="card-content">
                        {miembrosDelEspacio.map((member, index) => (
                            <div key={index} className="member-item">
                                <div className="member-info">
                                    <div className="member-avatar">{member.nombreUsuario.charAt(0).toUpperCase()}</div>
                                    <div className="member-details">
                                        <h5>{member.rol === "Administrador" ? "👑" : "👤"} {member.nombreUsuario}</h5>
                                        <div className="member-role">{member.rol}</div>
                                    </div>
                                </div>

                                <div className="member-actions">
                                    <div className="member-percentage">
                                        <div className="percentage">{member.porcentajeGasto}%</div>
                                        <div className="label">Contribución</div>
                                    </div>
                                    {espacioActual.rol === "Administrador" && member.rol !== "Administrador" && (
                                        <div className="action-buttons">
                                            <button
                                                className="small-button danger"
                                                onClick={() => abrirModalEliminarUsuario(member)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}

                                </div>

                            </div>
                        ))}

                        {modalEliminarAbierto && usuarioAEliminar && (
                            <ModalEliminarUsuario
                                nombreEspacio={nombreEspacio}
                                espacioActual={espacioActual}
                                miembrosDelEspacio={miembrosDelEspacio}
                                usuarioAEliminar={usuarioAEliminar}
                                idUsuario={idUsuarioAEliminar}
                                onDeleteMember={eliminarUsuario}
                                onUpdateSpace={actualizarPorcentajes}
                                onClose={() => setModalEliminarAbierto(false)}
                            />
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}