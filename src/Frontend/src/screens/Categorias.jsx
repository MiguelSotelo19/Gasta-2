import "./css/general.css"
import "./css/miembros.css" // estilos para card, member-item, botones, etc.
import { useEffect, useState } from "react"
import { getCategoriesByEspacio } from "../services/categoryService"
import { toast } from "react-toastify"

export const Categorias = ({ espacioActual, nombreEspacio }) => {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    const fetchCategorias = async (idEspacio) => {
      try {
        const response = await getCategoriesByEspacio(idEspacio)
        setCategorias(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        toast.error("Error al obtener las categorías")
      }
    }

    if (espacioActual && espacioActual.id) {
      fetchCategorias(espacioActual.id)
    }
  }, [espacioActual])

  const handleEditarCategoria = (categoria) => {
    toast.info(`Editar categoría: ${categoria.nombre}`)
    // Aquí abrirías modal o ruta para editar
  }

  const handleEliminarCategoria = (categoria) => {
    toast.info(`Eliminar categoría: ${categoria.nombre}`)
    // Aquí lógica para eliminar
  }

  return (
    <>
      <div>
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Categorías</h1>
            <p>Gestiona las categorías de gastos del espacio: {nombreEspacio}</p>
          </div>
          <button className="primary-button">
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
            categorias.map((categoria) => (
              <div className="member-item" key={categoria.id}>
                <div className="member-avatar">{categoria.nombre.charAt(0).toUpperCase()}</div>
                <div className="member-details">
                  <h5>{categoria.nombre}</h5>
                  
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
    </>
  )
}
