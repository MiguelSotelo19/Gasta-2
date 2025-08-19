import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";
import "./css/general.css";
import "./css/miembros.css";
import "../components/css/modal-miembros.css";

export const Generico = ({ 
    desactivado, 
    esAdmin, 
    espacioActual, 
    miembrosDelEspacio, 
    onUpdateSpace,
    getMiembrosEspacio,
    getEspacio 
}) => {
    const [porcentajes, setPorcentajes] = useState({});
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (desactivado && esAdmin && miembrosDelEspacio) {
            const porcentajesIniciales = {};
            miembrosDelEspacio.forEach((member) => {
                porcentajesIniciales[member.nombreUsuario] = member.porcentajeGasto || 0;
            });
            setPorcentajes(porcentajesIniciales);
        }
    }, [desactivado, esAdmin, miembrosDelEspacio]);

    const handlePorcentajeChange = (nombreUsuario, valor) => {
        setPorcentajes((prev) => ({
            ...prev,
            [nombreUsuario]: valor === "" ? 0 : parseInt(valor),
        }));
    };

    const asignarPorcentajesAutomaticamente = async () => {
        const miembros = miembrosDelEspacio;
        if (miembros.length % 2 !== 0) return;

        const porcentajeEquitativo = Math.floor(100 / miembros.length);
        const sobrante = 100 - porcentajeEquitativo * miembros.length;

        const nuevos = {};
        miembros.forEach((m, i) => {
            nuevos[m.nombreUsuario] = porcentajeEquitativo + (i === 0 ? sobrante : 0);
        });
        setPorcentajes(nuevos);
    };

    const guardarPorcentajes = async () => {
        const total = Object.values(porcentajes).reduce((a, b) => a + Number(b || 0), 0);
        if (total !== 100) {
            toast.error("Los porcentajes deben sumar exactamente 100%");
            return;
        }

        const asignaciones = miembrosDelEspacio.map((m) => ({
            idUsuario: m.idUsuario,
            porcentaje: porcentajes[m.nombreUsuario],
        }));

        const payload = {
            idEspacio: espacioActual.idEspacio,
            asignaciones,
        };

        try {
            const response = await axiosInstance.put(`${API_URL}/api/usuarios-espacios/asignar-porcentajes`, payload);

            if (response.status !== 200) throw new Error("Error al guardar");
            toast.success("Porcentajes asignados correctamente. Espacio reactivado.");
            
            await getMiembrosEspacio();
            await getEspacio();
            
            if (onUpdateSpace) {
                onUpdateSpace();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar los porcentajes");
        }
    };

    const totalPorcentaje = Object.values(porcentajes).reduce(
        (sum, val) => sum + Number(val || 0),
        0
    );

    return (
        <>
            {desactivado ? (
                <div>
                    <div className="members-header">
                        <div className="dashboard-title">
                            <h1>Espacio desactivado</h1>
                            <p>
                                {esAdmin
                                    ? "Tienes configuraciones que realizar con el porcentaje de cada invitado"
                                    : "Espacio desactivado. Espera a que el administrador termine de realizar unos ajustes"}
                            </p>
                        </div>
                    </div>

                    {esAdmin && miembrosDelEspacio && miembrosDelEspacio.length > 0 ? (
                        <div className="card flex flex-col grow h-full min-h-[60vh]">
                            <div className="card-header">
                                <h3 className="card-title mt-2">🎯 Reasignación de Porcentajes</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Configura los porcentajes para reactivar el espacio
                                </p>
                            </div>
                            
                            <div className="card-content flex-grow">
                                <div className="miembros-grid">
                                    {miembrosDelEspacio.map((member, index) => (
                                        <div key={index} className="miembro-card">
                                            <div className="miembro-avatar">
                                                <div className="avatar-circle">
                                                    {member.nombreUsuario.charAt(0).toUpperCase()}
                                                </div>
                                            </div>

                                            <div className="miembro-info">
                                                <h4 className="miembro-nombre">{member.nombreUsuario}</h4>
                                                <span className="miembro-rol">{member.rol}</span>
                                            </div>

                                            <div className="miembro-porcentaje">
                                                <div className="porcentaje-display">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={porcentajes[member.nombreUsuario] || 0}
                                                        onChange={(e) =>
                                                            handlePorcentajeChange(
                                                                member.nombreUsuario,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="porcentaje-input"
                                                    />
                                                    <span className="porcentaje-simbolo">%</span>
                                                </div>
                                                <span className="porcentaje-label">Contribución</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="opciones-porcentaje">
                                    <button
                                        className="btn-asignar-auto"
                                        onClick={asignarPorcentajesAutomaticamente}
                                        disabled={miembrosDelEspacio.length % 2 !== 0}
                                        onMouseEnter={() => setTooltipVisible(true)}
                                        onMouseLeave={() => setTooltipVisible(false)}
                                    >
                                        🤖 Asignar Automáticamente
                                    </button>
                                    {tooltipVisible && miembrosDelEspacio.length % 2 !== 0 && (
                                        <span className="tooltip">
                                            Función habilitada solo si el número de integrantes del espacio es par
                                        </span>
                                    )}
                                </div>

                                <div className="porcentaje-total">
                                    <span
                                        className={`total-display ${
                                            totalPorcentaje === 100 ? "correcto" : "incorrecto"
                                        }`}
                                    >
                                        Total: {totalPorcentaje}% {totalPorcentaje === 100 ? "✅" : "❌"}
                                    </span>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <button
                                        className={`modal-guardar-btn ${
                                            totalPorcentaje === 100 ? "habilitado" : "deshabilitado"
                                        }`}
                                        onClick={guardarPorcentajes}
                                        disabled={totalPorcentaje !== 100}
                                    >
                                        {totalPorcentaje === 100
                                            ? "💾 Guardar y Reactivar Espacio"
                                            : "⚠️ Los porcentajes deben sumar 100%"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : esAdmin ? (
                        <div className="card flex flex-col grow h-full min-h-[60vh]">
                            <div className="card-header">
                                <h3 className="card-title mt-2">⏳ Cargando datos...</h3>
                            </div>
                            <div className="card-content flex-grow flex items-center justify-center">
                                <p className="text-gray-500">Cargando información de los miembros...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="card flex flex-col grow h-full min-h-[60vh]">
                            <div className="card-header">
                                <h3 className="card-title mt-2">⏳ Esperando configuración</h3>
                            </div>
                            <div className="card-content flex-grow flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">⚠️</div>
                                    <p className="text-gray-500">El administrador está configurando el espacio...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="members-header">
                        <div className="dashboard-title">
                            <h1>Sin espacio seleccionado</h1>
                            <p>No tienes espacios a mostrar, ¡únete o crea uno!</p>
                        </div>
                    </div>

                    <div className="card flex flex-col grow h-full min-h-[60vh]">
                        <div className="card-header">
                            <h3 className="card-title mt-2"></h3>
                        </div>
                        <div className="card-content flex-grow"></div>
                    </div>
                </div>
            )}
        </>
    );
};