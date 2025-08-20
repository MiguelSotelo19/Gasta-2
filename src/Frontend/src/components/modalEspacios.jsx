
import { useState } from "react"
import { X, Users, Plus, ArrowLeft, Hash, Sparkles, UserPlus } from "lucide-react"
import "./css/modal-espacios.css"

export default function ModalEspacios({
  modalNuevoEspacioAbierto,
  setModalNuevoEspacioAbierto,
  modoModal,
  setModoModal,
  nuevoEspacio,
  setNuevoEspacio,
  agregarEspacio,
  unirseAEspacio,
  codigoEspacio,
  setCodigoEspacio
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUnirse = async () => {
    setIsLoading(true);
    try {
      await unirseAEspacio(codigoEspacio);
      setCodigoEspacio("");
      setModoModal("opciones");
    } catch (error) {
      console.error("Error desde el modal:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleCrear = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      agregarEspacio()
    }, 800)
  }

  const getTitulo = () => {
    switch (modoModal) {
      case "opciones":
        return "¿Qué deseas hacer?"
      case "crear":
        return "Crear nuevo espacio"
      case "unirse":
        return "Unirse a un espacio"
      default:
        return ""
    }
  }

  const getDescripcion = () => {
    switch (modoModal) {
      case "opciones":
        return "Elige una opción para comenzar"
      case "crear":
        return "Dale un nombre único a tu nuevo espacio de trabajo"
      case "unirse":
        return "Ingresa el código de invitación que recibiste"
      default:
        return ""
    }
  }

  const handleCerrarModal = () => {
    setModalNuevoEspacioAbierto(false);
    setModoModal("opciones");
    setCodigoEspacio("");
    setNuevoEspacio("");
  };


  if (!modalNuevoEspacioAbierto) return null

  return (
    <>
      <div className="modal-espacios-overlay" onClick={handleCerrarModal}>
        <div className="modal-espacios-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-espacios-header">
            <div className="modal-espacios-icon-container">
              {modoModal === "opciones" && <Sparkles className="modal-espacios-icon" />}
              {modoModal === "crear" && <Plus className="modal-espacios-icon" />}
              {modoModal === "unirse" && <UserPlus className="modal-espacios-icon" />}
            </div>
            <h2 className="modal-espacios-title">{getTitulo()}</h2>
            <p className="modal-espacios-description">{getDescripcion()}</p>
          </div>

          <div className="modal-espacios-content">
            {modoModal === "opciones" && (
              <div className="modal-espacios-options-grid">
                <div
                  className="modal-espacios-option-card modal-espacios-option-card-blue"
                  onClick={() => setModoModal("unirse")}
                >
                  <div className="modal-espacios-option-icon-container modal-espacios-option-icon-blue">
                    <Users className="modal-espacios-option-icon" />
                  </div>
                  <div className="modal-espacios-option-content">
                    <h3 className="modal-espacios-option-title">Unirse a un espacio</h3>
                    <p className="modal-espacios-option-subtitle">Únete usando un código de invitación</p>
                  </div>
                </div>

                <div
                  className="modal-espacios-option-card modal-espacios-option-card-green"
                  onClick={() => setModoModal("crear")}
                >
                  <div className="modal-espacios-option-icon-container modal-espacios-option-icon-green">
                    <Plus className="modal-espacios-option-icon" />
                  </div>
                  <div className="modal-espacios-option-content">
                    <h3 className="modal-espacios-option-title">Crear espacio</h3>
                    <p className="modal-espacios-option-subtitle">Crea tu propio espacio de trabajo</p>
                  </div>
                </div>
              </div>
            )}

            {modoModal === "crear" && (
              <div className="modal-espacios-form-container">
                <div className="modal-espacios-input-group">
                  <label htmlFor="nombre-espacio" className="modal-espacios-input-label">
                    Nombre del espacio
                  </label>
                  <input id="nombre-espacio" type="text" placeholder="Mi espacio de trabajo" value={nuevoEspacio}
                    onChange={(e) => setNuevoEspacio(e.target.value)} className="modal-espacios-input-field"
                  />
                </div>
                <div className="modal-espacios-info-box">
                  <p className="modal-espacios-info-text">💡 Elige un nombre descriptivo que sea fácil de recordar</p>
                </div>
              </div>
            )}

            {modoModal === "unirse" && (
              <div className="modal-espacios-form-container">
                <div className="modal-espacios-input-group">
                  <label htmlFor="codigo-espacio" className="modal-espacios-input-label">
                    Código de invitación
                  </label>
                  <div className="modal-espacios-input-with-icon">
                    <Hash className="modal-espacios-input-icon" />
                    <input id="codigo-espacio" type="number" placeholder="12345" value={codigoEspacio}
                      onChange={(e) => {
                        const value = e.target.value;
                        const nums = value.replace(/\D/g, "").slice(0, 5);
                        setCodigoEspacio(nums);
                      }}
                      className="modal-espacios-input-field modal-espacios-input-with-padding"
                    />

                  </div>
                </div>
                <div className="modal-espacios-info-box modal-espacios-info-box-blue">
                  <p className="modal-espacios-info-text-blue">
                    🔗 El código de invitación debe dartelo el administrador del espacio
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="modal-espacios-footer">
            <button
              className="modal-espacios-btn modal-espacios-btn-secondary"
              onClick={() => {
                if (modoModal === "opciones") {
                  handleCerrarModal();
                } else {
                  setModoModal("opciones");
                  setCodigoEspacio("");
                  setNuevoEspacio("");
                }
              }}
              disabled={isLoading}
            >
              {modoModal === "opciones" ? (
                <>
                  <X className="modal-espacios-btn-icon" />
                  Cancelar
                </>
              ) : (
                <>
                  <ArrowLeft className="modal-espacios-btn-icon" />
                  Volver
                </>
              )}
            </button>

            {modoModal === "crear" && (
              <button
                className="modal-espacios-btn modal-espacios-btn-primary modal-espacios-btn-green"
                onClick={handleCrear}
                disabled={!nuevoEspacio.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="modal-espacios-spinner" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="modal-espacios-btn-icon" />
                    Crear espacio
                  </>
                )}
              </button>
            )}

            {modoModal === "unirse" && (
              <button
                className="modal-espacios-btn modal-espacios-btn-primary modal-espacios-btn-blue"
                onClick={handleUnirse}
                disabled={!codigoEspacio.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="modal-espacios-spinner" />
                    Uniéndose...
                  </>
                ) : (
                  <>
                    <UserPlus className="modal-espacios-btn-icon" />
                    Unirse
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}