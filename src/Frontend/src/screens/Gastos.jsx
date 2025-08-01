import { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";
import "./css/general.css";
import "./css/NuevoGasto.css";
import { getCategoriesByEspacio } from "../services/categoryService";

export const Gastos = ({ espacioActual, nombreEspacio }) => {
  // Estados
  const API_URL = import.meta.env.VITE_API_URL;
  const urlGastos = `${API_URL}/api/gastos/espacio/${espacioActual.idEspacio}`
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    cantidad: '',
    descripcion: '',
    idCategoria: '',
    idEspacio: espacioActual?.idEspacio || null,
    idUsuario: localStorage.getItem("userId") || null
  });
  const [errores, setErrores] = useState({
    cantidad: false,
    idCategoria: false
  });
  const [editandoGasto, setEditandoGasto] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [cargandoCategorias, setCargandoCategorias] = useState(false);

  // Cargar datos al cambiar el espacio actual
  useEffect(() => {
    if (espacioActual?.idEspacio) {
      setEsAdmin(espacioActual.rol === 'Administrador');
      setFormData(prev => ({ 
        ...prev, 
        idEspacio: espacioActual.idEspacio,
        idUsuario: localStorage.getItem("userId") 
      }));
      cargarDatosIniciales();
    }
  }, [espacioActual]);

  const cargarDatosIniciales = async () => {
    try {
      await Promise.all([cargarCategorias(), cargarGastos()]);
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    }
  };

  // Cargar categorías del espacio
  const cargarCategorias = async () => {
    if (!espacioActual?.idEspacio) return;
    
    setCargandoCategorias(true);
    try {
      const response = await getCategoriesByEspacio(espacioActual.idEspacio);
      
      if (response.data && Array.isArray(response.data)) {
        setCategorias(response.data);
      } else {
        console.error("Formato de categorías inválido:", response.data);
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

  // Cargar gastos del espacio
  const cargarGastos = async () => {
    if (!espacioActual?.idEspacio) return;
    
    setCargando(true);
    try {
      const response = await axiosInstance.get(urlGastos);
      
      if (response.data && Array.isArray(response.data.data)) {
        setGastos(response.data.data);
      } else {
        console.error("Formato de gastos inválido:", response.data);
        toast.error("Error al cargar gastos");
        setGastos([]);
      }
    } catch (error) {
      console.error("Error cargando gastos:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 403) {
        toast.error("No tienes permisos para ver estos gastos");
      } else {
        toast.error("Error al cargar los gastos. Verifica tu conexión.");
      }
      
      setGastos([]);
    } finally {
      setCargando(false);
    }
  };

  // Validar campos del formulario
  const validarCampos = () => {
    const nuevosErrores = {
      cantidad: !formData.cantidad || isNaN(formData.cantidad) || parseFloat(formData.cantidad) <= 0,
      idCategoria: !formData.idCategoria
    };
    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some(error => error);
  };

  // Manejador de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    if (name === 'cantidad' || name === 'idCategoria') {
      setErrores(prev => ({
        ...prev,
        [name]: name === 'cantidad' 
          ? !value || isNaN(value) || parseFloat(value) <= 0
          : !value
      }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarCampos()) {
      toast.error("Complete los campos obligatorios correctamente");
      return;
    }

    setCargando(true);
    try {
      const payload = {
        cantidad: parseFloat(formData.cantidad),
        descripcion: formData.descripcion,
        idCategoria: parseInt(formData.idCategoria),
        idEspacio: parseInt(formData.idEspacio),
        //idUsuario: parseInt(formData.idUsuario)
      };

      if (editandoGasto) {
        await axiosInstance.put(`${API_URL}/api/gastos/editar/${editandoGasto.id}`, payload);
        toast.success("Gasto actualizado correctamente");
      } else {
        await axiosInstance.post(`${API_URL}/api/gastos/registrar`, payload);
        toast.success("Gasto registrado correctamente");
      }

      resetearFormulario();
      await cargarGastos();
      
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Error al procesar la solicitud";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                     (error.response.status === 403 ? "No tienes permisos de administrador" : errorMessage);
      }
      
      toast.error(errorMessage);
    } finally {
      setCargando(false);
    }
  };

  // Editar gasto existente
  const handleEditarGasto = (gasto) => {
    setEditandoGasto(gasto);
    setFormData({
      cantidad: gasto.cantidad.toString(),
      descripcion: gasto.descripcion || '',
      idCategoria: gasto.idCategoria.toString(),
      idEspacio: espacioActual.idEspacio,
      idUsuario: localStorage.getItem("userId")
    });
    setMostrarFormulario(true);
  };

  // Cancelar edición/creación
  const handleCancelar = () => {
    resetearFormulario();
  };

  // Resetear formulario
  const resetearFormulario = () => {
    setFormData({ 
      cantidad: '',
      descripcion: '',
      idCategoria: '',
      idEspacio: espacioActual.idEspacio,
      idUsuario: localStorage.getItem("userId")
    });
    setMostrarFormulario(false);
    setEditandoGasto(null);
  };

  // Render
  if (!espacioActual) {
    return (
      <div className="empty-state">
        <p>Selecciona un espacio primero para gestionar gastos</p>
      </div>
    );
  }

  return (
    <div className="gastos-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Gastos</h1>
          <p>Administra los gastos de: {nombreEspacio}</p>
        </div>
        <button 
          className="primary-button"
          onClick={() => mostrarFormulario ? handleCancelar() : setMostrarFormulario(true)}
          disabled={cargando || cargandoCategorias}
        >
          {mostrarFormulario ? 'Cancelar' : '+ Nuevo Gasto'}
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="nuevo-gasto-container">
          <h3>{editandoGasto ? 'Editar Gasto' : 'Nuevo Gasto'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Categoría *</label>
              {cargandoCategorias ? (
                <div className="loading-message">Cargando categorías...</div>
              ) : categorias.length === 0 ? (
                <div className="error-message">
                  No hay categorías disponibles. Crea categorías primero.
                </div>
              ) : (
                <>
                  <select
                    name="idCategoria"
                    value={formData.idCategoria}
                    onChange={handleChange}
                    className={errores.idCategoria ? 'error' : ''}
                    disabled={cargando}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                  {errores.idCategoria && (
                    <span className="error-message">Seleccione una categoría</span>
                  )}
                </>
              )}
            </div>

            <div className="form-group">
              <label>Cantidad *</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={errores.cantidad ? 'error' : ''}
                disabled={cargando}
                placeholder="0.00"
              />
              {errores.cantidad && (
                <span className="error-message">
                  {!formData.cantidad ? 'Campo requerido' : 'Debe ser mayor a 0'}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Descripción (opcional)</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                disabled={cargando}
                placeholder="Descripción del gasto"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleCancelar}
                disabled={cargando}
                className="secondary-button"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={cargando || categorias.length === 0}
                className="primary-button"
              >
                {cargando ? 'Procesando...' : editandoGasto ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de gastos */}
      <div className="historial-gastos">
        <h3>Historial</h3>
        
        {cargando && gastos.length === 0 ? (
          <div className="loading-message">Cargando gastos...</div>
        ) : gastos.length === 0 ? (
          <div className="empty-state">
            <p>No hay gastos registrados</p>
            {!mostrarFormulario && (
              <button 
                className="primary-button"
                onClick={() => setMostrarFormulario(true)}
                style={{ marginTop: '1rem' }}
              >
                Crear primer gasto
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="gastos-table">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Fecha</th>
                  {esAdmin && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {gastos.map(gasto => {
                  const categoria = categorias.find(c => c.id === gasto.idCategoria);
                  return (
                    <tr key={gasto.id}>
                      <td>{categoria?.nombre || 'Sin categoría'}</td>
                      <td>{gasto.descripcion || '-'}</td>
                      <td>${gasto.cantidad.toFixed(2)}</td>
                      <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                      {esAdmin && (
                        <td>
                          <button 
                            onClick={() => handleEditarGasto(gasto)}
                            disabled={cargando}
                            className="edit-button"
                          >
                            ✏️ Editar
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};