import "./css/general.css";
import "./css/miembros.css";
import { useEffect, useState } from "react";
import { getCategoriesByEspacio, createCategoria, updateCategoria, deleteCategoria } from "../services/categoryService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ModalNuevaCategoria from "../components/modalCategoria";
import axiosInstance from "../services/axiosInstance";

export const Categorias = ({ espacioActual, nombreEspacio }) => {
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [categoriasConEstadisticas, setCategoriasConEstadisticas] = useState([]);
  const [cargandoEstadisticas, setCargandoEstadisticas] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const idUsuario = parseInt(localStorage.getItem("userId")) || null;

  const getColoresCateg = (categoryName) => {
    const colorPalette = [
      '#10b981', '#3b82f6', '#8b5cf6',
      '#f59e0b', '#ef4444', '#06b6d4', 
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
      await cargarEstadisticasCategorias(idEspacio, categoriasConEstilo);
    } catch (error) {
      toast.error("Error al obtener las categorías");
      console.error(error);
    }
  };

  const cargarEstadisticasCategorias = async (idEspacio, categorias) => {
    setCargandoEstadisticas(true);
    try {
      const urlGastos = `${API_URL}/api/gastos/espacio/${idEspacio}`;
      const response = await axiosInstance.get(urlGastos);
      const gastos = response.data?.data || [];

      const categoriasConStats = categorias.map(categoria => {
        const gastosCategoria = gastos.filter(gasto => gasto.idTipoGasto === categoria.id);
        const ultimoGasto = gastosCategoria.length > 0 
          ? gastosCategoria.reduce((ultimo, actual) => 
              new Date(actual.fecha) > new Date(ultimo.fecha) ? actual : ultimo
            )
          : null;

        return {
          ...categoria,
          cantidadGastos: gastosCategoria.length,
          ultimoGasto: ultimoGasto ? new Date(ultimoGasto.fecha) : null,
          esActiva: gastosCategoria.length > 0,
          usadaReciente: ultimoGasto ? 
            (new Date() - new Date(ultimoGasto.fecha)) < (7 * 24 * 60 * 60 * 1000) : false // 7 días
        };
      });

      setCategoriasConEstadisticas(categoriasConStats);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      setCategoriasConEstadisticas(categorias.map(cat => ({
        ...cat,
        cantidadGastos: 0,
        ultimoGasto: null,
        esActiva: false,
        usadaReciente: false
      })));
    } finally {
      setCargandoEstadisticas(false);
    }
  };

  useEffect(() => {
    if (espacioActual?.idEspacio) {
      setCategorias([]);
      setCategoriasConEstadisticas([]);
      setCategoriaEditar(null);
      setModalAbierto(false);
      fetchCategorias(espacioActual.idEspacio);
    } else {
      setCategorias([]);
      setCategoriasConEstadisticas([]);
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
          setCategoriasConEstadisticas((prev) => prev.filter((c) => c.id !== categoria.id));
          toast.success("Categoría eliminada");
        } catch (error) {
          toast.error("Error al eliminar la categoría");
          console.error(error);
        }
      }
    });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Nunca";
    const now = new Date();
    const diff = now - fecha;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return "Hoy";
    if (dias === 1) return "Ayer";
    if (dias < 7) return `Hace ${dias} días`;
    if (dias < 30) return `Hace ${Math.floor(dias / 7)} semanas`;
    return fecha.toLocaleDateString();
  };

  const categoriasFiltradas = categoriasConEstadisticas.filter((cat) => 
    cat.id !== undefined && 
    cat.id !== null && 
    cat.nombre?.toLowerCase().includes(filtro.toLowerCase())
  );

  const categoriasOrdenadas = categoriasFiltradas.sort((a, b) => {
    if (a.usadaReciente && !b.usadaReciente) return -1;
    if (!a.usadaReciente && b.usadaReciente) return 1;
    if (a.esActiva && !b.esActiva) return -1;
    if (!a.esActiva && b.esActiva) return 1;
    return a.nombre.localeCompare(b.nombre);
  });

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

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "0.5rem", 
          marginTop: "1rem", 
          backgroundColor: "#f0f0f0", 
          padding: "0.4rem 0.8rem", 
          borderRadius: "8px", 
          maxWidth: "400px" 
        }}>
          <span role="img" aria-label="lupa" style={{ fontSize: "1.2rem" }}>
            🔍
          </span>
          <input 
            type="text" 
            placeholder="Buscar categoría..." 
            value={filtro} 
            onChange={(e) => setFiltro(e.target.value)}
            style={{ 
              border: "none", 
              outline: "none", 
              backgroundColor: "transparent", 
              flex: 1, 
              fontSize: "1rem" 
            }}
          />
        </div>

        {cargandoEstadisticas && (
          <div style={{ 
            textAlign: "center", 
            padding: "1rem", 
            color: "#666" 
          }}>
            Cargando estadísticas...
          </div>
        )}

        <div className="card-content categorias-grid">
          {categoriasOrdenadas.length === 0 ? (
            <div className="empty-state">
              <p>
                {filtro ? "No se encontraron categorías con ese nombre." : "Aún no hay categorías registradas."}
              </p>
            </div>
          ) : (
            categoriasOrdenadas.map((categoria) => (
              <div className="member-item categoria-mejorada" key={categoria.id}>
                <div className="categoria-header">
                  <div className="gasto-category-card-icon" 
                    style={{ 
                      backgroundColor: (categoria.color || "#6b7280") + "20", 
                      color: categoria.color || "#6b7280", 
                      border: `2px solid ${categoria.color || "#6b7280"}40`,
                      position: "relative"
                    }}
                  >
                    {(categoria.nombre || "?").charAt(0).toUpperCase()}
                    {categoria.usadaReciente && (
                      <div style={{
                        position: "absolute",
                        top: "-2px",
                        right: "-2px",
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#10b981",
                        borderRadius: "50%",
                        border: "1px solid white"
                      }} title="Usada recientemente" />
                    )}
                  </div>
                  <div className="member-details">
                    <h5>{categoria.nombre || "Sin nombre"}</h5>
                    <div className="categoria-estadisticas">
                      <span className="categoria-stat">
                        {categoria.cantidadGastos} {categoria.cantidadGastos === 1 ? 'gasto' : 'gastos'}
                      </span>
                      <span className="categoria-ultimo-uso">
                        Último uso: {formatearFecha(categoria.ultimoGasto)}
                      </span>
                      <div className="categoria-estado">
                        <span className={`estado-badge ${categoria.esActiva ? 'activa' : 'inactiva'}`}>
                          {categoria.esActiva ? '🟢 En uso' : '⚫ Sin uso'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="categoria-actions">
                  
                  {espacioActual?.rol === "Administrador" && (
                    <>
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
                    </>
                  )}
                </div>
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

      <style jsx>{`
        .categoria-mejorada {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .categoria-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          flex: 1;
        }

        .categoria-estadisticas {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          font-size: 0.85rem;
          color: #666;
        }

        .categoria-stat {
          font-weight: 500;
          color: #333;
        }

        .categoria-ultimo-uso {
          color: #888;
        }

        .categoria-estado {
          margin-top: 0.25rem;
        }

        .estado-badge {
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .estado-badge.activa {
          background-color: #10b98120;
          color: #10b981;
        }

        .estado-badge.inactiva {
          background-color: #6b728020;
          color: #6b7280;
        }

        .categoria-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .small-button.success {
          background-color: #10b981;
          color: white;
          border: none;
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .small-button.success:hover {
          background-color: #059669;
        }

        .categoria-rapida-info {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};