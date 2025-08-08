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
  const [filtro, setFiltro] = useState("");

  const getColoresCateg = (categoryName) => {
    const colorPalette = [
      '#10b981',
      '#3b82f6',
      '#8b5cf6',
      '#f59e0b',
      '#ef4444',
      '#06b6d4',
      '#6b7280'
    ];

    const firstLetter = categoryName?.charAt(0)?.toUpperCase();
    const alphabetIndex = firstLetter ? firstLetter.charCodeAt(0) - 65 : 0;

    const groupSize = Math.ceil(26 / colorPalette.length);
    const colorIndex = Math.floor(alphabetIndex / groupSize);

    return colorPalette[colorIndex] || colorPalette[colorPalette.length - 1];
  };

  const fetchCategorias = async (idEspacio) => {
    try {
      const response = await getCategoriesByEspacio(idEspacio);
      const categoriesData = Array.isArray(response.data) ? response.data : [];

      const categoriasConEstilo = categoriesData.map(cat => ({
        ...cat,
        color: getColoresCateg(cat.nombre)
      }));

      setCategorias(categoriasConEstilo);
    } catch (error) {
      toast.error("Error al obtener las categorías");
      console.error(error);
    }
  };

  useEffect(() => {
    if (espacioActual?.idEspacio) {
      setCategorias([]);
      setCategoriaEditar(null);
      setModalAbierto(false);
      fetchCategorias(espacioActual.idEspacio);
    } else {
      setCategorias([]);
      setCategoriaEditar(null);
      setModalAbierto(false);
    }
  }, [espacioActual]);

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
      await fetchCategorias(espacioActual.idEspacio);
    } catch (error) {
      toast.error(
        categoriaEditar
          ? "Error al actualizar la categoría"
          : "Error al crear la categoría"
      );
      console.error(error);
    }
  };

  const handleEditarCategoria = (categoria) => {
    if (categoria && categorias.some((cat) => cat.id === categoria.id)) {
      setCategoriaEditar(categoria);
      setModalAbierto(true);
    } else {
      toast.error("La categoría seleccionada no pertenece al espacio actual");
    }
  };

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
          {espacioActual?.rol === "Administrador" && (
            <button
              className="primary-button"
              onClick={() => {
                setCategoriaEditar(null);
                setModalAbierto(true);
              }}
            >
              <span>+</span> Nueva Categoría
            </button>
          )}

        </div>


        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", backgroundColor: "#f0f0f0", padding: "0.4rem 0.8rem", borderRadius: "8px", maxWidth: "400px", }} >
          <span role="img" aria-label="lupa" style={{ fontSize: "1.2rem" }}>
            🔍
          </span>
          <input type="text" placeholder="Buscar categoría..." value={filtro} onChange={(e) => setFiltro(e.target.value)}
            style={{ border: "none", outline: "none", backgroundColor: "transparent", flex: 1, fontSize: "1rem", }}
          />
        </div>

        <div className="card-content categorias-grid">
          {categorias.length === 0 ? (
            <div className="empty-state">
              <p>Aún no hay categorías registradas.</p>
            </div>
          ) : (
            categorias
              .filter((cat) => cat.id !== undefined && cat.id !== null && cat.nombre?.toLowerCase().includes(filtro.toLowerCase()))
              .map((categoria) => (
                <div className="member-item" key={categoria.id}>
                  <div className="gasto-category-card-icon" style={{ backgroundColor: (categoria.color || "#6b7280") + "20", color: categoria.color || "#6b7280", border: `2px solid ${categoria.color || "#6b7280"}40` }}>
                    {(categoria.nombre || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="member-details">
                    <h5>{categoria.nombre || "Sin nombre"}</h5>
                  </div>

                  {espacioActual?.rol === "Administrador" && (
                    <div className="member-actions">
                      <button className="small-button primary" onClick={() => handleEditarCategoria(categoria)}
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

      <ModalNuevaCategoria
        abierto={modalAbierto}
        setAbierto={setModalAbierto}
        agregarCategoria={guardarCategoria}
        categoriaEditar={categoriaEditar}
      />
    </>
  );
};
