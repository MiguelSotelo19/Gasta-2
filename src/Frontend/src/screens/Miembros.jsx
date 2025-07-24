import "./css/miembros.css"
import "./css/general.css"
import axiosInstance from "../services/axiosInstance";
import { useEffect, useState } from "react";
import ModalMiembros from "../components/modalMiembros";

export const Miembros = ({ espacioActual, nombreEspacio }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const urlEspacio = `${API_URL}/api/espacios/`
    const urlEspaciosUser = `${API_URL}/api/usuarios-espacios/all-global`
    const userId = localStorage.getItem("userId");
    const [codigo, setCodigo] = useState("")
    const [nombreAdmin, setNombreAdmin] = useState("")
    const [mostrarCodigo, setMostrarCodigo] = useState(false);
    const [miembrosDelEspacio, setMiembrosDelEspacio] = useState([])


    useEffect(() => {
        if (espacioActual) {
            getEspacio();
            getMiembrosEspacio()
        }
    }, [espacioActual]);

    const getMiembrosEspacio = async () => {
        try {
            const respuesta = await axiosInstance(urlEspaciosUser)
            console.log("getMiembrosEspacio: ", respuesta.data.data)
            const miembrosEspacio = respuesta.data.data.filter((espacio) => espacio.nombreEspacio === espacioActual.nombreEspacio)
            console.log("miembros del espacio: ", miembrosEspacio)
            setMiembrosDelEspacio(miembrosEspacio)
        } catch (e) {
            console.log(e)
        }
    }

    const getEspacio = async () => {
        try {
            console.log("espacioactual: ", espacioActual)
            const respuesta = await axiosInstance(urlEspacio)
            const espacioSeleccionado = respuesta.data.data.find((u) => u.nombre === espacioActual.nombreEspacio);
            setCodigo(espacioSeleccionado.codigoinvitacion)
            setNombreAdmin(espacioActual.nombreUsuario)
            console.log("seleccionado: ", espacioSeleccionado)
            console.log(espacioSeleccionado.codigoinvitacion)
            console.log(espacioActual.nombreUsuario)
        } catch (e) {
            console.log(e)
        }

    }

    const actualizarRol = async () => {

    }

    const eliminarUsuario = async () => {

    }

    const actualizarPorcentajes = async () => {

    }

    return (
        <>

            <div>
                <div className="members-header">
                    {espacioActual == null ? "" : (
                        <div className="dashboard-title">
                            <h1>Miembros</h1>
                            <p>Gestiona los miembros del espacio: {nombreEspacio}</p>
                        </div>
                    )}

                    {espacioActual != null && espacioActual.rol === "Administrador" && (
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
                                    {espacioActual.rol != "Administrador" ? ("") : (
                                        <div className="action-buttons">
                                            <button className="small-button">✏️</button>
                                            <button className="small-button danger">🗑️</button>
                                        </div>)}

                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}