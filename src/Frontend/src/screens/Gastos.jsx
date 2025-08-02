// Importaciones necesarias
import { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";
import { getCategoriesByEspacio } from "../services/categoryService";
import "./css/general.css";
import "./css/gastos.css";

export const Gastos = ({ espacioActual, nombreEspacio }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const urlGastos = `${API_URL}/api/gastos/espacio/${espacioActual?.idEspacio}`;
  const urlPagos = `${API_URL}/api/pagos/` //ocupa idUsuario/idEspacio
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [miembros, setMiembros] = useState([]);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [cargandoCategorias, setCargandoCategorias] = useState(false);
  const [editandoGasto, setEditandoGasto] = useState(null);
  const idEspacio = espacioActual?.idEspacio || null;
  const idUsuario = parseInt(localStorage.getItem("userId")) || null;
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [pagos, setPagos] = useState([]);

  const [formData, setFormData] = useState({
    cantidad: '',
    descripcion: '',
    idCategoria: '',
    idEspacio: idEspacio,
    idUsuario: idUsuario
  });

  useEffect(() => {
    if (espacioActual?.idEspacio) {
      setEsAdmin(espacioActual.rol === 'Administrador');
      setFormData(prev => ({
        ...prev,
        idEspacio: idEspacio,
        idUsuario: idUsuario
      }));
      cargarDatosIniciales();
    }
  }, [espacioActual]);

  const cargarDatosIniciales = async () => {
    try {
      await Promise.all([
        cargarCategorias(),
        cargarGastos(),
        cargarMiembros(),
        cargarPagos()
      ]);
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    }
  };

  const cargarMiembros = async () => {
    if (!espacioActual?.idEspacio) return;
    try {
      const response = await axiosInstance.get(`${API_URL}/api/usuarios-espacios/all/${espacioActual.idEspacio}`);
      setMiembros(response.data.data || []);
    } catch (error) {
      console.error("Error cargando miembros:", error);
      setMiembros([]);
    }
  };

  const cargarPagos = async () => {
    if (!espacioActual?.idEspacio || !idUsuario) {
      console.log("No se pueden cargar pagos - falta espacioActual o idUsuario");
      return;
    }

    setCargando(true);
    try {
      const url = `${API_URL}/api/pagos/${idUsuario}/${idEspacio}`;
      console.log("URL de pagos:", url);
      console.log("idUsuario:", idUsuario);
      console.log("idEspacio:", idEspacio);

      const response = await axiosInstance.get(url);
      console.log("Response completo de pagos:", response);
      console.log("Response.data de pagos:", response.data);

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log("Pagos cargados exitosamente:", response.data.data);
        setPagos(response.data.data);
      } else {
        console.error("Estructura de datos inesperada en pagos:", response.data);
        toast.error("Error al cargar pagos");
        setPagos([]);
      }
    } catch (error) {
      console.error("Error completo cargando pagos:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      toast.error("Error al cargar los pagos. Verifica tu conexión.");
      setPagos([]);
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    if (!espacioActual?.idEspacio) return;
    setCargandoCategorias(true);
    try {
      const response = await getCategoriesByEspacio(espacioActual.idEspacio);

      let categoriesData = null;
      if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      }

      if (categoriesData) {
        const categoriasConEstilo = categoriesData.map(cat => ({
          ...cat,
          color: getCategoryColor(cat.nombre)
        }));
        console.log("Categorías procesadas:", categoriasConEstilo);
        setCategorias(categoriasConEstilo);
      } else {
        console.error("No se pudieron cargar las categorías, estructura inesperada:", response);
        toast.error("Error al cargar categorías");
        setCategorias([]);
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
      toast.error("Error al cargar categorías");
      setCategorias([]);
    } finally {
      setCargandoCategorias(false);
    }
  };

  const cargarGastos = async () => {
    if (!espacioActual?.idEspacio) return;
    setCargando(true);
    try {
      const response = await axiosInstance.get(urlGastos);
      if (response.data && Array.isArray(response.data.data)) {
        console.log("gastos:", response.data.data)
        setGastos(response.data.data);
      } else {
        toast.error("Error al cargar gastos");
        setGastos([]);
      }
    } catch (error) {
      toast.error("Error al cargar los gastos. Verifica tu conexión.");
      setGastos([]);
    } finally {
      setCargando(false);
    }
  };

  const getCategoryColor = (categoryName) => {
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

  const validateAmount = (value) => {
    if (!value) return "El monto es requerido";
    if (isNaN(value)) return "Debe ser un número válido";

    const num = Number.parseFloat(value);
    if (num < 1) return "El monto mínimo es $1";
    if (num > 99999) return "El monto máximo es $99,999";

    const decimalParts = value.split(".");
    if (decimalParts.length > 2) return "Solo se permite un punto decimal";
    if (decimalParts[1] && decimalParts[1].length > 2) return "Solo se permiten 2 decimales";
    if (decimalParts[0].length > 5) return "Máximo 5 cifras antes del decimal";

    return null;
  };

  const validateDescription = (value) => {
    if (!value) return "La descripción es requerida";
    if (value.length < 5) return "La descripción debe tener al menos 5 caracteres";
    if (value.length > 100) return "La descripción no puede exceder 100 caracteres";
    return null;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
      const error = validateAmount(value);
      setErrors((prev) => ({ ...prev, amount: error }));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    const error = validateDescription(value);
    setErrors((prev) => ({ ...prev, description: error }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setErrors((prev) => ({ ...prev, category: null }));
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!selectedCategory) {
      newErrors.category = "Debe seleccionar una categoría";
    }

    const amountError = validateAmount(amount);
    if (amountError) {
      newErrors.amount = amountError;
    }

    const descriptionError = validateDescription(description);
    if (descriptionError) {
      newErrors.description = descriptionError;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCargando(true);
      try {
        const payload = {
          cantidad: parseFloat(amount),
          descripcion: description,
          idCategoria: parseInt(selectedCategory.id),
          idEspacio: parseInt(espacioActual.idEspacio)
        };

        if (editandoGasto) {
          await axiosInstance.put(`${API_URL}/api/gastos/editar/${editandoGasto.id}`, payload);
          toast.success("Gasto actualizado correctamente");
        } else {
          await axiosInstance.post(`${API_URL}/api/gastos/registrar`, payload);
          toast.success("Gasto registrado correctamente");
        }

        handleCloseModal();
        await cargarGastos();
        await cargarPagos();
      } catch (error) {
        toast.error("Error al procesar la solicitud");
      } finally {
        setCargando(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setAmount("");
    setDescription("");
    setErrors({});
    setEditandoGasto(null);
  };

  const handleEditGasto = (gasto) => {
    setEditandoGasto(gasto);
    setAmount(gasto.cantidad.toString());
    setDescription(gasto.descripcion);

    // Buscar la categoría correspondiente
    const categoria = categorias.find(cat => cat.id === gasto.idCategoria);
    if (categoria) {
      setSelectedCategory(categoria);
    }

    setShowModal(true);
  };

  const handleDeleteGasto = async (gastoId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este gasto?")) {
      setCargando(true);
      try {
        await axiosInstance.delete(`${API_URL}/api/gastos/eliminar/${gastoId}`);
        toast.success("Gasto eliminado correctamente");
        await cargarGastos();
      } catch (error) {
        toast.error("Error al eliminar el gasto");
      } finally {
        setCargando(false);
      }
    }
  };

  const gastosDelUsuario = gastos.filter(gasto => gasto.idUsuario == idUsuario && gasto.estatusPago == false);
  return (
    <div className="gasto-container">
      <div className="gasto-header">
        <div className="gasto-title">
          <h1>Gastos</h1>
          <p>Gestiona los gastos del espacio: {nombreEspacio}</p>
        </div>
        <button
          className="gasto-add-button"
          onClick={() => setShowModal(true)}
          disabled={cargando || cargandoCategorias}
        >
          <span>+</span>
          Agregar Gasto
        </button>
      </div>

      <div className="gasto-list-container">
        {cargando ? (
          <div className="gasto-loading">Cargando pagos...</div>
        ) : gastosDelUsuario.length > 0 ? (
          <div className="gasto-list">
            {gastosDelUsuario.map((gasto, index) => {
              const categoria = categorias.find(cat => cat.id === gasto.idTipoGasto);
              const pago = pagos[index];

              return (
                <div key={gasto.id} className="gasto-item">
                  <div className="gasto-item-left">
                    <div
                      className="gasto-category-icon"
                      style={{
                        backgroundColor: categoria?.color + "20" || "#6b728020",
                        color: categoria?.color || "#6b7280"
                      }}
                    >
                      {categoria?.nombre?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="gasto-item-info">
                      <h3 className="gasto-item-title">
                        {gasto?.descripcion || "Descripción no disponible"}
                      </h3>
                      <div className="gasto-item-meta">
                        <span className="gasto-category-name">
                          {categoria?.nombre || gasto?.nombreTipoGasto || "Sin categoría"}
                        </span>
                        <span className="gasto-due-date">
                          {gasto?.fecha
                            ? new Date(gasto.fecha).toLocaleDateString()
                            : "Fecha no disponible"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="gasto-item-right">
                    <div className="gasto-amount">
                      ${Number(pago?.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="gasto-item-actions">
                      {esAdmin ? (
                        <>
                      {!gasto.estatus ? (
                        <button
                          className="gasto-pay-button"
                          onClick={() => marcarComoPagado(gasto.id)}
                          disabled={cargando}
                        >
                          Marcar como Pagado
                        </button>
                      ) : (
                        <span className="gasto-paid-status">✅ Pagado</span>
                      )}
                      </>) : ""}
                      
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="gasto-empty-state">
            <div className="gasto-empty-icon">✅</div>
            <h3 className="gasto-empty-title">¡Excelente!</h3>
            <p className="gasto-empty-message">No tienes pagos pendientes por realizar</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="gasto-modal-overlay" onClick={handleCloseModal}>
          <div className="gasto-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gasto-modal-header">
              <h2 className="gasto-modal-title">
                {editandoGasto ? 'Editar Gasto' : 'Agregar Nuevo Gasto'}
              </h2>
              <button className="gasto-modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <div className="gasto-modal-content">
              {!selectedCategory ? (
                // Paso 1: Seleccionar categoría
                <div className="gasto-category-selection">
                  <h3 className="gasto-step-title">Selecciona una categoría</h3>
                  {errors.category && <div className="gasto-error-message">{errors.category}</div>}
                  {cargandoCategorias ? (
                    <div className="gasto-loading">Cargando categorías...</div>
                  ) : (
                    <div className="gasto-categories-grid">
                      {categorias.map((category) => (
                        <button
                          key={category.id}
                          className="gasto-category-card"
                          onClick={() => handleCategorySelect(category)}
                          style={{ borderColor: category.color + "40" }}
                        >
                          <div
                            className="gasto-category-card-icon"
                            style={{ backgroundColor: category.color + "20", color: category.color }}
                          >
                            {category.nombre?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="gasto-category-card-name">{category.nombre}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Paso 2: Ingresar detalles
                <div className="gasto-details-form">
                  <div className="gasto-selected-category">
                    <div
                      className="gasto-selected-icon"
                      style={{ backgroundColor: selectedCategory.color + "20", color: selectedCategory.color }}
                    >
                      {selectedCategory.nombre?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span className="gasto-selected-name">{selectedCategory.nombre}</span>
                    <button className="gasto-change-category" onClick={() => setSelectedCategory(null)}>
                      Cambiar
                    </button>
                  </div>

                  <div className="gasto-form-group">
                    <label className="gasto-form-label">Monto *</label>
                    <div className="gasto-amount-input-container">
                      <span className="gasto-currency-symbol">$</span>
                      <input
                        type="text"
                        className={`gasto-amount-input ${errors.amount ? "gasto-input-error" : ""}`}
                        placeholder="0.00"
                        value={amount}
                        onChange={handleAmountChange}
                      />
                    </div>
                    {errors.amount && <div className="gasto-error-message">{errors.amount}</div>}
                  </div>

                  <div className="gasto-form-group">
                    <label className="gasto-form-label">Descripción *</label>
                    <textarea
                      className={`gasto-description-input ${errors.description ? "gasto-input-error" : ""}`}
                      placeholder="Describe el gasto (mínimo 5 caracteres)"
                      value={description}
                      onChange={handleDescriptionChange}
                      rows={3}
                    />
                    <div className="gasto-character-count">{description.length}/100 caracteres</div>
                    {errors.description && <div className="gasto-error-message">{errors.description}</div>}
                  </div>

                  <div className="gasto-modal-actions">
                    <button className="gasto-cancel-button" onClick={handleCloseModal}>
                      Cancelar
                    </button>
                    <button
                      className="gasto-submit-button"
                      onClick={handleSubmit}
                      disabled={cargando}
                    >
                      {cargando ? 'Procesando...' : (editandoGasto ? 'Actualizar Gasto' : 'Agregar Gasto')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};