import { useState, useEffect } from "react";
import "../screens/css/Modal.css"; // Asegúrate de tener estilos para el modal

const ModalEditarGasto = ({
    abierto,
    onClose,
    onGuardar,
    categorias,
    formData,
    setFormData,
    cargando
}) => {
    const [errores, setErrores] = useState({
        cantidad: false,
        idCategoria: false
    });

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

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validarCampos()) {
            onGuardar();
        }
    };

    // Cerrar modal con Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (abierto) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [abierto, onClose]);

    if (!abierto) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Editar Gasto</h3>
                    <button
                        className="modal-close-button"
                        onClick={onClose}
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Categoría *</label>
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
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={cargando}
                            className="secondary-button"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando}
                            className="primary-button"
                        >
                            {cargando ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEditarGasto;