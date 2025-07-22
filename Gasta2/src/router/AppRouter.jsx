import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import IniciarSesion from '../../src/auth/IniciarSesion';
import Registrarse from '../../src/auth/Registrarse';
import RecuperarContraseña from '../auth/RecuperarContrasena';
import RestablecerContraseña from '../auth/RestablecerContrasena';
import RequisitoContraseña from '../auth/RequisitoContrasena';
import Hub from '../../src/screens/Hub';
import Layout from '../../src/components/Layout';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/IniciarSesion" replace />} />
                <Route path="/IniciarSesion" element={<IniciarSesion />} />
                <Route path="/Registrarse" element={<Registrarse />} />
                <Route path="/RecuperarContrasena" element={<RecuperarContrasena />} />
                <Route path="/RestablecerContrasena" element={<RestablecerContrasena />} />
                <Route path="/RequisitoContrasena" element={<RequisitoContrasena />} />
                
                {/* Ruta protegida del dashboard */}
                <Route path="/Hub" element={
                    
                        <Hub />
        
                } />
                
                {/* Redirección para rutas no encontradas */}
                <Route path="*" element={<Navigate to="/IniciarSesion" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;