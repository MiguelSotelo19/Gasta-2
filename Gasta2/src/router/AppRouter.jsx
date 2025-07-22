import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import IniciarSesion from '../../src/auth/IniciarSesion';
import Registrarse from '../../src/auth/Registrarse';
import RecuperarContraseña from '../../src/auth/RecuperarContraseña';
import RestablecerContraseña from '../../src/auth/RestablecerContraseña';
import RequisitoContraseña from '../../src/auth/RequisitoContraseña';
import Hub from '../../src/screens/Hub';
import Layout from '../../src/components/Layout';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/IniciarSesion" replace />} />
                <Route path="/IniciarSesion" element={<IniciarSesion />} />
                <Route path="/Registrarse" element={<Registrarse />} />
                <Route path="/RecuperarContraseña" element={<RecuperarContraseña />} />
                <Route path="/RestablecerContraseña" element={<RestablecerContraseña />} />
                <Route path="/RequisitoContraseña" element={<RequisitoContraseña />} />
                
                {/* Ruta protegida del dashboard */}
                <Route path="/Hub" element={
                    <Layout>
                        <Hub />
                    </Layout>
                } />
                
                {/* Redirección para rutas no encontradas */}
                <Route path="*" element={<Navigate to="/IniciarSesion" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;