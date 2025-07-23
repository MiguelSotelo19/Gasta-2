import "./css/miembros.css"
import "./css/general.css"
import axiosInstance from "../services/axiosInstance";
import { useEffect, useState } from "react";

export const Miembros = ({ espacioActual, nombreEspacio }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const urlEspacio = `${API_URL}/api/espacios/`
    const urlUser = `${API_URL}/api/usuarios/all`
    const urlEspaciosUser = `${API_URL}/api/usuarios-espacios/all-global`
    const userId = localStorage.getItem("userId");
    const [codigo, setCodigo] = useState("")
    const [nombreAdmin, setNombreAdmin] = useState("")
    const [mostrarCodigo, setMostrarCodigo] = useState(false);
    const [miembrosDelEspacio, setMiembrosDelEspacio] = useState([])

    const members = [
        { name: "María González", role: "Administrador", percentage: 30, avatar: "MG" },
        { name: "Juan Pérez", role: "Miembro", percentage: 25, avatar: "JP" },
        { name: "Ana López", role: "Miembro", percentage: 25, avatar: "AL" },
        { name: "Carlos Ruiz", role: "Administrador", percentage: 20, avatar: "CR" },
    ]

    useEffect(() => {
        if (espacioActual) {
            getEspacio();
            //getUsers();
            getMiembrosEspacio()
        }
    }, [espacioActual]);

    const getMiembrosEspacio = async () =>{
        try {
            const respuesta = await axiosInstance(urlEspaciosUser)
            console.log("getMiembrosEspacio: ",respuesta.data.data)
            const miembrosEspacio = respuesta.data.data.filter((espacio) => espacio.nombreEspacio === espacioActual.nombreEspacio)
            console.log("miembros del espacio: ",miembrosEspacio)
            setMiembrosDelEspacio(miembrosEspacio)
        } catch (e) {
            console.log(e)
        }
    }

    const getEspacio = async () => {
        try {
            console.log("espacioactual: ",espacioActual)
            const respuesta = await axiosInstance(urlEspacio)
            const espacioSeleccionado = respuesta.data.data.find((u) => u.nombre === espacioActual.nombreEspacio);
            setCodigo(espacioSeleccionado.codigoinvitacion)
            setNombreAdmin(espacioActual.nombreUsuario)
            console.log("seleccionado: ",espacioSeleccionado)
            console.log(espacioSeleccionado.codigoinvitacion)
            console.log(espacioActual.nombreUsuario)
        } catch (e) {
            console.log(e)
        }

    }

    /*const getUsers = async () => {
        try {
            const respuesta = await axiosInstance(urlUser)
            console.log("getUsers:",respuesta.data.data)
            const usuariosEncontrados = respuesta.data.data.find((u) => u.id === parseInt(userId));

        } catch (e) {
            console.log(e)
        }
    }*/

    return (
        <>

            <div>
                <div className="members-header">
                    <div className="dashboard-title">
                        <h1>Miembros</h1>
                        <p>Gestiona los miembros del espacio: {nombreEspacio}</p>
                    </div>
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
                        <button className="primary-button">
                            <span>+</span>
                            Invitar Miembro
                        </button>
                    </div>
                </div>


                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Miembros del Espacio</h3>
                        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                            Administra los permisos y porcentajes de contribución de cada miembro
                        </p>
                    </div>
                    <div className="card-content">
                        {miembrosDelEspacio.map((member, index) => (
                            <div key={index} className="member-item">
                                <div className="member-info">
                                    <div className="member-details">
                                        <h4>{member.nombreUsuario}</h4>
                                        <div className="member-role">{member.rol}</div>
                                    </div>
                                </div>
                                <div className="member-actions">
                                    <div className="member-percentage">
                                        <div className="percentage">{member.porcentajeGasto}%</div>
                                        <div className="label">Contribución</div>
                                    </div>
                                    <div className="action-buttons">
                                        <button className="small-button">✏️</button>
                                        <button className="small-button danger">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}