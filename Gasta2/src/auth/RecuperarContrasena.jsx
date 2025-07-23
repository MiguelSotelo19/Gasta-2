import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../Gasta2/src/screens/css/auth.css';

// Variable global simulada
const usuariosSimulados = [
    { nip: 'mgonzalez', correo: 'maria@ejemplo.com' }
];

const RecuperarContrasena = () => {
    const [identificador, setIdentificador] = useState('');
    const [loading, setLoading] = useState(false);
    const navegar = useNavigate();

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!identificador) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor ingresa tu NIP o correo electrónico',
                timer: 3000,
                showConfirmButton: false
            });
            setLoading(false);
            return;
        }

        try {
            // Simulación de verificación con timeout
            const usuarioExiste = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const existe = usuariosSimulados.some(u =>
                        u.nip === identificador || u.correo === identificador
                    );
                    if (existe) {
                        resolve(true);
                    } else {
                        reject(new Error('Usuario no encontrado'));
                    }
                }, 1000);
            });

            // Confirmación adicional antes de enviar
            const confirmacion = await Swal.fire({
                title: '¿Estás seguro?',
                text: `Vamos a enviar el enlace a ${identificador.includes('@') ? 'tu correo electrónico' : 'tu NIP registrado'}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, enviar',
                cancelButtonText: 'Cancelar'
            });

            if (!confirmacion.isConfirmed) {
                setLoading(false);
                return;
            }

            Swal.fire({
                icon: 'success',
                title: '¡Enlace enviado!',
                text: 'Revisa tu correo electrónico para restablecer tu contraseña',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navegar('/RestablecerContraseña');
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
                        <label htmlFor="identificadorRecuperar" className="etiqueta-formulario">
                            NIP o Correo Electrónico
                        </label>
                        <input
                            type="text"
                            className="control-formulario"
                            id="identificadorRecuperar"
                            value={identificador}
                            onChange={(e) => setIdentificador(e.target.value)}
                            required
                        />
                        <div className="texto-ayuda">
                            Ingresa tu NIP o correo electrónico para recibir el enlace de recuperación
                        </div>
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
                            'Enviar Enlace de Recuperación'
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button 
                        className="btn btn-secondary"
                        onClick={() => navegar('/IniciarSesion')}
                    >
                        Volver al Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecuperarContrasena;