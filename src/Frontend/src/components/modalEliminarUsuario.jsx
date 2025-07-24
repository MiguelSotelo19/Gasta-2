import { useState, useEffect } from "react"
import "./css/modal-miembros.css"

export default function ModalEliminarUsuario({
    nombreEspacio,
    espacioActual,
    miembrosDelEspacio,
    usuarioAEliminar,
    idUsuario,
    onDeleteMember,
    onUpdateSpace,
    onClose
}) {
    const [modalPorcentajesAbierto, setModalPorcentajesAbierto] = useState(false)
    const [porcentajes, setPorcentajes] = useState({})
    const userId = parseInt(localStorage.getItem("userId"));

    const abrirModalPorcentajes = () => {
        setModalPorcentajesAbierto(true)
        const nuevosPortentajes = {}
        miembrosDelEspacio
            .filter((member) => member.nombreUsuario !== usuarioAEliminar.nombreUsuario)
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

    const confirmarEliminar = () => {
        onDeleteMember(usuarioAEliminar)
        if (userId !== idUsuario) {
            abrirModalPorcentajes()
        } else{
            setModalPorcentajesAbierto(false)
        }
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
        onClose()
    }

    const totalPorcentaje = Object.values(porcentajes).reduce((sum, val) => sum + val, 0)

    return (
        <>
            {!modalPorcentajesAbierto && (
                <div className="modal-overlay">
                    <div className="modal-container modal-confirmacion">
                        {idUsuario === userId ? (
                            <>
                                <div className="modal-header">
                                    <h3 className="modal-titulo">🗑️ Salir del espacio</h3>
                                </div>

                                <div className="modal-body">
                                    <div className="confirmacion-icono">⚠️</div>
                                    <h4 className="confirmacion-pregunta">¿Quieres salir del espacio?</h4>
                                    <p className="confirmacion-descripcion">
                                        Eres usuario administrador, si sales del espacio, y no hay otro administrador,
                                        el espacio será eliminado
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button className="modal-cancelar-btn" onClick={onClose}>
                                        Cancelar
                                    </button>
                                    <button className="modal-eliminar-btn" onClick={confirmarEliminar}>
                                        🗑️ Salir
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="modal-header">
                                    <h3 className="modal-titulo">🗑️ Eliminar Miembro</h3>
                                </div>

                                <div className="modal-body">
                                    <div className="confirmacion-icono">⚠️</div>
                                    <h4 className="confirmacion-pregunta">¿Eliminar a {usuarioAEliminar.nombreUsuario}?</h4>
                                    <p className="confirmacion-descripcion">
                                        Si eliminas este usuario tendrás que ordenar los porcentajes nuevamente. Esta acción no se puede
                                        deshacer.
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button className="modal-cancelar-btn" onClick={onClose}>
                                        Cancelar
                                    </button>
                                    <button className="modal-eliminar-btn" onClick={confirmarEliminar}>
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </>
                        )}
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
                                    .filter((member) => member.nombreUsuario !== usuarioAEliminar?.nombreUsuario)
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