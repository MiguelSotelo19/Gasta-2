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
    const userId = parseInt(localStorage.getItem("userId"));

    const confirmarEliminar = async () => {
        await onDeleteMember(usuarioAEliminar)
        if (userId !== idUsuario) {
            location.reload()
        } else{
            setModalPorcentajesAbierto(false)
            console.log("Hola2")
        }
    }

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
        </>
    )
}