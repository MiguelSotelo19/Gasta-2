import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../Gasta2/src/screens/css/auth.css';

const RestablecerContrasena = () => {
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarNuevaContrasena, setConfirmarNuevaContrasena] = useState('');
    const [loading, setLoading] = useState(false);
    const navegar = useNavigate();

    const validarContrasena = (contrasena) => {
        return {
            longitud: contrasena.length >= 8,
            letra: /[a-zA-Z]/.test(contrasena),
            numero: /\d/.test(contrasena)
        };
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!nuevaContrasena || !confirmarNuevaContrasena) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor completa todos los campos',
                timer: 3000,
                showConfirmButton: false
            });
            setLoading(false);
            return;
        }

        const requisitos = validarContrasena(nuevaContrasena);
        if (!requisitos.longitud || !requisitos.letra || !requisitos.numero) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña inválida',
                text: 'La contraseña debe cumplir con todos los requisitos',
                timer: 3000,
                showConfirmButton: false
            });
            setLoading(false);
            return;
        }

        if (nuevaContrasena !== confirmarNuevaContrasena) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                timer: 3000,
                showConfirmButton: false
            });
            setLoading(false);
            return;
        }

        try {
            // Simulación de éxito con timeout
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            Swal.fire({
                icon: 'success',
                title: '¡Contraseña restablecida!',
                text: 'Tu contraseña ha sido actualizada exitosamente',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navegar('/IniciarSesion');
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                timer: 3000,
                showConfirmButton: false
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <div className="contenedor-logo">
                    <div className="logo">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="texto-marca">Gasta2</div>
                    <div className="subtitulo">Gestión Familiar</div>
                </div>

                <form onSubmit={manejarEnvio}>
                    <div className="form-group">
                        <label htmlFor="nuevaContrasena" className="etiqueta-formulario">
                            Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            className="control-formulario"
                            id="nuevaContrasena"
                            value={nuevaContrasena}
                            onChange={(e) => setNuevaContrasena(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmarNuevaContrasena" className="etiqueta-formulario">
                            Confirmar Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            className="control-formulario"
                            id="confirmarNuevaContrasena"
                            value={confirmarNuevaContrasena}
                            onChange={(e) => setConfirmarNuevaContrasena(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading"></span> Procesando...
                            </>
                        ) : (
                            'Restablecer Contraseña'
                        )}
                    </button>
                    
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navegar('/IniciarSesion')}
                        style={{ marginTop: '1rem' }}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RestablecerContrasena;