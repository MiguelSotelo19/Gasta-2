import "./css/general.css"
import "./css/miembros.css"
import { useEffect, useState } from "react"
import { getCategoriesByEspacio, createCategoria } from "../services/categoryService"
import { toast } from "react-toastify"
import ModalNuevaCategoria from "../components/modalCategoria"

export const Categorias = ({ espacioActual, nombreEspacio }) => {
  const [categorias, setCategorias] = useState([])
  const [modalAbierto, setModalAbierto] = useState(false)

  // Parámetro opcional showToast para controlar si mostrar toast
  const fetchCategorias = async (idEspacio, showToast = true) => {
    try {
      const response = await getCategoriesByEspacio(idEspacio)
      setCategorias(Array.isArray(response.data) ? response.data : [])
      if (showToast) {
        toast.success("Categorías cargadas correctamente")
      }
    } catch (error) {
      toast.error("Error al obtener las categorías")
      console.error(error)
    }
  }

  useEffect(() => {
    if (espacioActual?.id) {
      // Aquí sí mostramos el toast
      fetchCategorias(espacioActual.id, true)
    }
  }, [espacioActual])

  const handleEditarCategoria = (categoria) => {
    toast.info(`Editar categoría: ${categoria.nombre || "Sin nombre"}`)
    // Aquí puedes agregar la lógica para editar
  }

  const handleEliminarCategoria = (categoria) => {
    try {
      setCategorias((prev) => prev.filter((c) => c.id !== categoria.id))
      toast.success(`Categoría eliminada: ${categoria.nombre || "Sin nombre"}`)
    } catch (error) {
      toast.error("No se pudo eliminar la categoría")
      console.error(error)
    }
  }

  const agregarCategoria = async (nombreCategoria) => {
    try {
      if (!nombreCategoria || nombreCategoria.trim() === "") {
        toast.warning("El nombre de la categoría no puede estar vacío")
        return
      }

      const nombreFormateado = nombreCategoria.trim().toLowerCase()

      const yaExiste = categorias.some(
        (cat) => cat.nombre && cat.nombre.trim().toLowerCase() === nombreFormateado
      )

      if (yaExiste) {
        toast.warning("La categoría ya existe")
        return
      }

      await createCategoria(espacioActual.id, nombreCategoria.trim())

      // Recargamos sin mostrar el toast de carga
      await fetchCategorias(espacioActual.id, false)

      toast.success("Categoría creada exitosamente")
      setModalAbierto(false)
    } catch (error) {
      toast.error("Error al crear la categoría")
      console.error(error)
    }
  }

  return (
    <>
      <div>
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Categorías</h1>
            <p>Gestiona las categorías de gastos del espacio: {nombreEspacio}</p>
          </div>
          <button className="primary-button" onClick={() => setModalAbierto(true)}>
            <span>+</span>
            Nueva Categoría
          </button>
        </div>

        <div className="card-content categorias-grid">
          {categorias.length === 0 ? (
            <div className="empty-state">
              <p>Aún no hay categorías registradas.</p>
            </div>
          ) : (
            categorias
              .filter((cat) => cat.id !== undefined && cat.id !== null)
              .map((categoria) => (
                <div className="member-item" key={categoria.id}>
                  <div className="member-avatar">
                    {(categoria.nombre || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="member-details">
                    <h5>{categoria.nombre || "Sin nombre"}</h5>
                  </div>

                  {espacioActual?.rol === "Administrador" && (
                    <div className="member-actions">
                      <button
                        className="small-button primary"
                        onClick={() => handleEditarCategoria(categoria)}
                        title="Editar categoría"
                      >
                        ✏️
                      </button>
                      <button
                        className="small-button danger"
                        onClick={() => handleEliminarCategoria(categoria)}
                        title="Eliminar categoría"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </div>

      {/* Modal de creación */}
      <ModalNuevaCategoria
        abierto={modalAbierto}
        setAbierto={setModalAbierto}
        agregarCategoria={agregarCategoria}
      />
    </>
  )
}
