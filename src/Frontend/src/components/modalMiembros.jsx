
import { useState, useEffect } from "react"
import "./css/modal-miembros.css"

export default function ModalMiembros({
    nombreEspacio,
    espacioActual,
    miembrosDelEspacio,
    onUpdateSpace,
    onDeleteMember,
    onMakeAdmin,
}) {
    const [modalAbierto, setModalAbierto] = useState(false)
    const [modalAdminAbierto, setModalAdminAbierto] = useState(false)
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false)
    const [modalPorcentajesAbierto, setModalPorcentajesAbierto] = useState(false)
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
    const [porcentajes, setPorcentajes] = useState({})
    const [temporizador, setTemporizador] = useState(8)
    const [botonHabilitado, setBotonHabilitado] = useState(false)

    useEffect(() => {
        if (modalAbierto) {
            const porcentajesIniciales = {}
            miembrosDelEspacio.forEach((member) => {
                porcentajesIniciales[member.nombreUsuario] = member.porcentajeGasto
            })
            setPorcentajes(porcentajesIniciales)
        }
    }, [modalAbierto, miembrosDelEspacio])
        +
        useEffect(() => {
            let intervalo
            if (modalAdminAbierto && temporizador > 0) {
                intervalo = setInterval(() => {
                    setTemporizador((prev) => {
                        if (prev === 1) {
                            setBotonHabilitado(true)
                        }
                        return prev - 1
                    })
                }, 1000)
            }
            return () => clearInterval(intervalo)
        }, [modalAdminAbierto, temporizador])

    const abrirModal = () => {
        setModalAbierto(true)
    }

    const cerrarModal = () => {
        setModalAbierto(false)
    }

    const abrirModalAdmin = (usuario) => {
        setUsuarioSeleccionado(usuario)
        setModalAdminAbierto(true)
        setTemporizador(8)
        setBotonHabilitado(false)
    }

    const cerrarModalAdmin = () => {
        setModalAdminAbierto(false)
        setUsuarioSeleccionado(null)
    }

    const abrirModalEliminar = (usuario) => {
        setUsuarioSeleccionado(usuario)
        setModalEliminarAbierto(true)
    }

    const cerrarModalEliminar = () => {
        setModalEliminarAbierto(false)
        setUsuarioSeleccionado(null)
    }

    const abrirModalPorcentajes = () => {
        setModalPorcentajesAbierto(true)
        const nuevosPortentajes = {}
        miembrosDelEspacio
            .filter((member) => member.nombreUsuario !== usuarioSeleccionado.nombreUsuario)
            .forEach((member) => {
                nuevosPortentajes[member.nombreUsuario] = 0
            })
        setPorcentajes(nuevosPortentajes)
    }

    const handlePorcentajeChange = (nombreUsuario, valor) => {
        setPorcentajes((prev) => ({
            ...prev,
            [nombreUsuario]: Number.parseInt(valor) || 0,
        }))
    }

    const confirmarAdmin = () => {
        onMakeAdmin(usuarioSeleccionado)
        cerrarModalAdmin()
    }

    const confirmarEliminar = () => {
        onDeleteMember(usuarioSeleccionado)
        cerrarModalEliminar()
        abrirModalPorcentajes()
    }

    const confirmarPorcentajes = () => {
        const totalPorcentaje = Object.values(porcentajes).reduce((sum, val) => sum + val, 0)
        if (totalPorcentaje !== 100) {
            toast.error("Los porcentajes deben sumar exactamente 100%");
            return
        }

        Object.entries(porcentajes).forEach(([nombreUsuario, porcentaje]) => {
            onUpdateSpace(nombreUsuario, porcentaje)
        })

        setModalPorcentajesAbierto(false)
        cerrarModal()
    }

    const totalPorcentaje = Object.values(porcentajes).reduce((sum, val) => sum + val, 0)

    return (
        <>
            <button className="modal-abrir-btn" onClick={abrirModal}>
                👥 Gestionar usuarios
            </button>

            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal-container ">
                        <div className="modal-header">
                            <h2 className="modal-titulo">🎯 Gestión de Porcentajes</h2>
                            <button className="modal-cerrar-btn" onClick={cerrarModal}>
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="miembros-grid">
                                {miembrosDelEspacio.map((member, index) => (
                                    <div key={index} className="miembro-card">
                                        <div className="miembro-avatar">
                                            <div className="avatar-circle">{member.nombreUsuario.charAt(0).toUpperCase()}</div>
                                        </div>

                                        <div className="miembro-info">
                                            <h4 className="miembro-nombre">{member.nombreUsuario}</h4>
                                            <span className="miembro-rol">{member.rol}</span>
                                        </div>

                                        <div className="miembro-porcentaje">
                                            <div className="porcentaje-display">
                                                <input type="number" min="0" max="100" value={porcentajes[member.nombreUsuario] || member.porcentajeGasto}
                                                    onChange={(e) => handlePorcentajeChange(member.nombreUsuario, e.target.value)}
                                                    className="porcentaje-input" disabled={espacioActual.rol !== "Administrador"}
                                                />
                                                <span className="porcentaje-simbolo">%</span>
                                            </div>
                                            <span className="porcentaje-label">Contribución</span>
                                        </div>

                                        {espacioActual.rol === "Administrador" && (
                                            <div className="miembro-acciones">
                                                {member.rol != "Administrador" && (
                                                    <>
                                                        <button className="accion-btn editar-btn" onClick={() => abrirModalAdmin(member)}
                                                            title="Hacer administrador"> 👑
                                                        </button>

                                                        <button
                                                            className="accion-btn eliminar-btn"
                                                            onClick={() => abrirModalEliminar(member)}
                                                            title="Eliminar miembro"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="porcentaje-total">
                                <span className={`total-display ${totalPorcentaje === 100 ? "correcto" : "incorrecto"}`}>
                                    Total: {totalPorcentaje}%
                                </span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-cancelar-btn" onClick={cerrarModal}>
                                Cancelar
                            </button>
                            <button
                                className="modal-guardar-btn"
                                onClick={() => {
                                    if (totalPorcentaje === 100) {
                                        Object.entries(porcentajes).forEach(([nombreUsuario, porcentaje]) => {
                                            onUpdateSpace(nombreUsuario, porcentaje)
                                        })
                                        cerrarModal()
                                    } else {
                                        toast.error("Los porcentajes deben sumar exactamente 100%");
                                    }
                                }}
                            >
                                💾 Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalAdminAbierto && usuarioSeleccionado && (
                <div className="modal-overlay">
                    <div className="modal-container modal-confirmacion">
                        <div className="modal-header">
                            <h3 className="modal-titulo">👑 Hacer Administrador</h3>
                        </div>

                        <div className="modal-body">
                            <div className="confirmacion-icono">👤➡️👑</div>
                            <h4 className="confirmacion-pregunta">¿Hacer a {usuarioSeleccionado.nombreUsuario} administrador?</h4>
                            <p className="confirmacion-descripcion">
                                Un administrador puede eliminar a otros usuarios y modificar los porcentajes de contribución. Esta
                                acción otorgará permisos completos sobre el espacio.
                                No podrás eliminar a un administrador aunque seas el dueño del espacio.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-cancelar-btn" onClick={cerrarModalAdmin}>
                                Cancelar
                            </button>
                            <button
                                className={`modal-confirmar-btn ${botonHabilitado ? "habilitado" : "deshabilitado"}`}
                                onClick={confirmarAdmin}
                                disabled={!botonHabilitado}
                            >
                                {botonHabilitado ? "✅ Confirmar" : `⏳ Espera ${temporizador}s`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalEliminarAbierto && usuarioSeleccionado && (
                <div className="modal-overlay">
                    <div className="modal-container modal-confirmacion">
                        <div className="modal-header">
                            <h3 className="modal-titulo">🗑️ Eliminar Miembro</h3>
                        </div>

                        <div className="modal-body">
                            <div className="confirmacion-icono">⚠️</div>
                            <h4 className="confirmacion-pregunta">¿Eliminar a {usuarioSeleccionado.nombreUsuario}?</h4>
                            <p className="confirmacion-descripcion">
                                Si eliminas este usuario tendrás que ordenar los porcentajes nuevamente. Esta acción no se puede
                                deshacer.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-cancelar-btn" onClick={cerrarModalEliminar}>
                                Cancelar
                            </button>
                            <button className="modal-eliminar-btn" onClick={confirmarEliminar}>
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalPorcentajesAbierto && (
                <div className="modal-overlay modal-forzado">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3 className="modal-titulo">⚖️ Reasignar Porcentajes</h3>
                        </div>

                        <div className="modal-body">
                            <p className="reasignacion-descripcion">
                                Debes reasignar los porcentajes para que sumen exactamente 100%
                            </p>

                            <div className="porcentajes-lista">
                                {miembrosDelEspacio
                                    .filter((member) => member.nombreUsuario !== usuarioSeleccionado?.nombreUsuario)
                                    .map((member, index) => (
                                        <div key={index} className="porcentaje-item">
                                            <div className="miembro-info-simple">
                                                <div className="avatar-pequeno">{member.nombreUsuario.charAt(0).toUpperCase()}</div>
                                                <span className="nombre-simple">{member.nombreUsuario}</span>
                                            </div>

                                            <div className="porcentaje-control">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    placeholder="0"
                                                    value={porcentajes[member.nombreUsuario]}
                                                    onChange={(e) => handlePorcentajeChange(member.nombreUsuario, e.target.value)}
                                                    className="porcentaje-input-simple"
                                                />
                                                <span className="porcentaje-simbolo">%</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className="total-reasignacion">
                                <span className={`total-display ${totalPorcentaje === 100 ? "correcto" : "incorrecto"}`}>
                                    Total: {totalPorcentaje}% {totalPorcentaje === 100 ? "✅" : "❌"}
                                </span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className={`modal-confirmar-btn ${totalPorcentaje === 100 ? "habilitado" : "deshabilitado"}`}
                                onClick={confirmarPorcentajes}
                                disabled={totalPorcentaje !== 100}
                            >
                                {totalPorcentaje === 100 ? "✅ Confirmar Porcentajes" : "⚠️ Debe sumar 100%"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
