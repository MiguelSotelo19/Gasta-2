import React from 'react';
import '../../../Gasta2/src/screens/css/auth.css';

const RequisitoContrasena = ({ contrasena }) => {
    const requisitos = {
        longitud: contrasena.length >= 8,
        letra: /[a-zA-Z]/.test(contrasena),
        numero: /\d/.test(contrasena),
        especial: /[!@#$%^&*(),.?":{}|<>]/.test(contrasena)
    };

    return (
        <div className="requisitos-contrasena">
            <div className={`requisito ${requisitos.longitud ? 'valido' : 'invalido'}`}>
                <i className={`fas fa-${requisitos.longitud ? 'check' : 'times'}`}></i>
                <span>Mínimo 8 caracteres</span>
            </div>
            <div className={`requisito ${requisitos.letra ? 'valido' : 'invalido'}`}>
                <i className={`fas fa-${requisitos.letra ? 'check' : 'times'}`}></i>
                <span>Al menos una letra</span>
            </div>
            <div className={`requisito ${requisitos.numero ? 'valido' : 'invalido'}`}>
                <i className={`fas fa-${requisitos.numero ? 'check' : 'times'}`}></i>
                <span>Al menos un número</span>
            </div>
            <div className={`requisito ${requisitos.especial ? 'valido' : 'invalido'}`}>
                <i className={`fas fa-${requisitos.especial ? 'check' : 'times'}`}></i>
                <span>Al menos un carácter especial</span>
            </div>
        </div>
    );
};

export default RequisitoContrasena;