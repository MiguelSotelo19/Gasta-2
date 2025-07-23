import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../Gasta2/src/screens/css/auth.css';
import { FaEye, FaEyeSlash, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';

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
            const response = await axios.post('http://127.0.0.1:8080/api/auth/signin', {
                correo: identificador,
                password: contrasena
            });

            const resp = response.data;

            if (resp.error) {
                throw new Error(resp.mensaje || 'Error en autenticación');
            }

            const token = resp.data.token;
            const id = resp.data.id;

            localStorage.setItem('token', token);
            localStorage.setItem('userId', id);

            await Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                text: 'Bienvenido a Gasta2',
                timer: 1500,
                showConfirmButton: false
            });

            if (onAutenticacionExitosa) {
                onAutenticacionExitosa({ id, token });
            }

            navegar('/Hub');

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: error.response?.data?.mensaje || error.message,
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
                    <div className="texto-marca">Gasta2</div>
                    <div className="subtitulo">Gestión Familiar</div>
                </div>

                <form onSubmit={manejarEnvio}>
                    <div className="form-group">
                        <label htmlFor="identificadorLogin" className="etiqueta-formulario">
                            Correo Electrónico
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
                        onClick={() => navegar('/RecuperarContrasena')}
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
