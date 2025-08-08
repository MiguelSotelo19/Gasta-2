import { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";
import { getCategoriesByEspacio } from "../services/categoryService";
import "./css/general.css";
import "./css/gastos.css";
import axios from "axios";

export const Gastos = ({ espacioActual, nombreEspacio }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const urlGastos = `${API_URL}/api/gastos/espacio/${espacioActual?.idEspacio}`;
  const urlPagos = `${API_URL}/api/pagos/` //ocupa idUsuario/idEspacio
  const urlPagosStatus = `${API_URL}/api/pagos/status/`
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
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [pagos, setPagos] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [pagosInvitado, setPagoInvitado] = useState([])
  const [spaceMembers, setSpaceMembers] = useState([]);
  const [soloNoPagados, setSoloNoPagados] = useState(false);


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
      toast.error("Error cargando datos iniciales");
    }
  };

  const cargarMiembros = async () => {
    if (!espacioActual?.idEspacio) return;
    try {
      const response = await axiosInstance.get(`${API_URL}/api/usuarios-espacios/all/${espacioActual.idEspacio}`);
      setMiembros(response.data.data || []);
    } catch (error) {
      toast.error("Error cargando miembros");
      setMiembros([]);
    }
  };

  const cargarPagos = async () => {
    if (!espacioActual?.idEspacio || !idUsuario) {
      return;
    }

    setCargando(true);
    try {
      const url = `${urlPagos}${idUsuario}/${idEspacio}`;
      const response = await axiosInstance.get(url);

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setPagos(response.data.data);
      } else {
        toast.error("Error al cargar pagos - estructura de datos inesperada");
        setPagos([]);
      }
    } catch (error) {
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
          color: getColoresCateg(cat.nombre)
        }));
        setCategorias(categoriasConEstilo);
      } else {
        toast.error("Error al cargar categorías");
        setCategorias([]);
      }
    } catch (error) {
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
        setGastos(response.data.data);
        console.log(response.data.data)
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

  const validarMonto = (value) => {
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

  const validarDescripcion = (value) => {
    if (!value) return "La descripción es requerida";
    if (value.length < 5) return "La descripción debe tener al menos 5 caracteres";
    if (value.length > 100) return "La descripción no puede exceder 100 caracteres";
    return null;
  };

  const handleCambioMonto = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
      const error = validarMonto(value);
      setErrors((prev) => ({ ...prev, amount: error }));
    }
  };

  const handleCambioDescripc = (e) => {
    const value = e.target.value;
    setDescription(value);
    const error = validarDescripcion(value);
    setErrors((prev) => ({ ...prev, description: error }));
  };

  const handleSeleccCateg = (category) => {
    setSelectedCategory(category);
    setErrors((prev) => ({ ...prev, category: null }));
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!selectedCategory) {
      newErrors.category = "Debe seleccionar una categoría";
    }

    const amountError = validarMonto(amount);
    if (amountError) {
      newErrors.amount = amountError;
    }

    const descriptionError = validarDescripcion(description);
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
          idEspacio: parseInt(espacioActual.idEspacio),
          idUsuario: idUsuario
        };

        if (editandoGasto && !esAdmin) {
          toast.error("Solo los administradores pueden editar gastos");
          return;
        }

        if (editandoGasto) {
          await axiosInstance.put(`${API_URL}/api/gastos/editar/${editandoGasto.idGasto}`, payload);
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
    setAmount(gasto.cantidad?.toString() || gasto.monto?.toString() || "");
    setDescription(gasto.descripcion);

    const categoria = categorias.find(cat => cat.id === gasto.idTipoGasto);
    if (categoria) {
      setSelectedCategory(categoria);
    }

    setShowModal(true);
  };

  const handleCloseCompleteModal = () => {
    setShowCompleteModal(false);
    setSelectedMember(null);
  };

  const gastosPorMiembro = (miembroId) => {
    return gastos.filter(gasto => gasto.idUsuario === miembroId);
  };

  const obtenerMiembrosConGastos = async () => {
    try {
      const miembrosConPagos = await Promise.all(
        miembros.map(async (miembro) => {
          if (miembro.id === idUsuario) return null;

          try {
            const response = await axiosInstance.get(`${urlPagos}${miembro.id}/${idEspacio}`);
            const pagosData = response.data?.data ?? [];

            const gastosPendientes = gastosPorMiembro(miembro.id).filter(gasto => {
              const pago = pagosData.find(p => Number(p.idGasto) === Number(gasto.idGasto));
              return !pago || !pago.estatus;
            });

            return {
              id: miembro.id,
              name: miembro.nombreusuario,
              avatar: miembro.nombreusuario.charAt(0).toUpperCase(),
              gastosPendientes: gastosPendientes.map(gasto => {
                const categoria = categorias.find(cat => cat.id === gasto.idTipoGasto);
                const pagoCorrespondiente = pagosData.find(p => Number(p.idGasto) === Number(gasto.idGasto));
                return {
                  id: gasto.idGasto,
                  description: gasto.descripcion,
                  amount: pagoCorrespondiente
                    ? parseFloat(pagoCorrespondiente.monto || 0)
                    : parseFloat(gasto.monto || gasto.cantidad || 0),
                  category: categoria?.nombre || 'Sin categoría',
                  color: categoria?.color || '#6b7280',
                  icon: categoria?.nombre?.charAt(0)?.toUpperCase() || '?',
                  dueDate: gasto.fecha ? new Date(gasto.fecha).toLocaleDateString() : 'Sin fecha',
                  idCategoria: gasto.idTipoGasto,
                  pagoId: pagoCorrespondiente?.id || null
                };
              })
            };
          } catch (error) {
            toast.error(`Error cargando pagos del miembro ${miembro.nombreusuario}`);
            return {
              id: miembro.id,
              name: miembro.nombreusuario,
              avatar: miembro.nombreusuario.charAt(0).toUpperCase(),
              gastosPendientes: []
            };
          }
        })
      );

      return miembrosConPagos.filter(miembro => miembro !== null);
    } catch (error) {
      toast.error("Error obteniendo miembros con gastos");
      return [];
    }
  };

  const gastosDelUsuario = gastos.filter(gasto => {
    const pago = pagos.find(p => Number(p.idGasto) === Number(gasto.idGasto));
    return gasto.idUsuario == idUsuario;
  });

  const handleMiembroSelecc = async (member) => {
    setCargando(true);
    try {
      const response = await axiosInstance.get(`${urlPagos}${member.id}/${idEspacio}`);
      const pagosData = response.data?.data ?? [];

      const gastosPendientes = gastosPorMiembro(member.id)
        .filter(gasto => {
          const pago = pagosData.find(p => Number(p.idGasto) === Number(gasto.idGasto));
          return !pago || !pago.estatus;
        })
        .map(gasto => {
          const categoria = categorias.find(cat => cat.id === gasto.idTipoGasto);
          const pagoCorrespondiente = pagosData.find(p => Number(p.idGasto) === Number(gasto.idGasto));
          return {
            id: gasto.idGasto,
            description: gasto.descripcion,
            amount: pagoCorrespondiente
              ? parseFloat(pagoCorrespondiente.monto || 0)
              : parseFloat(gasto.monto || gasto.cantidad || 0),
            category: categoria?.nombre || 'Sin categoría',
            color: categoria?.color || '#6b7280',
            icon: categoria?.nombre?.charAt(0)?.toUpperCase() || '?',
            dueDate: gasto.fecha ? new Date(gasto.fecha).toLocaleDateString() : 'Sin fecha',
            idCategoria: gasto.idTipoGasto,
            pagoId: pagoCorrespondiente?.id || null
          };
        });

      setPagoInvitado(pagosData);
      setSelectedMember({
        id: member.id,
        name: member.name,
        avatar: member.avatar,
        gastosPendientes
      });
      toast.success(`Datos de ${member.name} cargados correctamente`);
    } catch (error) {
      toast.error("No se pudieron cargar los pagos del miembro");
    } finally {
      setCargando(false);
    }
  };

  const marcarComoPagado = async (pagoId) => {
    if (!pagoId) {
      toast.error("No se pudo encontrar el ID del pago");
      return;
    }

    const url = urlPagosStatus + pagoId;
    setCargando(true);
    try {
      const response = await axiosInstance.patch(url);
      if (response.data.status == "OK") {
        toast.success("Se ha marcado el pago como completado");
        await cargarGastos();
        await cargarPagos();
      } else {
        toast.error("Error al completar el pago");
      }
    } catch (error) {
      toast.error("Error al completar el pago");
    } finally {
      setCargando(false);
    }
  };

  const completarPagoMiembro = async (expenseId) => {
    const url = urlPagosStatus + expenseId;

    try {
      const response = await axiosInstance.patch(url);
      if (response.data.status == "OK") {
        toast.success("Se ha marcado el pago como completado");
        handleCloseCompleteModal();
        cargarDatosIniciales();
      } else {
        toast.error("Error al completar el pago del miembro");
      }
    } catch (error) {
      toast.error("Error al completar el pago del miembro");
    }
  };

  useEffect(() => {
    if (!showCompleteModal) return;

    const cargarMiembrosConGastos = async () => {
      setCargando(true);
      try {
        const miembrosData = await obtenerMiembrosConGastos();
        setSpaceMembers(miembrosData);
      } catch (error) {
        toast.error("Error cargando miembros con gastos");
      } finally {
        setCargando(false);
      }
    };

    cargarMiembrosConGastos();
  }, [showCompleteModal, miembros, gastos, categorias]);

  const gastosDelUsuarioFiltrados = gastosDelUsuario.filter(gasto => {
    if (!soloNoPagados) return true;

    const pago = pagos.find(p => Number(p.idGasto) === Number(gasto.idGasto));
    return !pago?.estatus;
  });

  return (
    <div className="gasto-container">
      <div className="gasto-header">
        <div className="gasto-title">
          <h1>Gastos</h1>
          <p>Gestiona los gastos del espacio: {nombreEspacio}</p>
        </div>
        <div className="gasto-header-actions">
          {esAdmin && (
            <>
              <label className="gasto-filter-checkbox">
                <input
                  type="checkbox"
                  checked={soloNoPagados}
                  onChange={(e) => setSoloNoPagados(e.target.checked)}
                />
                <span className="gasto-checkbox-text">Solo no pagados</span>
              </label>
              <button className="gasto-complete-button" onClick={() => setShowCompleteModal(true)}>
                <span>✅</span>
                Completar Gastos
              </button>
            </>
          )}
          <button className="gasto-add-button" onClick={() => setShowModal(true)}>
            <span>+</span>
            Agregar Gasto
          </button>
        </div>
      </div>

      <div className="gasto-list-container">
        {cargando ? (
          <div className="gasto-loading">Cargando pagos...</div>
        ) : gastosDelUsuarioFiltrados.length > 0 ? (
          <div className="gasto-list">
            {gastosDelUsuarioFiltrados.map((gasto, index) => {
              const categoria = categorias.find(cat => cat.id === gasto.idTipoGasto);
              const pago = pagos.find(p => Number(p.idGasto) === Number(gasto.idGasto));

              return (
                <div key={gasto.id || index} className="gasto-item">
                  <div className="gasto-item-left">
                    <div
                      className="gasto-category-icon"
                      style={{
                        backgroundColor: (categoria?.color || "#6b7280") + "20",
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
                        !pago?.estatus ? (
                          <div className="acciones-horizontal">
                            <button
                              className="gasto-pay-button"
                              onClick={() => marcarComoPagado(pago?.id)}
                              disabled={cargando || !pago?.id}
                            >
                              Marcar como Pagado
                            </button>
                            <button
                              className="small-button edit"
                              onClick={() => handleEditGasto(gasto)}
                            >
                              ✏️
                            </button>
                          </div>
                        ) : (
                          <div className="acciones-horizontal">
                            <span className="gasto-paid-status">✅ Pagado</span>
                            <button
                              className="small-button edit"
                              onClick={() => handleEditGasto(gasto)}
                            >
                              ✏️
                            </button>
                          </div>
                        )
                      ) : (
                        pago?.estatus ? (
                          <div className="acciones-horizontal">
                            <span className="gasto-paid-status">✅ Pagado</span>
                          </div>
                        ) : null
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : soloNoPagados ? (
          <div className="gasto-empty-state">
            <div className="gasto-empty-icon">✅</div>
            <h3 className="gasto-empty-title">¡Todos pagados!</h3>
            <p className="gasto-empty-message">No tienes pagos pendientes por realizar</p>
          </div>
        ) : (
          <div className="gasto-empty-state">
            <div className="gasto-empty-icon">✅</div>
            <h3 className="gasto-empty-title">¡Excelente!</h3>
            <p className="gasto-empty-message">No tienes gastos registrados</p>
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
                          onClick={() => handleSeleccCateg(category)}
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
                        onChange={handleCambioMonto}
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
                      onChange={handleCambioDescripc}
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

      {showCompleteModal && (
        <div className="gasto-modal-overlay" onClick={handleCloseCompleteModal}>
          <div className="gasto-modal gasto-complete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gasto-modal-header">
              <h2 className="gasto-modal-title">
                {!selectedMember ? "Completar Gastos de Miembros" : `Completar Gastos de ${selectedMember.name}`}
              </h2>
              <button className="gasto-modal-close" onClick={handleCloseCompleteModal}>
                ✕
              </button>
            </div>

            <div className="gasto-modal-content">
              {!selectedMember ? (
                <div className="gasto-member-selection">
                  <h3 className="gasto-step-title">Selecciona un miembro para completar sus gastos</h3>
                  {spaceMembers.length === 0 ? (
                    <div className="gasto-no-members">
                      <div className="gasto-no-members-icon">👥</div>
                      <h4 className="gasto-no-members-title">No hay otros miembros</h4>
                      <p className="gasto-no-members-message">
                        No hay otros miembros en este espacio para gestionar sus gastos
                      </p>
                    </div>
                  ) : (
                    <div className="gasto-members-list">
                      {spaceMembers.map((member) => (
                        <button key={member.id} className="gasto-member-card" onClick={() => handleMiembroSelecc(member)}>
                          <div className="gasto-member-card-left">
                            <div className="gasto-member-avatar">{member.avatar}</div>
                            <div className="gasto-member-info">
                              <h4 className="gasto-member-name">{member.name}</h4>
                            </div>
                          </div>
                          <div className="gasto-member-card-right">
                            <div className="gasto-pending-count">
                              {member.gastosPendientes.length > 0 ? (
                                <>
                                  <span className="gasto-count-number">{member.gastosPendientes.length}</span>
                                  <span className="gasto-count-label">
                                    {member.gastosPendientes.length === 1 ? "Gasto pendiente" : "Gastos pendientes"}
                                  </span>
                                </>
                              ) : (
                                <span className="gasto-no-pending">Sin gastos pendientes</span>
                              )}
                            </div>
                            <div className="gasto-arrow">→</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="gasto-member-expenses">
                  <div className="gasto-selected-member">
                    <div className="gasto-selected-member-avatar">{selectedMember.avatar}</div>
                    <div className="gasto-selected-member-info">
                      <h4 className="gasto-selected-member-name">{selectedMember.name}</h4>
                    </div>
                    <button className="gasto-change-member" onClick={() => setSelectedMember(null)}>
                      Cambiar Miembro
                    </button>
                  </div>

                  {selectedMember.gastosPendientes && selectedMember.gastosPendientes.length > 0 ? (
                    <div className="gasto-member-expenses-list">
                      <h4 className="gasto-expenses-title">
                        Gastos Pendientes ({selectedMember.gastosPendientes.length})
                      </h4>
                      <div className="gasto-total-pending">
                        <span className="gasto-total-label">Total pendiente:</span>
                        <span className="gasto-total-amount">
                          ${selectedMember.gastosPendientes.reduce((total, gasto) => total + gasto.amount, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      {selectedMember.gastosPendientes.map((gasto) => (
                        <div key={gasto.id} className="gasto-member-expense-item">
                          <div className="gasto-member-expense-left">
                            <div className="gasto-member-expense-icon"
                              style={{ backgroundColor: gasto.color + "20", color: gasto.color }}
                            >
                              {gasto.icon}
                            </div>
                            <div className="gasto-member-expense-info">
                              <h5 className="gasto-member-expense-title">{gasto.description}</h5>
                              <div className="gasto-member-expense-meta">
                                <span className="gasto-member-expense-category">{gasto.category}</span>
                                <span className="gasto-member-expense-date">Fecha: {gasto.dueDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="gasto-member-expense-right">
                            <div className="gasto-member-expense-amount">
                              ${gasto.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>
                            <button
                              className="gasto-complete-expense-button"
                              onClick={() => completarPagoMiembro(gasto.pagoId)}
                              disabled={cargando}
                            >
                              {cargando ? 'Procesando...' : 'Marcar Completado'}
                            </button>
                          </div>
                        </div>
                      ))}

                    </div>
                  ) : (
                    <div className="gasto-no-expenses">
                      <div className="gasto-no-expenses-icon">✅</div>
                      <h4 className="gasto-no-expenses-title">Sin gastos pendientes</h4>
                      <p className="gasto-no-expenses-message">
                        {selectedMember.name} no tiene gastos pendientes por completar
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};