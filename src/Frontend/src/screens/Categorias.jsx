import "./css/general.css";
import "./css/miembros.css";
import { useEffect, useState } from "react";
import {
  getCategoriesByEspacio,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoryService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ModalNuevaCategoria from "../components/modalCategoria";

export const Categorias = ({ espacioActual, nombreEspacio }) => {
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);

  // Carga categorías
  const fetchCategorias = async (idEspacio, showToast = true) => {
    try {
      const response = await getCategoriesByEspacio(idEspacio);
    
      setCategorias(Array.isArray(response.data) ? response.data : []);
      if (showToast) toast.success("Categorías cargadas correctamente");
    } catch (error) {
      toast.error("Error al obtener las categorías");
      console.error(error);
    }
  };

  useEffect(() => {
    if (espacioActual?.idEspacio) {
      // Resetea estados al cambiar de espacio
      setCategorias([]);
      setCategoriaEditar(null);
      setModalAbierto(false);

      fetchCategorias(espacioActual.idEspacio, true);
    } else {
      // Si no hay espacio, limpiar todo
      setCategorias([]);
      setCategoriaEditar(null);
      setModalAbierto(false);
    }
  }, [espacioActual]);

  // Agregar o actualizar categoría
  const guardarCategoria = async (nombreCategoria) => {
    if (!espacioActual || !espacioActual.idEspacio) {
      toast.error("No hay un espacio seleccionado válido");
      return;
    }

    if (!nombreCategoria || nombreCategoria.trim() === "") {
      toast.warning("El nombre de la categoría no puede estar vacío");
      return;
    }

    const nombreFormateado = nombreCategoria.trim().toLowerCase();

    // Validar duplicados excluyendo la categoría que se está editando
    const yaExiste = categorias.some(
      (cat) =>
        cat.nombre &&
        cat.nombre.trim().toLowerCase() === nombreFormateado &&
        (!categoriaEditar || cat.id !== categoriaEditar.id)
    );
    if (yaExiste) {
      toast.warning("La categoría ya existe");
      return;
    }

    // Validar que la categoría que se está editando pertenezca al espacio actual
    if (
      categoriaEditar &&
      (!categoriaEditar.id || !categorias.some((cat) => cat.id === categoriaEditar.id))
    ) {
      toast.error("La categoría que intentas editar no pertenece al espacio actual");
      setCategoriaEditar(null);
      setModalAbierto(false);
      return;
    }

    try {
      if (categoriaEditar) {
        await updateCategoria(
          categoriaEditar.id,
          nombreCategoria.trim(),
          espacioActual.idEspacio
        );
        toast.success("Categoría actualizada exitosamente");
      } else {
        await createCategoria(espacioActual.idEspacio, nombreCategoria.trim());
        toast.success("Categoría creada exitosamente");
      }

      setModalAbierto(false);
      setCategoriaEditar(null);
      await fetchCategorias(espacioActual.idEspacio, false);
    } catch (error) {
      toast.error(
        categoriaEditar
          ? "Error al actualizar la categoría"
          : "Error al crear la categoría"
      );
      console.error(error);
    }
  };

  // Abrir modal para editar categoría
  const handleEditarCategoria = (categoria) => {
    if (categoria && categorias.some((cat) => cat.id === categoria.id)) {
      setCategoriaEditar(categoria);
      setModalAbierto(true);
    } else {
      toast.error("La categoría seleccionada no pertenece al espacio actual");
    }
  };

  // Eliminar con confirmación
  const handleEliminarCategoria = (categoria) => {
    Swal.fire({
      title: `¿Está seguro de eliminar la categoría "${categoria.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategoria(categoria.id);
          setCategorias((prev) => prev.filter((c) => c.id !== categoria.id));
          toast.success("Categoría eliminada");
        } catch (error) {
          toast.error("Error al eliminar la categoría");
          console.error(error);
        }
      }
    });
  };

  return (
    <>
      <div>
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Categorías</h1>
            <p>Gestiona las categorías de gastos del espacio: {nombreEspacio}</p>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              setCategoriaEditar(null); // Limpiar edición
              setModalAbierto(true);
            }}
          >
            <span>+</span> Nueva Categoría
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

      {/* Modal para crear o editar */}
      <ModalNuevaCategoria
        abierto={modalAbierto}
        setAbierto={setModalAbierto}
        agregarCategoria={guardarCategoria}
        categoriaEditar={categoriaEditar}
      />
    </>
  );
};
