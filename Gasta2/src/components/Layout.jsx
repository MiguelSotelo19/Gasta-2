import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Lógica para cerrar sesión
        navigate('/IniciarSesion'); // Redirige a la página de inicio de sesión
    };

    return (
        <div>
            <header style={{
                backgroundColor: '#4a90e2',
                padding: '1rem',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1>GASTA2</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'transparent',
                        border: '1px solid white',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Cerrar Sesión
                </button>
            </header>

            <main style={{ padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;