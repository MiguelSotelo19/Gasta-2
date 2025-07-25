import { useState } from "react"
import { X, Plus, ArrowLeft, Sparkles } from "lucide-react"
import "./css/modal-espacios.css"

export default function ModalNuevaCategoria({ abierto, setAbierto, agregarCategoria }) {
  const [nombreCategoria, setNombreCategoria] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCrear = async () => {
    setIsLoading(true)
    try {
      await agregarCategoria(nombreCategoria)
      setNombreCategoria("")
      setAbierto(false)
    } catch (error) {
      console.error("Error al crear categoría:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!abierto) return null

  return (
    <div className="modal-espacios-overlay" onClick={() => setAbierto(false)}>
      <div className="modal-espacios-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-espacios-header">
          <div className="modal-espacios-icon-container">
            <Sparkles className="modal-espacios-icon" />
          </div>
          <h2 className="modal-espacios-title">Crear nueva categoría</h2>
          <p className="modal-espacios-description">Agrega una categoría de gasto a este espacio</p>
        </div>

        <div className="modal-espacios-content">
          <div className="modal-espacios-form-container">
            <div className="modal-espacios-input-group">
              <label htmlFor="nombre-categoria" className="modal-espacios-input-label">
                Nombre de la categoría
              </label>
              <input
                id="nombre-categoria"
                type="text"
                placeholder="Ej: Comida, Transporte, etc."
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                className="modal-espacios-input-field"
              />
            </div>
            <div className="modal-espacios-info-box">
              <p className="modal-espacios-info-text">💡 Elige un nombre claro y representativo</p>
            </div>
          </div>
        </div>

        <div className="modal-espacios-footer">
          <button
            className="modal-espacios-btn modal-espacios-btn-secondary"
            onClick={() => setAbierto(false)}
            disabled={isLoading}
          >
            <X className="modal-espacios-btn-icon" />
            Cancelar
          </button>

          <button
            className="modal-espacios-btn modal-espacios-btn-primary modal-espacios-btn-green"
            onClick={handleCrear}
            disabled={!nombreCategoria.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <div className="modal-espacios-spinner" />
                Creando...
              </>
            ) : (
              <>
                <Plus className="modal-espacios-btn-icon" />
                Crear categoría
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
