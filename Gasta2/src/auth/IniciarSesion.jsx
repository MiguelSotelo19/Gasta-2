import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../Gasta2/src/screens/css/auth.css';
import { FaEye, FaEyeSlash, FaDollarSign } from 'react-icons/fa';

// Obtener usuarios de localStorage o usar los predeterminados
const getUsers = () => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [
        { nip: 'mgonzalez', nombre: 'María González', correo: 'maria@ejemplo.com', contrasena: 'password123' }
    ];
};

const IniciarSesion = ({ onAutenticacionExitosa }) => {
    const [identificador, setIdentificador] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navegar = useNavigate();

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!identificador || !contrasena) {
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

        try {
            const users = getUsers();
            const usuario = users.find(u =>
                (u.nip === identificador || u.correo === identificador) &&
                u.contrasena === contrasena
            );

            if (!usuario) {
                throw new Error('Credenciales inválidas');
            }

            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: `Hola ${usuario.nombre}`,
                timer: 1500,
                showConfirmButton: false
            });

            if (onAutenticacionExitosa) {
                onAutenticacionExitosa(usuario);
            }
            navegar('/Hub'); // Redirigir al dashboard

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
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
                    <FaDollarSign className="logo-icon" />
                    <div className="texto-marca">FinanceFamily</div>
                    <div className="subtitulo">Gestión Familiar</div>
                </div>

                <form onSubmit={manejarEnvio}>
                    <div className="form-group">
                        <label htmlFor="identificadorLogin" className="etiqueta-formulario">
                            NIP o Correo Electrónico
                        </label>
                        <input
                            type="text"
                            className="control-formulario"
                            id="identificadorLogin"
                            value={identificador}
                            onChange={(e) => setIdentificador(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group password-group">
                        <label htmlFor="contrasenaLogin" className="etiqueta-formulario">
                            Contraseña
                        </label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="control-formulario"
                                id="contrasenaLogin"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primario"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading"></span> Procesando...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        className="btn btn-secundario"
                        onClick={() => navegar('/RecuperarContraseña')}
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                <div className="divisor">
                    <span>¿No tienes cuenta?</span>
                </div>

                <button
                    className="btn btn-secundario"
                    onClick={() => navegar('/Registrarse')}
                >
                    Registrarse
                </button>
            </div>
        </div>
    );
};

export default IniciarSesion;