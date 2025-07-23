import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash, FaDollarSign } from 'react-icons/fa';
import RequisitoContrasena from './RequisitoContrasena';
import '../../../Gasta2/src/screens/css/auth.css';

const Registrarse = ({ onAutenticacionExitosa }) => {
    const [nip, setNip] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navegar = useNavigate();

    const validarContrasena = (contrasena) => {
        return {
            longitud: contrasena.length >= 8,
            letra: /[a-zA-Z]/.test(contrasena),
            numero: /\d/.test(contrasena),
            especial: /[!@#$%^&*(),.?":{}|<>]/.test(contrasena)
        };
    };

    const handleNIPChange = (e) => {
        const value = e.target.value.replace(/\s/g, '');
        if (value.length <= 15) {
            setNip(value);
        }
    };

    const handleNombreChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        if (value.length <= 30) {
            setNombre(value);
        }
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!nip || !nombre || !correo || !contrasena || !confirmarContrasena) {
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

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            Swal.fire({
                icon: 'error',
                title: 'Email inválido',
                text: 'Por favor ingresa un email válido',
                timer: 3000,
                showConfirmButton: false
            });
            setLoading(false);
            return;
        }

        if (nip.length < 3) {
            Swal.fire({
                icon: 'error',
                title: 'NIP inválido',
                text: 'El NIP debe tener al menos 3 caracteres',
                timer: 3000,
                showConfirmButton: false
            });
            setLoading(false);
            return;
        }

        const requisitos = validarContrasena(contrasena);
        if (!requisitos.longitud || !requisitos.letra || !requisitos.numero || !requisitos.especial) {
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

        if (contrasena !== confirmarContrasena) {
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
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const usuarioExistente = users.find(u => u.nip === nip || u.correo === correo);
            
            if (usuarioExistente) {
                throw new Error('NIP o correo ya registrado');
            }

            const nuevoUsuario = {
                nip,
                nombre,
                correo,
                contrasena
            };

            await new Promise(resolve => setTimeout(resolve, 1000));
            localStorage.setItem('users', JSON.stringify([...users, nuevoUsuario]));

            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                if (onAutenticacionExitosa) {
                    onAutenticacionExitosa(nuevoUsuario);
                }
                navegar('/IniciarSesion');
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
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
                    <div className="texto-marca">Gasta2</div>
                    <div className="subtitulo">Gestión Familiar</div>
                </div>

                <form onSubmit={manejarEnvio}>
                    <div className="form-group">
                        <label htmlFor="nipRegistro" className="etiqueta-formulario">
                            NIP (Nombre de Usuario)
                        </label>
                        <input
                            type="text"
                            className="control-formulario"
                            id="nipRegistro"
                            value={nip}
                            onChange={handleNIPChange}
                            maxLength={15}
                            required
                        />
                        <small>Máximo 15 caracteres (sin espacios)</small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombreRegistro" className="etiqueta-formulario">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            className="control-formulario"
                            id="nombreRegistro"
                            value={nombre}
                            onChange={handleNombreChange}
                            maxLength={30}
                            required
                        />
                        <small>Máximo 30 letras (se aceptan espacios entre nombres)</small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="correoRegistro" className="etiqueta-formulario">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            className="control-formulario"
                            id="correoRegistro"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group password-group">
                        <label htmlFor="contrasenaRegistro" className="etiqueta-formulario">
                            Contraseña
                        </label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="control-formulario"
                                id="contrasenaRegistro"
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
                        <RequisitoContrasena contrasena={contrasena} />
                    </div>
                    
                    <div className="form-group password-group">
                        <label htmlFor="confirmarContrasenaRegistro" className="etiqueta-formulario">
                            Confirmar Contraseña
                        </label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="control-formulario"
                                id="confirmarContrasenaRegistro"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                required
                            />
                            <span 
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
                                <span className="loading"></span> Registrando...
                            </>
                        ) : (
                            'Registrarse'
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button 
                        className="btn btn-secundario"
                        onClick={() => navegar('/IniciarSesion')}
                    >
                        ¿Ya tienes cuenta? Inicia sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Registrarse;